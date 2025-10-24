import { Link, useLocation, Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { FaFacebook, FaTiktok, FaInstagram } from 'react-icons/fa'
import Logo from './Logo'

export default function PublicLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  const navigation = [
    { 
      name: 'Home', 
      href: '/',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    { 
      name: 'Church Voting', 
      href: '/vote',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    { 
      name: 'National Voting', 
      href: '/vote/national',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
        </svg>
      )
    },
    { 
      name: 'Results', 
      href: '/results',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
  ]

  const isActive = (href) => location.pathname === href

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header (hidden on Home) */}
      {!isHome && (
        <header className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-blue-100/50' 
            : 'bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              {/* Logo */}
              <div className="flex-shrink-0">
                <Link to="/" className="flex items-center group">
                    <div className="flex items-center justify-center">
                      <div className="relative group">
                        <div className="absolute inset-0 rounded-full bg-white/10 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <Logo 
                          className="relative h-16 w-16 transition-transform duration-300 group-hover:scale-105" 
                          aria-hidden={true} 
                          alt="St. Greg Church Logo" 
                        />
                      </div>
                    </div>
                  <div className="ml-2 sm:ml-4 min-w-0">
                    <span className="block text-base sm:text-lg md:text-2xl lg:text-3xl font-extrabold leading-tight tracking-wide uppercase bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent break-words">
                      ST. GREGORY THE GREAT
                    </span>
                    <div className="block text-[10px] sm:text-xs md:text-sm text-gray-600 font-semibold leading-snug tracking-wide uppercase break-words">CATHOLIC CHAPLAINCY - UPSA</div>
                  </div>
                </Link>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group relative px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center space-x-2 ${
                      isActive(item.href)
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/80'
                    }`}
                  >
                    <span className={`transition-colors duration-300 ${
                      isActive(item.href) ? 'text-white' : 'text-gray-500 group-hover:text-blue-500'
                    }`}>
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                    {!isActive(item.href) && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    )}
                  </Link>
                ))}
              </nav>

              {/* Admin Login Button */}
              <div className="hidden lg:flex items-center space-x-4">
                <Link
                  to="/admin/login"
                  className="group relative inline-flex items-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:scale-105"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Admin Login
                  <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </Link>
              </div>

              {/* Mobile menu button */}
              <div className="lg:hidden">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="relative inline-flex items-center justify-center p-3 rounded-xl text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <span className="sr-only">Open main menu</span>
                  <div className="relative w-6 h-6">
                    <span className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ${
                      mobileMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-2'
                    }`}></span>
                    <span className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ${
                      mobileMenuOpen ? 'opacity-0' : 'opacity-100'
                    }`}></span>
                    <span className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ${
                      mobileMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-2'
                    }`}></span>
                  </div>
                </button>
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className={`lg:hidden transition-all duration-300 ease-in-out ${
              mobileMenuOpen 
                ? 'max-h-96 opacity-100 pb-6' 
                : 'max-h-0 opacity-0 overflow-hidden'
            }`}>
              <div className="border-t border-gray-200/50 pt-6">
                <div className="space-y-2">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 ${
                        isActive(item.href)
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                          : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/80'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className={`transition-colors duration-300 ${
                        isActive(item.href) ? 'text-white' : 'text-gray-500 group-hover:text-blue-500'
                      }`}>
                        {item.icon}
                      </span>
                      <span>{item.name}</span>
                    </Link>
                  ))}
                  <Link
                    to="/admin/login"
                    className="flex items-center justify-center space-x-2 px-4 py-3 mt-4 text-center bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Admin Login</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="relative">
        <Outlet />
      </main>

      {/* Footer (hidden on Home) */}
{!isHome && (
    <footer className="relative bg-gradient-to-br from-[#0f1724] via-[#111827] to-[#07121a] text-white mt-16 sm:mt-20 overflow-hidden">

      {/* Subtle Background Pattern - BEHIND content */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-16"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo and Description */}
            <div className="flex items-center">
              <div className="flex items-center justify-center">     
              </div>
              <div className="ml-3 sm:ml-4">
                <span className="text-lg sm:text-xl font-extrabold tracking-wide uppercase bg-gradient-to-re text-white bg-clip-text">
                  ST. GREGORY THE GREAT
                </span>
                <div className="text-xs lg:text-sm text-white font-semibold tracking-wide uppercase">CATHOLIC CHAPLAINCY - UPSA</div>
              </div>
            </div>

          {/* Quick Links */}
          <div className="space-y-4 sm:space-y-6">
            <span className="text-base sm:text-lg font-bold text-white border-b-2 border-blue-500 inline-block pb-2">Quick Links</span>
            <div className="space-y-2 sm:space-y-3">
              <Link to="/" className="flex items-center space-x-2 text-white transition-all duration-300 group text-sm sm:text-base">
                <svg className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="font-medium text-white">Home</span>
              </Link>

              <Link to="/about" className="flex items-center space-x-2 text-white transition-all duration-300 group text-sm sm:text-base">
                <svg className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="font-medium text-white">About</span>
              </Link>

              <Link to="/results" className="flex items-center space-x-2 text-white transition-all duration-300 group text-sm sm:text-base">
                <svg className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="font-medium text-white">Live Results</span>
              </Link>

              <Link to="/faq" className="flex items-center space-x-2 text-white transition-all duration-300 group text-sm sm:text-base">
                <svg className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="font-medium text-white">FAQ</span>
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4 sm:space-y-6">
            <span className="text-base sm:text-lg font-bold text-white border-b-2 border-blue-500 inline-block pb-2">Support</span>
            <div className="space-y-3 sm:space-y-4">
              <a href="mailto:support@stGregvoting.com" className="flex items-start space-x-3 text-white transition-colors duration-300 group text-sm sm:text-base">
                <svg className="w-5 h-5 text-white mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="break-all font-medium text-white">support@stGregvoting.com</span>
              </a>

              <div className="flex items-start space-x-3 text-white text-sm sm:text-base">
                <svg className="w-5 h-5 text-white mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium text-white">24/7 Support Available</span>
              </div>

              <div className="flex items-start space-x-3 text-white text-sm sm:text-base">
                <svg className="w-5 h-5 text-white mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="font-medium text-white">Secure & Verified</span>
              </div>
            </div>
          </div>
          {/* Social Media Links */}
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 gap-4">
                <div className="flex items-center space-x-4 pt-2">
                  <a 
                    href="#" 
                    aria-label="Facebook" 
                    className="w-9 h-9 sm:w-10 sm:h-10 bg-white/10 hover:bg-blue-500 backdrop-blur-sm rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/20"
                  >
                    <FaFacebook className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </a>
                  <a 
                    href="#" 
                    aria-label="TikTok" 
                    className="w-9 h-9 sm:w-10 sm:h-10 bg-white/10 hover:bg-pink-500 backdrop-blur-sm rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/20"
                  >
                    <FaTiktok className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </a>
                  <a 
                    href="#" 
                    aria-label="Instagram" 
                    className="w-9 h-9 sm:w-10 sm:h-10 bg-white/10 hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 backdrop-blur-sm rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/20"
                  >
                    <FaInstagram className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </a>
                </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-600 my-8 sm:my-10 lg:my-12"></div>

        {/* Bottom Bar */}
                  <div className="text-center sm:text-left">
            <p className="text-xs sm:text-sm text-white font-medium">
             <span className="text-white">
                © 2025 St Gregory The Great Chaplaincy.
                <br />
                All rights reserved.
              </span>

            </p>
            <span className="text-white">
              Built with security and transparency in mind.
            </span>
          </div>
      </div>
    </footer>
)}
    </div>
  )
}