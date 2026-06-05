import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/axios'

export default function UserProfile() {
  const { id } = useParams()
  const [profile, setProfile] = useState(null)
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    api.get(`/users/${id}`).then(r => setProfile(r.data))
    api.get(`/users/${id}/reviews`).then(r => setReviews(r.data))
  }, [id])

  if (!profile) return <div className="text-center py-20 text-gray-400">Loading...</div>

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <div className="flex items-center gap-5">
          {profile.photo
            ? <img src={`https://localhost:44371${profile.photo}`} className="w-20 h-20 rounded-full object-cover" />
            : <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#43CBFF] flex items-center justify-center text-white text-3xl font-bold">{profile.name[0]}</div>
          }
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-gray-800">{profile.name}</h2>
              {profile.isVerified && <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">✔ Verified</span>}
            </div>
            <p className="text-yellow-500">{'⭐'.repeat(Math.round(profile.rating))} <span className="text-gray-600 font-semibold">{profile.rating > 0 ? profile.rating.toFixed(1) : 'No ratings yet'}</span> <span className="text-gray-400 text-sm">({profile.reviewCount} reviews)</span></p>
            <p className="text-sm text-gray-500 mt-1">🌍 {profile.travelStyle} Traveler &nbsp;|&nbsp; 🗣 {profile.languages || 'Not specified'}</p>
          </div>
        </div>
        {profile.bio && <p className="text-gray-600 mt-4 text-sm bg-gray-50 rounded-xl p-3">{profile.bio}</p>}
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="font-bold text-gray-700 mb-4">Reviews ({reviews.length})</h3>
        {reviews.length === 0
          ? <p className="text-gray-400 text-sm">No reviews yet.</p>
          : <div className="space-y-4">
              {reviews.map(r => (
                <div key={r.id} className="border-b border-gray-100 pb-4 last:border-0">
                  <div className="flex items-center gap-2 mb-1">
                    {r.reviewerPhoto
                      ? <img src={`https://localhost:44371${r.reviewerPhoto}`} className="w-8 h-8 rounded-full object-cover" />
                      : <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">{r.reviewerName[0]}</div>
                    }
                    <span className="font-semibold text-gray-700 text-sm">{r.reviewerName}</span>
                    <span className="text-yellow-400 text-sm">{'⭐'.repeat(r.rating)}</span>
                  </div>
                  {r.comment && <p className="text-gray-600 text-sm ml-10">{r.comment}</p>}
                </div>
              ))}
            </div>
        }
      </div>
    </div>
  )
}
