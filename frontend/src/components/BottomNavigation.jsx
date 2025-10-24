import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

export default function BottomNavigation() {
  const location = useLocation()
  const [showMoreMenu, setShowMoreMenu] = useState(false)

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2zm0 0V9a2 2 0 012-2h6a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      name: 'Categories',
      href: '/admin/categories',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      )
    },
    {
      name: 'Candidates',
      href: '/admin/candidates',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      )
    },
    {
      name: 'Results',
      href: '/admin/results',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    }
  ]

  const moreMenuItems = [
    {
      name: 'Positions',
      href: '/admin/positions',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 002 2h2a2 2 0 002-2V4h-2a2 2 0 00-2-2z" />
        </svg>
      )
    },
    {
      name: 'Transactions',
      href: '/admin/transactions',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
  ]

  const isActive = (href) => location.pathname === href

  return (
    <>
      {/* More Menu Overlay */}
      {showMoreMenu && (
        <div className="lg:hidden fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm" onClick={() => setShowMoreMenu(false)}>
          <div className="absolute bottom-20 right-4 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 p-2 min-w-[200px]">
            {moreMenuItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setShowMoreMenu(false)}
                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 touch-manipulation ${
                  isActive(item.href)
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className={`mr-3 p-2 rounded-lg ${
                  isActive(item.href) 
                    ? 'bg-white/20 text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {item.icon}
                </div>
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-gray-200/50 shadow-2xl">
        <div className="flex items-center justify-around px-2 py-2 safe-area-pb">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex flex-col items-center justify-center px-3 py-2 rounded-xl transition-all duration-300 touch-manipulation min-w-0 flex-1 ${
                isActive(item.href)
                  ? 'bg-gradient-to-t from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <div className={`p-1.5 rounded-lg transition-all duration-300 ${
                isActive(item.href) 
                  ? 'bg-white/20 text-white' 
                  : 'text-gray-500 group-hover:text-blue-600'
              }`}>
                {item.icon}
              </div>
              <span className={`text-xs font-medium mt-1 truncate ${
                isActive(item.href) ? 'text-white' : 'text-gray-600'
              }`}>
                {item.name}
              </span>
              {isActive(item.href) && (
                <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white rounded-full shadow-lg"></div>
              )}
            </Link>
          ))}
          
          {/* More Menu Button */}
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className={`flex flex-col items-center justify-center px-3 py-2 rounded-xl transition-all duration-300 touch-manipulation min-w-0 flex-1 ${
              showMoreMenu
                ? 'bg-gradient-to-t from-gray-500 to-gray-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            <div className={`p-1.5 rounded-lg transition-all duration-300 ${
              showMoreMenu 
                ? 'bg-white/20 text-white' 
                : 'text-gray-500'
            }`}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </div>
            <span className={`text-xs font-medium mt-1 truncate ${
              showMoreMenu ? 'text-white' : 'text-gray-600'
            }`}>
              More
            </span>
          </button>
        </div>
      </div>
    </>
  )
}