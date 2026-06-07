import { useState, useEffect } from 'react'
import { Pencil, Trash2, Plus, X } from 'lucide-react'
import { obtenerUsuarios, crearUsuario, actualizarUsuario, eliminarUsuario } from '../../services/usuarioService'

function UserManager() {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalAbierto, setModalAbierto] = useState(false)
  const [usuarioEditando, setUsuarioEditando] = useState(null)
  const [errorModal, setErrorModal] = useState('')
  const [form, setForm] = useState({ nombre: '', email: '', password: '', rol: 'CLIENTE' })

  useEffect(() => {
    cargarUsuarios()
  }, [])

  const cargarUsuarios = async () => {
    try {
      const res = await obtenerUsuarios()
      setUsuarios(res.data)
      setError('')
    } catch (err) {
      setError('No se pudieron cargar los usuarios. Verificá la conexión con el servidor.')
    } finally {
      setLoading(false)
    }
  }

  const abrirModalCrear = () => {
    setUsuarioEditando(null)
    setForm({ nombre: '', email: '', password: '', rol: 'CLIENTE' })
    setErrorModal('')
    setModalAbierto(true)
  }

  const abrirModalEditar = (usuario) => {
    setUsuarioEditando(usuario)
    setForm({ nombre: usuario.nombre, email: usuario.email, password: '', rol: usuario.rol })
    setErrorModal('')
    setModalAbierto(true)
  }

  const cerrarModal = () => {
    setModalAbierto(false)
    setUsuarioEditando(null)
    setErrorModal('')
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleGuardar = async () => {
    if (!form.nombre.trim() || !form.email.trim()) {
      setErrorModal('Nombre y email son obligatorios.')
      return
    }
    if (!usuarioEditando && !form.password) {
      setErrorModal('La contraseña es obligatoria para nuevos usuarios.')
      return
    }

    try {
      if (usuarioEditando) {
        // Solo incluir password si el admin ingresó uno nuevo
        const payload = { nombre: form.nombre, email: form.email, rol: form.rol }
        if (form.password) payload.password = form.password
        await actualizarUsuario(usuarioEditando.id, payload)
      } else {
        await crearUsuario(form)
      }
      await cargarUsuarios()
      cerrarModal()
    } catch (err) {
      setErrorModal('No se pudo guardar el usuario. Verificá los datos e intentá de nuevo.')
    }
  }

  const handleEliminar = async (id) => {
    if (confirm('¿Seguro que querés eliminar este usuario?')) {
      try {
        await eliminarUsuario(id)
        await cargarUsuarios()
      } catch (err) {
        setError('No se pudo eliminar el usuario.')
      }
    }
  }

  if (loading) return <p className="text-gray-500">Cargando usuarios...</p>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h2>
        <button
          onClick={abrirModalCrear}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={18} />
          Nuevo usuario
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-3 text-left">Nombre</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Rol</th>
              <th className="px-6 py-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {usuarios.map(usuario => (
              <tr key={usuario.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-800">{usuario.nombre}</td>
                <td className="px-6 py-4 text-gray-500">{usuario.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    usuario.rol === 'ADMIN' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {usuario.rol}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-3">
                    <button
                      onClick={() => abrirModalEditar(usuario)}
                      className="flex items-center gap-1 text-blue-500 hover:text-blue-700"
                    >
                      <Pencil size={14} /> Editar
                    </button>
                    <button
                      onClick={() => handleEliminar(usuario.id)}
                      className="flex items-center gap-1 text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={14} /> Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">{usuarioEditando ? 'Editar usuario' : 'Nuevo usuario'}</h3>
              <button onClick={cerrarModal}><X size={20} /></button>
            </div>
            <div className="flex flex-col gap-3">
              <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" className="border rounded-lg px-3 py-2 text-sm" />
              <input name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" className="border rounded-lg px-3 py-2 text-sm" />
              <input
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder={usuarioEditando ? 'Nueva contraseña (dejá vacío para no cambiarla)' : 'Contraseña'}
                type="password"
                className="border rounded-lg px-3 py-2 text-sm"
              />
              <select name="rol" value={form.rol} onChange={handleChange} className="border rounded-lg px-3 py-2 text-sm">
                <option value="CLIENTE">Cliente</option>
                <option value="ADMIN">Admin</option>
              </select>
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

export default UserManager
