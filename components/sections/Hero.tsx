import Image from 'next/image'
import Button from '../ui/Button'
import Container from '../ui/Container'
import { ArrowRight } from 'lucide-react'

export default function Hero() {
  return (
    <section id="home" className="relative section-padding overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-orange-500/10 via-transparent to-transparent"></div>
      
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
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                icon={<ArrowRight size={20} />}
              >
                Explore Our Apps
              </Button>
            </div>
          </div>
          
          <div className="relative animate-slide-up">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500 rounded-3xl blur-3xl opacity-30 animate-glow"></div>
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