import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

export const loginService = async (email, password) => {
  const response = await axios.post(`${API_URL}/usuarios/login`, {
    email,
    password
  })
  return response.data
}