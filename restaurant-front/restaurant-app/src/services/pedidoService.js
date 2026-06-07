import axios from 'axios'

const API_URL = 'http://localhost:8080/api'

export const obtenerPedidos = () => axios.get(`${API_URL}/pedidos`)
export const obtenerPedidosPorUsuario = (usuarioId) => axios.get(`${API_URL}/pedidos/usuario/${usuarioId}`)
export const obtenerPedidosPorEstado = (estado) => axios.get(`${API_URL}/pedidos/estado/${estado}`)
export const crearPedido = (pedido) => axios.post(`${API_URL}/pedidos`, pedido)
export const actualizarEstado = (id, estado) => axios.patch(`${API_URL}/pedidos/${id}/estado?estado=${estado}`)
export const eliminarPedido = (id) => axios.delete(`${API_URL}/pedidos/${id}`)