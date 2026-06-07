import { useState, useEffect } from 'react'
import { obtenerPedidosPorUsuario } from '../../services/pedidoService'
import { useAuth } from '../../context/AuthContext'
import { ClipboardList } from 'lucide-react'

const ESTADO_COLORS = {
  PENDIENTE: 'bg-yellow-100 text-yellow-700',
  EN_PREPARACION: 'bg-blue-100 text-blue-700',
  ENTREGADO: 'bg-green-100 text-green-700',
  CANCELADO: 'bg-red-100 text-red-500',
}

const ESTADO_LABELS = {
  PENDIENTE: 'Pendiente',
  EN_PREPARACION: 'En preparación',
  ENTREGADO: 'Entregado',
  CANCELADO: 'Cancelado',
}

function MyOrders() {
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { usuario } = useAuth()

  useEffect(() => {
    if (!usuario?.id) return
    obtenerPedidosPorUsuario(usuario.id)
      .then(res => setPedidos(res.data))
      .catch(() => setError('No se pudieron cargar tus pedidos. Intentá de nuevo más tarde.'))
      .finally(() => setLoading(false))
  }, [usuario?.id])

  if (loading) return <p className="text-gray-500">Cargando pedidos...</p>

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Mis Pedidos</h2>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>
      )}

      {pedidos.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <ClipboardList size={48} className="mx-auto mb-4 opacity-30" />
          <p>Todavía no hiciste ningún pedido</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {pedidos.map(pedido => (
            <div key={pedido.id} className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm text-gray-400">Pedido #{pedido.id}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(pedido.fechaHora).toLocaleString('es-AR')}
                  </p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${ESTADO_COLORS[pedido.estado]}`}>
                  {ESTADO_LABELS[pedido.estado]}
                </span>
              </div>

              <div className="border-t pt-3 flex flex-col gap-1">
                {pedido.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-700">{item.cantidad}x {item.plato.nombre}</span>
                    <span className="text-gray-500">${(item.precioUnitario * item.cantidad).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t mt-3 pt-3 flex justify-between">
                <span className="font-semibold text-gray-700">Total</span>
                <span className="font-bold text-orange-500">${pedido.total.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyOrders
