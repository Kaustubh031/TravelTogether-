import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

const StatusBadge = ({ s }) => {
  const map = { Pending: 'bg-yellow-100 text-yellow-700', Accepted: 'bg-green-100 text-green-700', Declined: 'bg-red-100 text-red-600' }
  return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${map[s]}`}>{s}</span>
}

export default function Matches() {
  const [incoming, setIncoming] = useState([])
  const [sent, setSent] = useState([])
  const [tab, setTab] = useState('incoming')

  useEffect(() => {
    api.get('/matches/incoming').then(r => setIncoming(r.data))
    api.get('/matches/my').then(r => setSent(r.data))
  }, [])

  const respond = async (id, action) => {
    await api.put(`/matches/${id}`, { action })
    setIncoming(prev => prev.map(m => m.id === id ? { ...m, status: action === 'accept' ? 'Accepted' : 'Declined' } : m))
  }

  const list = tab === 'incoming' ? incoming : sent

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Matches 🤝</h1>

      <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
        {['incoming','sent'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition capitalize ${tab === t ? 'bg-white shadow text-[#6C63FF]' : 'text-gray-500'}`}>
            {t} {t === 'incoming' ? `(${incoming.filter(m => m.status === 'Pending').length})` : ''}
          </button>
        ))}
      </div>

      {list.length === 0
        ? <div className="text-center py-16 text-gray-400">No {tab} matches yet.</div>
        : <div className="space-y-4">
            {list.map(m => (
              <div key={m.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Link to={`/user/${tab === 'incoming' ? m.requesterId : m.requesterId}`}>
                    {m.requesterPhoto
                      ? <img src={`https://localhost:44371${m.requesterPhoto}`} className="w-12 h-12 rounded-full object-cover" />
                      : <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#43CBFF] flex items-center justify-center text-white font-bold">{m.requesterName[0]}</div>
                    }
                  </Link>
                  <div>
                    <p className="font-semibold text-gray-800">{m.requesterName}</p>
                    <p className="text-sm text-gray-500">→ {m.destination}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge s={m.status} />
                  {tab === 'incoming' && m.status === 'Pending' && (
                    <>
                      <button onClick={() => respond(m.id, 'accept')} className="bg-green-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-green-600 transition">Accept</button>
                      <button onClick={() => respond(m.id, 'decline')} className="bg-gray-200 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-gray-300 transition">Decline</button>
                    </>
                  )}
                  {m.status === 'Accepted' && (
                    <Link to={`/chat/${tab === 'incoming' ? m.requesterId : m.requesterId}`}
                      className="bg-gradient-to-r from-[#6C63FF] to-[#43CBFF] text-white text-xs font-semibold px-3 py-1.5 rounded-full hover:opacity-90 transition">
                      💬 Chat
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
      }
    </div>
  )
}
