import { useEffect, useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user, logout } = useAuth()
  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState({})
  const [checkin, setCheckin] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    api.get('/users/me').then(r => { setProfile(r.data); setForm(r.data) })
  }, [])

  const set = k => e => setForm({ ...form, [k]: e.target.value })

  const save = async () => {
    const { data } = await api.put('/users/me', { name: form.name, bio: form.bio, travelStyle: form.travelStyle, languages: form.languages, emergencyContact: form.emergencyContact })
    setProfile(data)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const uploadPhoto = async e => {
    const fd = new FormData()
    fd.append('file', e.target.files[0])
    const { data } = await api.post('/users/me/photo', fd)
    setProfile(p => ({ ...p, photo: data.photo }))
  }

  const sendCheckin = async () => {
    const { data } = await api.post('/users/checkin', { message: checkin || 'I have arrived safely! ✅' })
    alert(data.message)
    setCheckin('')
  }

  if (!profile) return <div className="text-center py-20 text-gray-400">Loading...</div>

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Profile</h1>

      {/* Avatar */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <div className="flex items-center gap-5">
          <label className="cursor-pointer relative">
            {profile.photo
              ? <img src={`https://localhost:44371${profile.photo}`} className="w-20 h-20 rounded-full object-cover border-4 border-[#6C63FF]/30" />
              : <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#43CBFF] flex items-center justify-center text-white text-3xl font-bold">{profile.name[0]}</div>
            }
            <div className="absolute bottom-0 right-0 bg-[#6C63FF] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">📷</div>
            <input type="file" accept="image/*" onChange={uploadPhoto} className="hidden" />
          </label>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{profile.name}</h2>
            <p className="text-gray-500 text-sm">{profile.email}</p>
            <div className="flex gap-2 mt-1">
              {profile.isVerified && <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">✔ Verified</span>}
              <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-0.5 rounded-full">⭐ {profile.rating || 0} ({profile.reviewCount} reviews)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Info */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6 space-y-4">
        <h3 className="font-bold text-gray-700">Edit Info</h3>
        {[['name','Name'],['languages','Languages'],['emergencyContact','Emergency Contact']].map(([k,l]) => (
          <div key={k}>
            <label className="block text-sm font-medium text-gray-600 mb-1">{l}</label>
            <input value={form[k] || ''} onChange={set(k)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#6C63FF] text-sm" />
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Travel Style</label>
          <select value={form.travelStyle || 'Budget'} onChange={set('travelStyle')}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#6C63FF] text-sm">
            {['Budget','Comfort','Luxury','Adventure'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Bio</label>
          <textarea value={form.bio || ''} onChange={set('bio')} rows={2} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#6C63FF] text-sm resize-none" />
        </div>
        <button onClick={save} className="bg-gradient-to-r from-[#6C63FF] to-[#43CBFF] text-white font-bold px-6 py-2.5 rounded-xl hover:opacity-90 transition shadow-sm">
          {saved ? '✅ Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Safety Check-in */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <h3 className="font-bold text-gray-700 mb-3">🔔 Safety Check-In</h3>
        <p className="text-sm text-gray-500 mb-3">Send an arrival notification to your emergency contact.</p>
        <div className="flex gap-2">
          <input value={checkin} onChange={e => setCheckin(e.target.value)} placeholder="Custom message (optional)"
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#6C63FF] text-sm" />
          <button onClick={sendCheckin} className="bg-green-500 text-white font-semibold px-4 py-2.5 rounded-xl hover:bg-green-600 transition">Send</button>
        </div>
      </div>
    </div>
  )
}
