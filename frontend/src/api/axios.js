import axios from 'axios'

const api = axios.create({ baseURL: 'https://localhost:44371/api' })

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('tt_token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

export default api
