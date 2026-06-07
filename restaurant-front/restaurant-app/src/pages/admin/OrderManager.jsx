import { useState, useEffect } from 'react'
import { obtenerPedidos, actualizarEstado } from '../../services/pedidoService'

const ESTADO_COLORS = {
  PENDIENTE: 'bg-yellow-100 text-yellow-700',
  EN_PREPARACION: 'bg-blue-100 text-blue-700',
  ENTREGADO: 'bg-green-100 text-green-700',
  CANCELADO: 'bg-red-100 text-red-500',
}

const ESTADOS = ['PENDIENTE', 'EN_PREPARACION', 'ENTREGADO', 'CANCELADO']

function OrderManager() {
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actualizando, setActualizando] = useState(null)

  useEffect(() => {
    cargarPedidos()
  }, [])

  const cargarPedidos = async () => {
    try {
      const res = await obtenerPedidos()
      setPedidos(res.data)
      setError('')
    } catch (err) {
      setError('No se pudieron cargar los pedidos. Verificá la conexión con el servidor.')
    } finally {
      setLoading(false)
    }
  }

  const handleCambiarEstado = async (id, estado) => {
    setActualizando(id)
    try {
      await actualizarEstado(id, estado)
      await cargarPedidos()
    } catch (err) {
      setError('No se pudo actualizar el estado del pedido.')
    } finally {
      setActualizando(null)
    }
  }

  if (loading) return <p className="text-gray-500">Cargando pedidos...</p>

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Gestión de Pedidos</h2>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>
      )}

      {pedidos.length === 0 ? (
        <p className="text-gray-400 text-center py-20">No hay pedidos todavía</p>
      ) : (
        <div className="flex flex-col gap-4">
          {pedidos.map(pedido => (
            <div key={pedido.id} className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold text-gray-800">Pedido #{pedido.id}</p>
                  <p className="text-sm text-gray-500">Cliente: {pedido.usuario.nombre}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(pedido.fechaHora).toLocaleString('es-AR')}
                  </p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${ESTADO_COLORS[pedido.estado]}`}>
                  {pedido.estado.replace('_', ' ')}
                </span>
              </div>

              <div className="border-t pt-3 flex flex-col gap-1 mb-3">
                {pedido.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-700">{item.cantidad}x {item.plato.nombre}</span>
                    <span className="text-gray-500">${(item.precioUnitario * item.cantidad).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between border-t pt-3">
                <span className="font-bold text-orange-500">${pedido.total.toFixed(2)}</span>
                <select
                  value={pedido.estado}
                  onChange={(e) => handleCambiarEstado(pedido.id, e.target.value)}
                  disabled={actualizando === pedido.id}
                  className="border rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:opacity-50"
                >
                  {ESTADOS.map(estado => (
                    <option key={estado} value={estado}>
                      {estado.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default OrderManager
