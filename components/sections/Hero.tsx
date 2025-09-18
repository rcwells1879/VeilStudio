'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Button from '../ui/Button'
import Container from '../ui/Container'
import { ArrowRight } from 'lucide-react'

export default function Hero() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <section id="home" className="relative section-padding overflow-hidden z-20">
      <div className="absolute inset-0 bg-gradient-radial from-orange-500/10 via-transparent to-transparent -z-10"></div>
      
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex">
              <span className="btn-secondary">
                Privacy First
              </span>
            </div>
            
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Your AI, Your Keys,{' '}
                <span className="gradient-text">Your Control</span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-300 max-w-2xl">
                VeilStudio delivers powerful AI applications that put you in charge of your data and your models, from local workstations to the cloud.
              </p>
            </div>
            
            <div className="flex flex-col items-start">
              <Button 
                size="lg" 
                icon={<ArrowRight size={20} />}
                onClick={() => setIsExpanded(!isExpanded)}
              >
                Explore Our Apps
              </Button>

              <div className={`grid transition-all duration-500 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                  <div className="flex items-center gap-4 pt-4">
                    <Link href="https://veilstudio.io/veilpix/">
                      <Button size="lg" className="bg-gradient-to-br from-black to-teal-500 whitespace-nowrap">
                        VeilPix
                      </Button>
                    </Link>
                    <Link href="https://veilstudio.io/veilchat/">
                      <Button size="lg" className="bg-gradient-to-br from-black to-purple-500 whitespace-nowrap">
                        VeilChat (beta)
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative animate-slide-up">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500 rounded-3xl blur-3xl opacity-30 animate-glow -z-10"></div>
              <div className="relative bg-gradient-to-br from-dark-800 to-dark-900 rounded-3xl p-0 overflow-hidden">
                <div className="aspect-square rounded-2xl overflow-hidden">
                  <Image
                    src="/images/Hero2.png"
                    alt="VeilStudio Hero"
                    width={500}
                    height={500}
                    className="object-cover w-full h-full"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
