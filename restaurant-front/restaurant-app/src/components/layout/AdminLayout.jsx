import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { UtensilsCrossed, ClipboardList, Users, LogOut } from 'lucide-react'

function AdminLayout() {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-orange-500">🍕 RestaurantApp</h1>
          <p className="text-sm text-gray-500 mt-1">Panel Admin</p>
        </div>

        <nav className="flex flex-col gap-1 p-4 flex-1">
          <NavLink
            to="/admin/menu"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                isActive ? 'bg-orange-100 text-orange-600 font-semibold' : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            <UtensilsCrossed size={18} />
            Menú
          </NavLink>

          <NavLink
            to="/admin/pedidos"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                isActive ? 'bg-orange-100 text-orange-600 font-semibold' : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            <ClipboardList size={18} />
            Pedidos
          </NavLink>

          <NavLink
            to="/admin/usuarios"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                isActive ? 'bg-orange-100 text-orange-600 font-semibold' : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            <Users size={18} />
            Usuarios
          </NavLink>
        </nav>

        <div className="p-4 border-t">
          <p className="text-sm text-gray-500 mb-3">Hola, {usuario?.nombre}</p>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 hover:text-red-700 text-sm transition-colors"
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>

    </div>
  )
}

export default AdminLayout