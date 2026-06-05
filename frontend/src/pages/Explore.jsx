import { useEffect, useState } from 'react'
import api from '../api/axios'
import TripCard from '../components/TripCard'
import { useAuth } from '../context/AuthContext'

export default function Explore() {
  const [trips, setTrips] = useState([])
  const [destination, setDestination] = useState('')
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const fetchTrips = async () => {
    setLoading(true)
    const { data } = await api.get('/trips', { params: { destination: destination || undefined } })
    setTrips(data)
    setLoading(false)
  }

  useEffect(() => { fetchTrips() }, [])

  const handleConnect = async (tripId) => {
    try {
      await api.post('/matches', { tripId })
      alert('✅ Connection request sent!')
    } catch (err) {
      alert(err.response?.data || 'Could not send request.')
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-1">Explore Trips ✈️</h1>
        <p className="text-gray-500">Find travelers heading your way</p>
      </div>

      <div className="flex gap-3 mb-8">
        <input value={destination} onChange={e => setDestination(e.target.value)} placeholder="Search destination..."
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#6C63FF] text-sm" />
        <button onClick={fetchTrips} className="bg-gradient-to-r from-[#6C63FF] to-[#43CBFF] text-white font-semibold px-6 py-2.5 rounded-xl hover:opacity-90 transition">
          Search
        </button>
      </div>

      {loading
        ? <div className="text-center py-20 text-gray-400 text-lg">Loading trips...</div>
        : trips.length === 0
          ? <div className="text-center py-20 text-gray-400 text-lg">No trips found. <a href="/trips/new" className="text-[#6C63FF] font-semibold hover:underline">Be the first to post one!</a></div>
          : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map(t => (
                <TripCard key={t.id} trip={t} onConnect={user && t.ownerId !== user.id ? handleConnect : null} />
              ))}
            </div>
      }
    </div>
  )
}
