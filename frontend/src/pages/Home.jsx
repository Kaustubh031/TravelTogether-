import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const features = [
  { icon: '👤', title: 'Traveler Profiles', desc: 'Share your style, languages, and travel vibe' },
  { icon: '📍', title: 'Post Your Trip', desc: 'Tell others where you\'re headed and when' },
  { icon: '🤝', title: 'Match & Connect', desc: 'Find travelers heading the same route' },
  { icon: '💬', title: 'In-App Chat', desc: 'Message your matches before the trip' },
  { icon: '🔔', title: 'Safety Check-In', desc: 'Ping your emergency contact on arrival' },
  { icon: '⭐', title: 'Reviews & Ratings', desc: 'Build trust through companion reviews' },
]

export default function Home() {
  const { user } = useAuth()
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#6C63FF] via-[#9B59B6] to-[#43CBFF] text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-4">✈️</div>
          <h1 className="text-5xl font-extrabold mb-4 leading-tight">
            Solo Travel, <span className="text-yellow-300">Together.</span>
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-xl mx-auto">
            Connect with solo travelers heading your way. Share the journey, make lifelong friends.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            {user
              ? <Link to="/explore" className="bg-white text-[#6C63FF] font-bold px-8 py-3 rounded-full text-lg shadow-lg hover:shadow-xl transition">Explore Trips</Link>
              : <>
                  <Link to="/register" className="bg-white text-[#6C63FF] font-bold px-8 py-3 rounded-full text-lg shadow-lg hover:shadow-xl transition">Get Started Free</Link>
                  <Link to="/login" className="border-2 border-white text-white font-bold px-8 py-3 rounded-full text-lg hover:bg-white/10 transition">Login</Link>
                </>
            }
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-3">Everything you need to travel safely</h2>
        <p className="text-center text-gray-500 mb-12">All core features are completely free.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(f => (
            <div key={f.title} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1">
              <div className="text-4xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Banner */}
      <div className="bg-gradient-to-r from-[#FF6584] to-[#6C63FF] py-16 px-4 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready for your next adventure?</h2>
        <p className="text-white/80 mb-6">Join thousands of solo travelers finding companions every day.</p>
        <Link to="/register" className="bg-white text-[#6C63FF] font-bold px-8 py-3 rounded-full text-lg shadow hover:shadow-md transition">Join Now — It's Free</Link>
      </div>
    </div>
  )
}
