'use client'

import { useState } from 'react'
import Container from '../ui/Container'
import Button from '../ui/Button'
import { Send, CheckCircle, AlertCircle } from 'lucide-react'

interface FormData {
  fullName: string
  email: string
  phone: string
  message: string
}

interface FormStatus {
  type: 'idle' | 'loading' | 'success' | 'error'
  message: string
}

export default function ContactSection() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    message: ''
  })
  
  const [status, setStatus] = useState<FormStatus>({
    type: 'idle',
    message: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus({ type: 'loading', message: 'Sending message...' })

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setStatus({ type: 'success', message: 'Message sent successfully! We&apos;ll get back to you soon.' })
        setFormData({ fullName: '', email: '', phone: '', message: '' })
      } else {
        const error = await response.json()
        setStatus({ type: 'error', message: error.message || 'Failed to send message. Please try again.' })
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Network error. Please check your connection and try again.' })
    }
  }

  return (
    <section id="contact" className="relative section-padding overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-purple-500/5 via-transparent to-transparent"></div>
      
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">
              <span className="gradient-text">Ask us Anything</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              We offer custom chatbot solutions for startups, apps, etc. Let&apos;s get to work.
            </p>
          </div>

          <div className="relative animate-fade-in">
            <div className="absolute inset-0 bg-purple-500 rounded-3xl blur-3xl opacity-30 animate-glow"></div>
            <div className="relative bg-gradient-to-br from-dark-800 to-dark-900 rounded-3xl p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-dark-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-dark-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-dark-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                    placeholder="Enter your phone number (optional)"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-dark-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 transition-all duration-300 resize-none"
                    placeholder="Tell us about your project or ask us anything..."
                  />
                </div>

                {status.type !== 'idle' && (
                  <div className={`flex items-center gap-2 p-4 rounded-lg ${
                    status.type === 'success' ? 'bg-green-900/20 border border-green-700 text-green-300' :
                    status.type === 'error' ? 'bg-red-900/20 border border-red-700 text-red-300' :
                    'bg-blue-900/20 border border-blue-700 text-blue-300'
                  }`}>
                    {status.type === 'success' && <CheckCircle size={20} />}
                    {status.type === 'error' && <AlertCircle size={20} />}
                    <span>{status.message}</span>
                  </div>
                )}

                <div className="flex justify-center">
                  <Button 
                    type="submit"
                    size="lg"
                    disabled={status.type === 'loading'}
                    icon={<Send size={20} />}
                  >
                    {status.type === 'loading' ? 'Sending...' : 'Send Message'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}