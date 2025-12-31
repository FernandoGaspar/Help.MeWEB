import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin } from 'lucide-react'

const footerLinks = {
  produto: [
    { name: 'Funcionalidades', href: '/#features' },
    { name: 'Como Funciona', href: '/#how-it-works' },
    { name: 'Serviços', href: '/#services' },
    { name: 'FAQ', href: '/#faq' },
  ],
  empresa: [
    { name: 'Sobre Nós', href: '/#about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Carreiras', href: '/carreiras' },
    { name: 'Contato', href: '/#contact' },
  ],
  legal: [
    { name: 'Termos de Uso', href: '/termos' },
    { name: 'Política de Privacidade', href: '/privacidade' },
    { name: 'Cookies', href: '/cookies' },
    { name: 'LGPD', href: '/lgpd' },
  ],
}

const socialLinks = [
  { name: 'Facebook', href: '#' },
  { name: 'Instagram', href: '#' },
  { name: 'LinkedIn', href: '#' },
  { name: 'Twitter', href: '#' },
]

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <img
                src="/logo.jpg"
                alt="Help.Me Logo"
                className="w-10 h-10 rounded-xl"
              />
              <span className="text-2xl font-bold">
                Help<span className="text-primary-400">.Me</span>
              </span>
            </Link>
            <p className="text-slate-400 mb-6 max-w-sm">
              Conectando você aos melhores profissionais do ramo automotivo.
              Sua solução completa para manutenção e serviços veiculares.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  aria-label={social.name}
                  className="w-10 h-10 bg-slate-800 hover:bg-primary-600 rounded-xl flex items-center justify-center transition-colors duration-200 text-sm font-medium"
                >
                  {social.name.charAt(0)}
                </a>
              ))}
            </div>
          </div>

          {/* Produto */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Produto</h3>
            <ul className="space-y-3">
              {footerLinks.produto.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-primary-400 transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Empresa</h3>
            <ul className="space-y-3">
              {footerLinks.empresa.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-primary-400 transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-slate-400 hover:text-primary-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <div className="flex flex-wrap gap-8 text-slate-400">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary-400" />
              <span>contato@helpme.com.br</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary-400" />
              <span>(11) 99999-9999</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary-400" />
              <span>São Paulo, SP - Brasil</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
            <p>© {new Date().getFullYear()} Help.Me. Todos os direitos reservados.</p>
            <p>Feito com dedicação no Brasil</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
