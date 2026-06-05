import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', travelStyle: 'Budget', languages: '', bio: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const nav = useNavigate()

  const set = k => e => setForm({ ...form, [k]: e.target.value })

  const submit = async e => {
    e.preventDefault()
    setLoading(true); setError('')
    try { await register(form); nav('/explore') }
    catch (err) { setError(err.response?.data || 'Registration failed.') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6C63FF]/10 to-[#FF6584]/10 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🌍</div>
          <h1 className="text-2xl font-bold text-gray-800">Join TravelTogether</h1>
          <p className="text-gray-500 text-sm mt-1">Free forever. No credit card needed.</p>
        </div>
        {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-4 text-sm">{error}</div>}
        <form onSubmit={submit} className="space-y-4">
          {[['name','Name','John Doe','text'],['email','Email','you@example.com','email'],['password','Password','••••••••','password']].map(([k,l,p,t]) => (
            <div key={k}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{l}</label>
              <input type={t} required value={form[k]} onChange={set(k)} placeholder={p}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#6C63FF] transition text-sm" />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Travel Style</label>
            <select value={form.travelStyle} onChange={set('travelStyle')}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#6C63FF] transition text-sm">
              {['Budget','Comfort','Luxury','Adventure'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Languages (e.g. English, Spanish)</label>
            <input value={form.languages} onChange={set('languages')} placeholder="English, French"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#6C63FF] transition text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea value={form.bio} onChange={set('bio')} rows={2} placeholder="Tell travelers about yourself..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#6C63FF] transition text-sm resize-none" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-gradient-to-r from-[#6C63FF] to-[#43CBFF] text-white font-bold py-3 rounded-xl hover:opacity-90 transition shadow-md disabled:opacity-60">
            {loading ? 'Creating account...' : 'Create Free Account'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">Already have an account? <Link to="/login" className="text-[#6C63FF] font-semibold hover:underline">Login</Link></p>
      </div>
    </div>
  )
}
