import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'

const navLinks = [
  { name: 'Início', href: '/' },
  { name: 'Funcionalidades', href: '/#features' },
  { name: 'Como Funciona', href: '/#how-it-works' },
  { name: 'Sobre Nós', href: '/#about' },
  { name: 'Contato', href: '/#contact' },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/95 backdrop-blur-lg shadow-lg py-3'
          : 'bg-transparent py-5'
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <img
                src={isScrolled ? "/logo.jpg" : "/logo_transparente.png"}
                alt="Help.Me Logo"
                className="w-10 h-10 rounded-xl shadow-lg group-hover:shadow-primary-500/50 transition-shadow duration-300"
              />
              {isScrolled && (
                <div className="absolute -inset-1 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
              )}
            </div>
            <span className={cn(
              'text-2xl font-bold transition-colors duration-300',
              isScrolled ? 'text-slate-900' : 'text-white'
            )}>
              Help<span className="text-primary-500">.Me</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors duration-200 hover:text-primary-500',
                  isScrolled ? 'text-slate-600' : 'text-white/90'
                )}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link to="/login">
              <Button
                variant={isScrolled ? 'ghost' : 'outline'}
                size="md"
                className={cn(
                  !isScrolled && 'border-white/30 text-white hover:bg-white/10'
                )}
              >
                Entrar
              </Button>
            </Link>
            <Link to="/cadastro">
              <Button variant="primary" size="md">
                Cadastre-se
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn(
              'lg:hidden p-2 rounded-xl transition-colors duration-200',
              isScrolled
                ? 'text-slate-600 hover:bg-slate-100'
                : 'text-white hover:bg-white/10'
            )}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-white border-t border-slate-100 shadow-lg"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-slate-600 hover:text-primary-500 hover:bg-slate-50 px-4 py-3 rounded-xl transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                ))}
                <hr className="my-2 border-slate-100" />
                <Link to="/login" className="w-full">
                  <Button variant="outline" className="w-full">
                    Entrar
                  </Button>
                </Link>
                <Link to="/cadastro" className="w-full">
                  <Button variant="primary" className="w-full">
                    Cadastre-se
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
