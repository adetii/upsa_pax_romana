import { useState } from 'react'
import { HelpCircle, ChevronDown, Lock, Vote, Shield, Users, Eye, Settings } from 'lucide-react'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      q: 'What is St. Greg Voting System?',
      a: 'A secure, modern platform for organizing elections, collecting votes, and publishing verifiable results for the St. Greg community.',
      icon: Vote,
      color: 'blue'
    },
    {
      q: 'How do I vote?',
      a: 'Select a category and position, choose your candidate, and follow the prompts. Some votes may require payment verification depending on the event.',
      icon: HelpCircle,
      color: 'indigo'
    },
    {
      q: 'Is my vote anonymous?',
      a: 'Yes. Votes are recorded without exposing voter identity. Aggregates are displayed publicly when enabled.',
      icon: Lock,
      color: 'purple'
    },
    {
      q: 'How are results published?',
      a: 'Admins can enable public results. When enabled, real-time tallies are available on the Results page with category and position filters.',
      icon: Eye,
      color: 'green'
    },
    {
      q: 'Who can access admin features?',
      a: 'Only authorized administrators with valid accounts and appropriate roles. Super admins control system-wide settings.',
      icon: Settings,
      color: 'orange'
    },
    {
      q: 'Can I change my vote after submission?',
      a: 'No. Once a vote is submitted, it cannot be changed to maintain election integrity. Please review your selections carefully before confirming.',
      icon: Shield,
      color: 'red'
    }
  ]

  const colorClasses = {
    blue: {
      bg: 'bg-blue-100',
      text: 'text-blue-600',
      border: 'border-blue-200',
      hover: 'hover:border-blue-300'
    },
    indigo: {
      bg: 'bg-indigo-100',
      text: 'text-indigo-600',
      border: 'border-indigo-200',
      hover: 'hover:border-indigo-300'
    },
    purple: {
      bg: 'bg-purple-100',
      text: 'text-purple-600',
      border: 'border-purple-200',
      hover: 'hover:border-purple-300'
    },
    green: {
      bg: 'bg-green-100',
      text: 'text-green-600',
      border: 'border-green-200',
      hover: 'hover:border-green-300'
    },
    orange: {
      bg: 'bg-orange-100',
      text: 'text-orange-600',
      border: 'border-orange-200',
      hover: 'hover:border-orange-300'
    },
    red: {
      bg: 'bg-red-100',
      text: 'text-red-600',
      border: 'border-red-200',
      hover: 'hover:border-red-300'
    }
  }

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-indigo-600 via-blue-600 to-purple-700">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIGreg1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm mb-6">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl sm:text-2xl text-indigo-100 max-w-3xl mx-auto leading-relaxed">
              Everything you need to know about voting, security, and accessing your democratic rights.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center border border-gray-100">
            <div className="text-3xl font-bold text-indigo-600 mb-2">100%</div>
            <div className="text-gray-600">Secure Voting</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center border border-gray-100">
            <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
            <div className="text-gray-600">Access Available</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center border border-gray-100">
            <div className="text-3xl font-bold text-purple-600 mb-2">Real-time</div>
            <div className="text-gray-600">Result Updates</div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-4">
          {faqs.map((item, idx) => {
            const Icon = item.icon
            const colors = colorClasses[item.color]
            const isOpen = openIndex === idx

            return (
              <div
                key={idx}
                className={`bg-white rounded-2xl shadow-sm border-2 transition-all duration-300 overflow-hidden ${colors.border} ${colors.hover} ${
                  isOpen ? 'shadow-lg' : ''
                }`}
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full px-6 py-5 flex items-start gap-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className={`shrink-0 w-12 h-12 rounded-xl ${colors.bg} ${colors.text} flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{item.q}</h3>
                    {!isOpen && (
                      <p className="text-sm text-gray-500">Click to expand</p>
                    )}
                  </div>
                  <ChevronDown
                    className={`shrink-0 w-6 h-6 text-gray-400 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                <div
                  className={`transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-6 pl-22">
                    <div className={`p-4 rounded-xl bg-linear-to-br ${colors.bg} border ${colors.border}`}>
                      <p className="text-gray-700 leading-relaxed">{item.a}</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Help Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-20">
        <div className="bg-linear-to-r from-indigo-600 via-purple-600 to-blue-600 rounded-3xl p-10 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIGreg1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
          <div className="relative">
            <Users className="w-12 h-12 text-white mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-3">Still Have Questions?</h2>
            <p className="text-lg text-indigo-100 mb-6 max-w-2xl mx-auto">
              Our support team is here to help you navigate the voting process and answer any additional questions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:support@stGregvoting.com"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white text-indigo-600 font-bold hover:bg-indigo-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}