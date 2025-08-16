import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface ContactFormData {
  fullName: string
  email: string
  phone: string
  message: string
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json()
    const { fullName, email, phone, message } = body

    // Basic validation
    if (!fullName || !email || !message) {
      return NextResponse.json(
        { message: 'Full name, email, and message are required.' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Please provide a valid email address.' },
        { status: 400 }
      )
    }

    // Prepare email content
    const emailSubject = `New Contact Form Submission from ${fullName}`
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: #121212; color: white; padding: 30px; border-radius: 10px;">
          <h1 style="color: #667eea; margin-bottom: 20px;">New Contact Form Submission</h1>
          
          <div style="background-color: #1e293b; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #f1f5f9; margin-bottom: 15px;">Contact Information</h2>
            <p style="margin: 8px 0;"><strong>Full Name:</strong> ${fullName}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 8px 0;"><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          </div>
          
          <div style="background-color: #1e293b; padding: 20px; border-radius: 8px;">
            <h2 style="color: #f1f5f9; margin-bottom: 15px;">Message</h2>
            <p style="line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #374151; border-radius: 8px;">
            <p style="margin: 0; font-size: 14px; color: #d1d5db;">
              This message was sent from the VeilStudio contact form at ${new Date().toLocaleString()}.
            </p>
          </div>
        </div>
      </div>
    `

    const emailText = `
      New Contact Form Submission from VeilStudio

      Contact Information:
      - Full Name: ${fullName}
      - Email: ${email}
      - Phone: ${phone || 'Not provided'}

      Message:
      ${message}

      Submitted at: ${new Date().toLocaleString()}
    `

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'VeilStudio Contact <onboarding@resend.dev>',
      to: [process.env.CONTACT_EMAIL || 'rycwells@proton.me'],
      subject: emailSubject,
      html: emailHtml,
      text: emailText,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json(
        { message: 'Failed to send message. Please try again later.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        message: 'Message sent successfully!',
        id: data?.id 
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { message: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    )
  }
}