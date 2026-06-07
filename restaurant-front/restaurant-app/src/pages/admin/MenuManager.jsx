import { useState, useEffect } from 'react'
import { obtenerPlatos, crearPlato, actualizarPlato, eliminarPlato } from '../../services/platoService'
import { Pencil, Trash2, Plus, X } from 'lucide-react'

function MenuManager() {
  const [platos, setPlatos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalAbierto, setModalAbierto] = useState(false)
  const [platoEditando, setPlatoEditando] = useState(null)
  const [errorModal, setErrorModal] = useState('')
  const [form, setForm] = useState({
    nombre: '', descripcion: '', precio: '', categoria: '', imagenUrl: '', disponible: true
  })

  useEffect(() => {
    cargarPlatos()
  }, [])

  const cargarPlatos = async () => {
    try {
      const res = await obtenerPlatos()
      setPlatos(res.data)
      setError('')
    } catch (err) {
      setError('No se pudieron cargar los platos. Verificá la conexión con el servidor.')
    } finally {
      setLoading(false)
    }
  }

  const abrirModalCrear = () => {
    setPlatoEditando(null)
    setForm({ nombre: '', descripcion: '', precio: '', categoria: '', imagenUrl: '', disponible: true })
    setErrorModal('')
    setModalAbierto(true)
  }

  const abrirModalEditar = (plato) => {
    setPlatoEditando(plato)
    setForm({ ...plato })
    setErrorModal('')
    setModalAbierto(true)
  }

  const cerrarModal = () => {
    setModalAbierto(false)
    setPlatoEditando(null)
    setErrorModal('')
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleGuardar = async () => {
    if (!form.nombre.trim() || !form.categoria.trim()) {
      setErrorModal('Nombre y categoría son obligatorios.')
      return
    }
    if (!form.precio || parseFloat(form.precio) <= 0) {
      setErrorModal('El precio debe ser mayor a cero.')
      return
    }
    try {
      const platoData = { ...form, precio: parseFloat(form.precio) }
      if (platoEditando) {
        await actualizarPlato(platoEditando.id, platoData)
      } else {
        await crearPlato(platoData)
      }
      await cargarPlatos()
      cerrarModal()
    } catch (err) {
      setErrorModal('No se pudo guardar el plato. Intentá de nuevo.')
    }
  }

  const handleEliminar = async (id) => {
    if (confirm('¿Seguro que querés eliminar este plato?')) {
      try {
        await eliminarPlato(id)
        await cargarPlatos()
      } catch (err) {
        setError('No se pudo eliminar el plato.')
      }
    }
  }

  if (loading) return <p className="text-gray-500">Cargando platos...</p>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Menú</h2>
        <button
          onClick={abrirModalCrear}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={18} />
          Nuevo plato
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {platos.map(plato => (
          <div key={plato.id} className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-2">
            {plato.imagenUrl && (
              <img src={plato.imagenUrl} alt={plato.nombre} className="w-full h-40 object-cover rounded-lg" />
            )}
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">{plato.nombre}</h3>
              <span className={`text-xs px-2 py-1 rounded-full ${plato.disponible ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                {plato.disponible ? 'Disponible' : 'No disponible'}
              </span>
            </div>
            <p className="text-sm text-gray-500">{plato.descripcion}</p>
            <p className="text-sm text-gray-400">{plato.categoria}</p>
            <p className="text-orange-500 font-bold">${plato.precio}</p>
            <div className="flex gap-2 mt-auto">
              <button
                onClick={() => abrirModalEditar(plato)}
                className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-700"
              >
                <Pencil size={14} /> Editar
              </button>
              <button
                onClick={() => handleEliminar(plato.id)}
                className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700"
              >
                <Trash2 size={14} /> Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">{platoEditando ? 'Editar plato' : 'Nuevo plato'}</h3>
              <button onClick={cerrarModal}><X size={20} /></button>
            </div>
            <div className="flex flex-col gap-3">
              <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" className="border rounded-lg px-3 py-2 text-sm" />
              <input name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción" className="border rounded-lg px-3 py-2 text-sm" />
              <input name="precio" value={form.precio} onChange={handleChange} placeholder="Precio" type="number" className="border rounded-lg px-3 py-2 text-sm" />
              <input name="categoria" value={form.categoria} onChange={handleChange} placeholder="Categoría" className="border rounded-lg px-3 py-2 text-sm" />
              <input name="imagenUrl" value={form.imagenUrl} onChange={handleChange} placeholder="URL de imagen" className="border rounded-lg px-3 py-2 text-sm" />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="disponible" checked={form.disponible} onChange={handleChange} />
                Disponible
              </label>
            </div>
            {errorModal && (
              <p className="text-red-500 text-sm mt-3">{errorModal}</p>
            )}
            <div className="flex gap-2 mt-4">
              <button onClick={cerrarModal} className="flex-1 border rounded-lg py-2 text-sm">Cancelar</button>
              <button onClick={handleGuardar} className="flex-1 bg-orange-500 text-white rounded-lg py-2 text-sm hover:bg-orange-600">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MenuManager