import Navigation from '@/components/Navigation'
import Footer from '@/components/sections/Footer'
import Container from '@/components/ui/Container'
import { Shield, Lock, Eye, Database, Wifi, Cookie, CheckCircle, FileText, Server, UserCheck } from 'lucide-react'

export const metadata = {
  title: 'Security & Privacy - VeilStudio',
  description: 'Learn about VeilStudio\'s comprehensive security measures, privacy protections, and safety protocols for AI applications.',
}

const securityFeatures = [
  {
    icon: Shield,
    title: 'Prompt Injection Protection',
    description: 'Advanced multi-layered defense system that prevents malicious prompt manipulation and unauthorized behavior modification through intelligent filtering and context awareness.',
    details: ['Real-time threat detection', 'Context boundary enforcement', 'Behavioral anomaly monitoring']
  },
  {
    icon: Lock,
    title: 'Code Injection Prevention',
    description: 'Enterprise-grade security barriers that eliminate unauthorized code execution vulnerabilities through comprehensive validation and isolation protocols.',
    details: ['Isolated execution environments', 'Advanced input sanitization', 'Security validation layers']
  },
  {
    icon: Eye,
    title: 'Private Search',
    description: 'All search operations are performed locally or through encrypted channels, ensuring your queries never leave your control or get stored by third parties.',
    details: ['Local search processing', 'Encrypted query transmission', 'Zero search logging']
  },
  {
    icon: Database,
    title: 'Local Storage Encryption',
    description: 'Military-grade encryption protects your conversations, API keys, and sensitive data with local-only storage that never leaves your device.',
    details: ['Military-grade encryption', 'Local-only storage', 'Automatic security updates']
  },
  {
    icon: Wifi,
    title: 'Offline Capability',
    description: 'Full functionality available without internet connectivity when using local AI models, ensuring complete data isolation and privacy.',
    details: ['Local model execution', 'Offline processing', 'Network-independent operation']
  },
  {
    icon: Cookie,
    title: 'Cookie-Free Experience',
    description: 'Zero tracking cookies or persistent identifiers. Your privacy is maintained through stateless interactions and local session management.',
    details: ['No tracking cookies', 'Stateless architecture', 'Local session management']
  },
  {
    icon: CheckCircle,
    title: 'Input/Output Validation',
    description: 'Industry-leading validation protocols ensure all inputs and outputs meet the highest security standards to prevent data exfiltration and malicious activity.',
    details: ['Industry compliance', 'Multi-stage validation', 'Content security monitoring']
  },
  {
    icon: FileText,
    title: 'Read-Only Tool Access',
    description: 'Local tool servers (MCP/REST API) operate with strict read-only permissions, preventing unauthorized modifications to your system or data.',
    details: ['Read-only file access', 'Permission restrictions', 'Audit logging']
  }
]

const securityStats = [
  { label: 'Security Layers', value: '8+', description: 'Multi-layered defense system' },
  { label: 'Encryption Standard', value: 'Military-Grade', description: 'Maximum security encryption' },
  { label: 'Data Retention', value: '0 Days', description: 'Zero cloud storage policy' },
  { label: 'Third-Party Access', value: 'None', description: 'Complete data isolation' }
]

export default function SecurityPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative section-padding overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-blue-500/10 via-transparent to-transparent"></div>
        
        <Container>
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-orange rounded-full text-sm font-medium">
              <Shield size={16} />
              Security & Privacy First
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Your Data, <span className="gradient-text">Your Fortress</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              At VeilStudio, security, privacy, and safety aren't afterthoughts—they're our foundation. 
              We're constantly evolving our defenses against emerging threats, ensuring your data remains 
              locked behind the VEIL.
            </p>
          </div>
        </Container>
      </section>

      {/* Security Stats */}
      <section className="section-padding bg-gradient-to-b from-transparent to-dark-900/50">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {securityStats.map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm font-medium text-white">{stat.label}</div>
                <div className="text-xs text-gray-400">{stat.description}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Security Features Grid */}
      <section className="section-padding">
        <Container>
          <div className="max-w-3xl mx-auto text-center space-y-6 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              <span className="gradient-text">Comprehensive Protection</span>
            </h2>
            <p className="text-lg text-gray-300">
              Every layer of our security architecture is designed to protect your most sensitive data 
              while maintaining the seamless AI experience you expect.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {securityFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  <div className="relative bg-gradient-to-br from-dark-800 to-dark-900 rounded-2xl p-8 border border-dark-700 hover:border-purple-500/30 transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                          <Icon size={24} className="text-white" />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                        <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                        <ul className="space-y-2">
                          {feature.details.map((detail, detailIndex) => (
                            <li key={detailIndex} className="flex items-center gap-2 text-sm text-gray-400">
                              <CheckCircle size={14} className="text-green-400 flex-shrink-0" />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Container>
      </section>

      {/* Security Architecture Diagram */}
      <section className="section-padding bg-gradient-to-b from-transparent to-dark-900/30">
        <Container>
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                <span className="gradient-text">Defense Architecture</span>
              </h2>
              <p className="text-lg text-gray-300">
                Our multi-layered security model ensures comprehensive protection at every level
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-3xl"></div>
              <div className="relative bg-gradient-to-br from-dark-800 to-dark-900 rounded-3xl p-8 border border-dark-700">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                      <UserCheck size={32} className="text-white" />
                    </div>
                    <h3 className="text-lg font-semibold">User Layer</h3>
                    <p className="text-sm text-gray-400">Input validation, authentication, and user permission controls</p>
                  </div>
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-orange rounded-full flex items-center justify-center mx-auto">
                      <Shield size={32} className="text-white" />
                    </div>
                    <h3 className="text-lg font-semibold">Application Layer</h3>
                    <p className="text-sm text-gray-400">Prompt injection prevention, output sanitization, and context control</p>
                  </div>
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                      <Server size={32} className="text-white" />
                    </div>
                    <h3 className="text-lg font-semibold">Infrastructure Layer</h3>
                    <p className="text-sm text-gray-400">Local storage encryption, offline capability, and secure tool access</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="section-padding">
        <Container>
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Experience <span className="gradient-text">Total Privacy</span>?
            </h2>
            <p className="text-lg text-gray-300">
              Join thousands of users who've taken control of their AI interactions with VeilStudio's 
              uncompromising security and privacy protections.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/#contact" className="btn-primary">
                Get Started Today
              </a>
              <a href="/" className="btn-secondary">
                Learn More
              </a>
            </div>
          </div>
        </Container>
      </section>

      <Footer />
    </main>
  )
}