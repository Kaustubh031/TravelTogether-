import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import * as signalR from '@microsoft/signalr'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function Chat() {
  const { partnerId } = useParams()
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [partner, setPartner] = useState(null)
  const connRef = useRef(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    api.get(`/users/${partnerId}`).then(r => setPartner(r.data))
    api.get(`/messages/${partnerId}`).then(r => setMessages(r.data))

    const token = localStorage.getItem('tt_token')
    const conn = new signalR.HubConnectionBuilder()
      .withUrl(`https://localhost:44371/hubs/chat?access_token=${token}`)
      .withAutomaticReconnect()
      .build()

    conn.on('ReceiveMessage', msg => setMessages(prev => [...prev, msg]))
    conn.start().then(() => conn.invoke('JoinRoom', Number(partnerId)))
    connRef.current = conn
    return () => conn.stop()
  }, [partnerId])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const send = async e => {
    e.preventDefault()
    if (!text.trim()) return
    await connRef.current?.invoke('SendMessage', Number(partnerId), text)
    setText('')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col" style={{ height: 'calc(100vh - 80px)' }}>
      {partner && (
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200 mb-4">
          {partner.photo
            ? <img src={`https://localhost:44371${partner.photo}`} className="w-10 h-10 rounded-full object-cover" />
            : <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#43CBFF] flex items-center justify-center text-white font-bold">{partner.name[0]}</div>
          }
          <div>
            <p className="font-bold text-gray-800">{partner.name}</p>
            <p className="text-xs text-green-500">● Online</p>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {messages.map(m => {
          const mine = m.senderId === user.id
          return (
            <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${mine ? 'bg-gradient-to-r from-[#6C63FF] to-[#43CBFF] text-white rounded-br-sm' : 'bg-gray-100 text-gray-800 rounded-bl-sm'}`}>
                {m.text}
                <p className={`text-xs mt-1 ${mine ? 'text-white/70' : 'text-gray-400'}`}>
                  {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={send} className="flex gap-2 pt-4 border-t border-gray-200 mt-4">
        <input value={text} onChange={e => setText(e.target.value)} placeholder="Type a message..."
          className="flex-1 border border-gray-200 rounded-full px-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#6C63FF] text-sm" />
        <button type="submit" className="bg-gradient-to-r from-[#6C63FF] to-[#43CBFF] text-white font-semibold px-5 py-2.5 rounded-full hover:opacity-90 transition">Send</button>
      </form>
    </div>
  )
}
