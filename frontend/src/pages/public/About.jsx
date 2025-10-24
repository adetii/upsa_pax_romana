import { Link } from 'react-router-dom'
import { Shield, Vote, Eye, Users, Lock, CheckCircle, ArrowRight } from 'lucide-react'

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIGreg1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm mb-6">
              <Vote className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white mb-6">
              Democracy Made Digital
            </h1>
            <p className="text-xl sm:text-2xl text-indigo-100 max-w-3xl mx-auto leading-relaxed">
              Empowering the St. Greg community with secure, transparent, and accessible voting for everyone, everywhere.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
            <div className="relative">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 mb-5">
                <Users className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                Ensure every eligible member can participate in democracy with confidence, ease, and complete trust in the integrity of the process.
              </p>
            </div>
          </div>

          <div className="group relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-50 to-pink-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
            <div className="relative">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-purple-100 text-purple-600 mb-5">
                <Lock className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Security First</h2>
              <p className="text-gray-600 leading-relaxed">
                Military-grade encryption, multi-layer authentication, fraud detection, and continuous monitoring protect every vote cast.
              </p>
            </div>
          </div>

          <div className="group relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
            <div className="relative">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 mb-5">
                <Eye className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Total Transparency</h2>
              <p className="text-gray-600 leading-relaxed">
                Real-time results, complete audit trails, and tamper-evident records ensure accountability at every step of the journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A seamless voting experience built on cutting-edge technology
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl p-8 shadow-lg border border-blue-100">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">1</div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Secure Authentication</h3>
                <p className="text-gray-600">Members verify their identity through our secure authentication system before accessing the ballot.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">2</div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Cast Your Vote</h3>
                <p className="text-gray-600">Choose your preferred candidates across all categories and positions in a clean, intuitive interface.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">3</div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Instant Recording</h3>
                <p className="text-gray-600">Your vote is encrypted and recorded immediately with a unique confirmation receipt.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">4</div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Live Results</h3>
                <p className="text-gray-600">Watch results update in real-time as votes are tallied with complete transparency.</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-indigo-50 rounded-3xl p-8 shadow-lg border border-indigo-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">One-time vote verification to prevent duplicates</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">Role-based admin controls for election management</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">Multi-category and multi-position ballot support</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">Public and private result viewing modes</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">Comprehensive audit logging system</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">Mobile-responsive design for voting anywhere</span>
              </div>
            </div>

            <div className="mt-8 p-6 bg-white rounded-2xl border-2 border-indigo-200">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-6 h-6 text-indigo-600" />
                <h4 className="font-bold text-gray-900">Security Guarantee</h4>
              </div>
              <p className="text-sm text-gray-600">
                Every vote is anonymized, encrypted, and stored with blockchain-inspired integrity verification. Your privacy is our priority.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 rounded-3xl p-12 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIGreg1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Make Your Voice Heard?</h2>
            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
              Join thousands of community members participating in secure, democratic elections.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/vote" 
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white text-indigo-600 font-bold hover:bg-indigo-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Cast Your Vote
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/results" 
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-indigo-700 text-white font-bold hover:bg-indigo-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 border-2 border-white/20"
              >
                View Live Results
                <Eye className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}