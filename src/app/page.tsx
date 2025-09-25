import Link from 'next/link'
import { ArrowRight, Shield, Heart, Lightbulb, Star } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-cyan-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <span className="text-xl font-bold text-gray-900">No_Machine</span>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                href="/auth/login"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Setting boundaries shouldn't be this hard
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Meet your boundary-setting companion. Get personalized advice on how to decline
            events, reject requests, and protect your time with confidence and grace.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/auth/register"
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              Start Setting Boundaries
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/auth/login"
              className="text-indigo-600 hover:text-indigo-800 px-8 py-3 text-lg font-medium"
            >
              Already have an account?
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="text-green-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Three Boundary Levels
            </h3>
            <p className="text-gray-600">
              Get soft, clear, and firm boundary options for every situation.
              Choose what feels right for your relationship and context.
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="text-purple-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Psychology-Backed Advice
            </h3>
            <p className="text-gray-600">
              Learn why each approach works with insights from your reformed
              people-pleaser coach who's been in your shoes.
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lightbulb className="text-yellow-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Visual Mood Lighteners
            </h3>
            <p className="text-gray-600">
              Get delightfully absurd AI-generated images to share alongside
              your boundaries and lighten the mood.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            How No_Machine Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-indigo-600">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Describe Your Situation
              </h3>
              <p className="text-gray-600 text-sm">
                Tell the Boundary Coach about the event you want to decline
                or request you need to reject.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-indigo-600">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Get Personalized Options
              </h3>
              <p className="text-gray-600 text-sm">
                Receive three boundary-setting approaches with psychology
                insights and usage guidance.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-indigo-600">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Send with Confidence
              </h3>
              <p className="text-gray-600 text-sm">
                Copy your chosen response and optional visual mood lighteners
                to share with confidence.
              </p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            From Reformed People-Pleasers
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center gap-1 justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="text-yellow-500 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 italic mb-4">
                "Finally, a tool that helps me say no without feeling guilty!
                The psychology explanations really help me understand why boundaries work."
              </p>
              <p className="text-sm text-gray-500">— Sarah K.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center gap-1 justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="text-yellow-500 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 italic mb-4">
                "The visual mood lighteners are genius! They help break the tension
                when I have to set firm boundaries with difficult people."
              </p>
              <p className="text-sm text-gray-500">— Mike R.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-indigo-600 text-white rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Reclaim Your Time?
          </h2>
          <p className="text-xl mb-6 text-indigo-100">
            Join thousands who've learned to set healthy boundaries with confidence.
          </p>
          <Link
            href="/auth/register"
            className="bg-white text-indigo-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
          >
            Get Started Free
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p>&copy; 2024 No_Machine. Your boundary-setting companion.</p>
        </div>
      </footer>
    </div>
  )
}
