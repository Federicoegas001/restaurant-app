import axios from 'axios'

const API_URL = 'http://localhost:8080/api'

export const obtenerPlatos = () => axios.get(`${API_URL}/platos`)
export const obtenerPlatosDisponibles = () => axios.get(`${API_URL}/platos/disponibles`)
export const obtenerPlatoPorId = (id) => axios.get(`${API_URL}/platos/${id}`)
export const crearPlato = (plato) => axios.post(`${API_URL}/platos`, plato)
export const actualizarPlato = (id, plato) => axios.put(`${API_URL}/platos/${id}`, plato)
export const eliminarPlato = (id) => axios.delete(`${API_URL}/platos/${id}`)
export const actualizarDisponibilidad = (id, disponible) => axios.patch(`${API_URL}/platos/${id}/disponibilidad?disponible=${disponible}`)