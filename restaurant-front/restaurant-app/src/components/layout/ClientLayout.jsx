import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { UtensilsCrossed, ClipboardList, LogOut } from 'lucide-react'

function ClientLayout() {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-orange-50">

      {/* Navbar superior */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-orange-500">🍕 RestaurantApp</h1>

          <nav className="flex items-center gap-6">
            <NavLink
              to="/cliente/menu"
              className={({ isActive }) =>
                `flex items-center gap-2 text-sm font-medium transition-colors ${
                  isActive ? 'text-orange-500' : 'text-gray-600 hover:text-orange-500'
                }`
              }
            >
              <UtensilsCrossed size={16} />
              Menú
            </NavLink>

            <NavLink
              to="/cliente/pedidos"
              className={({ isActive }) =>
                `flex items-center gap-2 text-sm font-medium transition-colors ${
                  isActive ? 'text-orange-500' : 'text-gray-600 hover:text-orange-500'
                }`
              }
            >
              <ClipboardList size={16} />
              Mis pedidos
            </NavLink>
          </nav>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Hola, {usuario?.nombre}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 transition-colors"
            >
              <LogOut size={16} />
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* Contenido */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <Outlet />
      </main>

    </div>
  )
}

export default ClientLayout