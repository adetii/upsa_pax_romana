import { Link } from 'react-router-dom'
import logoImg from '../../assets/LOGO.png'
import homeBg from '../../assets/image.png'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Hero Section */}
      <section
        className="relative text-white bg-cover bg-center min-h-[100svh] w-full flex items-center justify-center hero-kenburns-bg"
        style={{ '--hero-bg': `url(${homeBg})` }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60 z-10"></div>

        {/* Content */}
        <div className="relative z-20 text-center px-6 sm:px-8">
          {/* Logo */}
          <div className="flex justify-center mb-10 animate-fade-in-up delay-100ms">
            <img
              src={logoImg}
              alt="St. Gregory Logo"
              className="w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 object-contain drop-shadow-lg hover:scale-105 transition-transform duration-300 animate-hero-float"
            />
          </div>

          {/* Title */}
          <div className="ml-2 sm:ml-4 min-w-0 text-center animate-fade-in-up delay-200ms">
            <span className="block text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-wide uppercase text-white break-words">
              ST. GREGORY THE GREAT
            </span>
            <div className="block text-xs sm:text-base md:text-lg lg:text-xl text-gray-200 font-semibold leading-snug tracking-wide uppercase break-words animate-fade-in-up delay-350ms">
              CATHOLIC CHAPLAINCY - UPSA
            </div>
          </div>
        </div>
      </section>

      {/* Election Type Section */}
      <section className="py-24 bg-gray-100">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Choose Your Election
          </h2>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
            Select the election category you’d like to participate in.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Church Elections */}
            <Link
              to="/vote"
              className="group bg-white p-10 rounded-3xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-transparent hover:border-yellow-400"
            >
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-yellow-400/20 rounded-full group-hover:bg-yellow-400/30 transition-colors duration-300">
                  <svg
                    className="w-10 h-10 text-yellow-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-3">Church Elections</h3>
              <p className="text-gray-600 mb-6">
                Vote for church leadership and community representatives.
              </p>
              <span className="inline-block bg-yellow-400 text-gray-900 px-6 py-3 rounded-full font-medium group-hover:shadow-lg transition-all duration-300">
                Vote Now
              </span>
            </Link>

            {/* National Elections */}
            <Link
              to="/vote/national"
              className="group bg-white p-10 rounded-3xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-transparent hover:border-yellow-400"
            >
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-yellow-400/20 rounded-full group-hover:bg-yellow-400/30 transition-colors duration-300">
                  <svg
                    className="w-10 h-10 text-yellow-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-3">National Elections</h3>
              <p className="text-gray-600 mb-6">
                Participate in national-level elections and civic processes.
              </p>
              <span className="inline-block bg-yellow-400 text-gray-900 px-6 py-3 rounded-full font-medium group-hover:shadow-lg transition-all duration-300">
                Vote Now
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}


