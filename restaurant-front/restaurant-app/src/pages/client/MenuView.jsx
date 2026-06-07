import { useState, useEffect } from 'react'
import { obtenerPlatosDisponibles } from '../../services/platoService'
import { crearPedido } from '../../services/pedidoService'
import { useAuth } from '../../context/AuthContext'
import { ShoppingCart, Plus, Minus, X } from 'lucide-react'

function MenuView() {
  const [platos, setPlatos] = useState([])
  const [carrito, setCarrito] = useState([])
  const [carritoAbierto, setCarritoAbierto] = useState(false)
  const [loading, setLoading] = useState(true)
  const [errorMenu, setErrorMenu] = useState('')
  const [pedidoEnviado, setPedidoEnviado] = useState(false)
  const [errorPedido, setErrorPedido] = useState('')
  const [enviando, setEnviando] = useState(false)
  const { usuario } = useAuth()

  useEffect(() => {
    obtenerPlatosDisponibles()
      .then(res => setPlatos(res.data))
      .catch(() => setErrorMenu('No se pudo cargar el menú. Verificá la conexión e intentá de nuevo.'))
      .finally(() => setLoading(false))
  }, [])

  const agregarAlCarrito = (plato) => {
    setCarrito(prev => {
      const existe = prev.find(item => item.id === plato.id)
      if (existe) {
        return prev.map(item => item.id === plato.id ? { ...item, cantidad: item.cantidad + 1 } : item)
      }
      return [...prev, { ...plato, cantidad: 1 }]
    })
  }

  const quitarDelCarrito = (platoId) => {
    setCarrito(prev => {
      const existe = prev.find(item => item.id === platoId)
      if (existe.cantidad === 1) return prev.filter(item => item.id !== platoId)
      return prev.map(item => item.id === platoId ? { ...item, cantidad: item.cantidad - 1 } : item)
    })
  }

  const totalCarrito = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0)
  const cantidadItems = carrito.reduce((acc, item) => acc + item.cantidad, 0)

  const handleConfirmarPedido = async () => {
    setEnviando(true)
    setErrorPedido('')
    try {
      const pedido = {
        usuarioId: usuario.id,
        items: carrito.map(item => ({
          platoId: item.id,
          cantidad: item.cantidad
        }))
      }
      await crearPedido(pedido)
      setCarrito([])
      setCarritoAbierto(false)
      setPedidoEnviado(true)
      setTimeout(() => setPedidoEnviado(false), 3000)
    } catch (err) {
      setErrorPedido('No se pudo enviar el pedido. Intentá de nuevo.')
    } finally {
      setEnviando(false)
    }
  }

  if (loading) return <p className="text-gray-500">Cargando menú...</p>

  return (
    <div>
      {errorMenu && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-4">{errorMenu}</div>
      )}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Nuestro Menú</h2>
        <button
          onClick={() => setCarritoAbierto(true)}
          className="relative flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <ShoppingCart size={18} />
          Ver carrito
          {cantidadItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cantidadItems}
            </span>
          )}
        </button>
      </div>

      {pedidoEnviado && (
        <div className="bg-green-100 text-green-700 px-4 py-3 rounded-lg mb-4">
          ✅ Pedido realizado con éxito. ¡Lo estamos preparando!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {platos.map(plato => (
          <div key={plato.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            {plato.imagenUrl && (
              <img src={plato.imagenUrl} alt={plato.nombre} className="w-full h-40 object-cover" />
            )}
            <div className="p-4">
              <h3 className="font-semibold text-gray-800">{plato.nombre}</h3>
              <p className="text-sm text-gray-500 mt-1">{plato.descripcion}</p>
              <p className="text-xs text-gray-400 mt-1">{plato.categoria}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-orange-500 font-bold">${plato.precio}</span>
                <button
                  onClick={() => agregarAlCarrito(plato)}
                  className="flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white text-sm px-3 py-1 rounded-lg transition-colors"
                >
                  <Plus size={14} />
                  Agregar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {carritoAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
          <div className="bg-white w-full max-w-sm h-full flex flex-col shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-bold">Tu pedido</h3>
              <button onClick={() => setCarritoAbierto(false)}><X size={20} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {carrito.length === 0 ? (
                <p className="text-gray-400 text-sm text-center mt-8">El carrito está vacío</p>
              ) : (
                carrito.map(item => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{item.nombre}</p>
                      <p className="text-xs text-gray-400">${item.precio} c/u</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => quitarDelCarrito(item.id)} className="text-gray-400 hover:text-red-500">
                        <Minus size={14} />
                      </button>
                      <span className="text-sm font-semibold">{item.cantidad}</span>
                      <button onClick={() => agregarAlCarrito(item)} className="text-gray-400 hover:text-orange-500">
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t">
              <div className="flex justify-between mb-4">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-orange-500">${totalCarrito.toFixed(2)}</span>
              </div>
              {errorPedido && (
                <p className="text-red-500 text-sm mb-3">{errorPedido}</p>
              )}
              <button
                onClick={handleConfirmarPedido}
                disabled={carrito.length === 0 || enviando}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {enviando ? 'Enviando pedido...' : 'Confirmar pedido'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MenuView