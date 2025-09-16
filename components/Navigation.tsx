'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Container from './ui/Container'
import { Menu, X, ChevronDown } from 'lucide-react'

const navigation = [
  { name: 'Home', href: '/#home' },
  { name: 'About', href: '/#about' },
  { name: 'Apps', href: '#', isDropdown: true },
  { name: 'Security', href: 'https://veilstudio.io/security/' },
  { name: 'Contact', href: '/#contact' },
]

const appsDropdownItems = [
  {
    name: 'VeilChat',
    href: 'https://veilstudio.io/veilchat/',
    color: 'text-purple-400 hover:text-purple-300',
    description: 'AI-powered chat application'
  },
  {
    name: 'VeilPix',
    href: 'https://veilstudio.io/veilpix/',
    color: 'text-teal-400 hover:text-teal-300',
    description: 'Privacy-focused image tools'
  },
]

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [appsDropdownOpen, setAppsDropdownOpen] = useState(false)
  const [mobileAppsOpen, setMobileAppsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setAppsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleAppsClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setAppsDropdownOpen(!appsDropdownOpen)
  }

  return (
    <nav className="sticky top-0 z-50 bg-dark-950/90 backdrop-blur-md border-b border-dark-800">
      <Container>
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              <span className="gradient-text">Veil</span><span className="text-white">Studio</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigation.map((item) => (
                item.isDropdown ? (
                  <div key={item.name} className="relative" ref={dropdownRef}>
                    <button
                      onClick={handleAppsClick}
                      className="text-gray-300 hover:text-white transition-colors duration-300 font-medium flex items-center gap-1"
                    >
                      {item.name}
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${appsDropdownOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {appsDropdownOpen && (
                      <div className="absolute top-full left-0 mt-2 w-64 bg-dark-900/95 backdrop-blur-md border border-dark-700 rounded-lg shadow-xl overflow-hidden animate-fade-in">
                        <div className="py-2">
                          {appsDropdownItems.map((app) => (
                            <Link
                              key={app.name}
                              href={app.href}
                              className="block px-4 py-3 hover:bg-dark-800/50 transition-colors duration-200 group"
                              onClick={() => setAppsDropdownOpen(false)}
                            >
                              <div className={`font-medium ${app.color} transition-colors duration-200`}>
                                {app.name}
                              </div>
                              <div className="text-sm text-gray-400 mt-1">
                                {app.description}
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-300 hover:text-white transition-colors duration-300 font-medium"
                  >
                    {item.name}
                  </Link>
                )
              ))}
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-300 hover:text-white"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-dark-800">
              {navigation.map((item) => (
                item.isDropdown ? (
                  <div key={item.name}>
                    <button
                      onClick={() => setMobileAppsOpen(!mobileAppsOpen)}
                      className="text-gray-300 hover:text-white w-full text-left px-3 py-2 text-base font-medium transition-colors duration-300 flex items-center justify-between"
                    >
                      {item.name}
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${mobileAppsOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {mobileAppsOpen && (
                      <div className="ml-4 mt-1 space-y-1">
                        {appsDropdownItems.map((app) => (
                          <Link
                            key={app.name}
                            href={app.href}
                            className={`block px-3 py-2 text-sm font-medium transition-colors duration-300 ${app.color}`}
                            onClick={() => {
                              setMobileMenuOpen(false)
                              setMobileAppsOpen(false)
                            }}
                          >
                            {app.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium transition-colors duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )
              ))}
            </div>
          </div>
        )}
      </Container>
    </nav>
  )
}