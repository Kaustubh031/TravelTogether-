import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function PostTrip() {
  const [form, setForm] = useState({ origin: '', destination: '', startDate: '', endDate: '', travelMode: 'Flight', maxCompanions: 3, description: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  const set = k => e => setForm({ ...form, [k]: e.target.value })

  const submit = async e => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      await api.post('/trips', { ...form, maxCompanions: Number(form.maxCompanions) })
      nav('/explore')
    } catch (err) {
      setError(err.response?.data || 'Failed to post trip.')
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-1">Post a Trip 🗺️</h1>
      <p className="text-gray-500 mb-8">Share your travel plans and find companions</p>

      {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-4 text-sm">{error}</div>}

      <form onSubmit={submit} className="bg-white rounded-2xl shadow-md p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          {[['origin','From','Paris'],['destination','To','Tokyo']].map(([k,l,p]) => (
            <div key={k}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{l}</label>
              <input required value={form[k]} onChange={set(k)} placeholder={p}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#6C63FF] text-sm" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[['startDate','Start Date'],['endDate','End Date']].map(([k,l]) => (
            <div key={k}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{l}</label>
              <input type="date" required value={form[k]} onChange={set(k)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#6C63FF] text-sm" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Travel Mode</label>
            <select value={form.travelMode} onChange={set('travelMode')}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#6C63FF] text-sm">
              {['Flight','Train','Bus','Road','Other'].map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Companions</label>
            <input type="number" min={1} max={10} value={form.maxCompanions} onChange={set('maxCompanions')}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#6C63FF] text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea value={form.description} onChange={set('description')} rows={3} placeholder="Describe your trip, preferences, and what kind of companion you're looking for..."
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#6C63FF] text-sm resize-none" />
        </div>
        <button type="submit" disabled={loading}
          className="w-full bg-gradient-to-r from-[#6C63FF] to-[#43CBFF] text-white font-bold py-3 rounded-xl hover:opacity-90 transition shadow-md disabled:opacity-60">
          {loading ? 'Posting...' : 'Post Trip 🚀'}
        </button>
      </form>
    </div>
  )
}
