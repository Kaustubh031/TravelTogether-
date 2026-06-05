import { Link } from 'react-router-dom'

const modeIcons = { Flight: '✈️', Train: '🚂', Bus: '🚌', Road: '🚗', Other: '🧭' }

export default function TripCard({ trip, onConnect }) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="h-3 bg-gradient-to-r from-[#6C63FF] to-[#43CBFF]" />
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-bold text-gray-800 text-lg">{trip.origin} → {trip.destination}</h3>
            <p className="text-gray-500 text-sm mt-0.5">{modeIcons[trip.travelMode]} {trip.travelMode}</p>
          </div>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${trip.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
            {trip.status}
          </span>
        </div>

        <div className="flex gap-4 text-sm text-gray-600 mb-3">
          <span>📅 {new Date(trip.startDate).toLocaleDateString()}</span>
          <span>👥 {trip.maxCompanions} spots</span>
        </div>

        {trip.description && <p className="text-gray-600 text-sm mb-4 line-clamp-2">{trip.description}</p>}

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <Link to={`/user/${trip.ownerId}`} className="flex items-center gap-2 hover:opacity-80 transition">
            {trip.ownerPhoto
              ? <img src={`https://localhost:44371${trip.ownerPhoto}`} className="w-8 h-8 rounded-full object-cover" />
              : <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#43CBFF] flex items-center justify-center text-white text-xs font-bold">{trip.ownerName[0]}</div>
            }
            <div>
              <p className="text-sm font-medium text-gray-700">{trip.ownerName}</p>
              <p className="text-xs text-yellow-500">{'⭐'.repeat(Math.round(trip.ownerRating))} {trip.ownerRating > 0 ? trip.ownerRating.toFixed(1) : 'New'}</p>
            </div>
          </Link>
          {onConnect && (
            <button onClick={() => onConnect(trip.id)} className="bg-gradient-to-r from-[#6C63FF] to-[#43CBFF] text-white text-sm font-semibold px-4 py-1.5 rounded-full hover:opacity-90 transition shadow-sm">
              Connect
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
