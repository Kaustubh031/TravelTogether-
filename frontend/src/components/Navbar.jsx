import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const nav = useNavigate()

  const handleLogout = () => { logout(); nav('/') }

  return (
    <nav className="bg-gradient-to-r from-[#6C63FF] to-[#43CBFF] shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">✈️</span>
          <span className="text-white font-bold text-xl tracking-wide">TravelTogether</span>
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/explore" className="text-white/90 hover:text-white font-medium transition">Explore</Link>
              <Link to="/trips/new" className="text-white/90 hover:text-white font-medium transition">Post Trip</Link>
              <Link to="/matches" className="text-white/90 hover:text-white font-medium transition">Matches</Link>
              <Link to="/profile" className="flex items-center gap-2">
                {user.photo
                  ? <img src={`https://localhost:44371${user.photo}`} className="w-8 h-8 rounded-full object-cover border-2 border-white" />
                  : <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center text-white font-bold text-sm">{user.name[0]}</div>
                }
                <span className="text-white font-medium hidden sm:block">{user.name}</span>
              </Link>
              <button onClick={handleLogout} className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full text-sm transition">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white/90 hover:text-white font-medium transition">Login</Link>
              <Link to="/register" className="bg-white text-[#6C63FF] font-semibold px-4 py-1.5 rounded-full text-sm hover:shadow-md transition">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
