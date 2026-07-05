import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

export const obtenerUsuarios = () => axios.get(`${API_URL}/usuarios`)
export const crearUsuario = (usuario) => axios.post(`${API_URL}/usuarios`, usuario)
export const actualizarUsuario = (id, usuario) => axios.put(`${API_URL}/usuarios/${id}`, usuario)
export const eliminarUsuario = (id) => axios.delete(`${API_URL}/usuarios/${id}`)
