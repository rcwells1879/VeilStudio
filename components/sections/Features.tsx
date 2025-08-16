import Link from 'next/link'
import Container from '../ui/Container'
import Card from '../ui/Card'
import { Shield, Key, Zap } from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: 'Total Privacy',
    description: 'Run our apps completely offline with local models like Ollama and LM Studio. Your data never leaves your machine.',
    link: '/security'
  },
  {
    icon: Key,
    title: 'Limitless Flexibility',
    description: 'Plug in any API key you want. From OpenAI and Anthropic to custom backends, VeilStudio adapts to your workflow.',
  },
  {
    icon: Zap,
    title: 'Agentic Power',
    description: 'Go beyond simple chat. Our apps leverage advanced tools for web research, data analysis, and complex task execution.',
  },
]

export default function Features() {
  return (
    <section id="features" className="section-padding">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose <span className="gradient-text">Veil</span><span className="text-white">Studio</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Built on the principles of privacy, flexibility, and power. Your AI applications should work for you, not against you.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const CardContent = (
              <Card key={feature.title} className="text-center animate-slide-up hover:scale-105 transition-transform duration-300" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto">
                    <feature.icon size={32} className="text-white" />
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </Card>
            )

            return feature.link ? (
              <Link key={feature.title} href={feature.link}>
                {CardContent}
              </Link>
            ) : CardContent
          })}
        </div>
      </Container>
    </section>
  )
}