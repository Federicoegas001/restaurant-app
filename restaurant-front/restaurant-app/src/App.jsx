import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import LoginPage from './pages/auth/LoginPage'
import AdminLayout from './components/layout/AdminLayout'
import ClientLayout from './components/layout/ClientLayout'
import MenuManager from './pages/admin/MenuManager'
import UserManager from './pages/admin/UserManager'
import MenuView from './pages/client/MenuView'
import MyOrders from './pages/client/MyOrders'
import OrderManager from './pages/admin/OrderManager'

function HomeRedirect() {
  const { usuario } = useAuth()
  if (!usuario) return <Navigate to="/login" replace />
  if (usuario.rol === 'ADMIN') return <Navigate to="/admin/menu" replace />
  return <Navigate to="/cliente/menu" replace />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="menu" element={<MenuManager />} />
        <Route path="pedidos" element={<OrderManager />} />
        <Route path="usuarios" element={<UserManager />} />
      </Route>

      <Route
        path="/cliente"
        element={
          <ProtectedRoute requiredRole="CLIENTE">
            <ClientLayout />
          </ProtectedRoute>
        }
      >
        <Route path="menu" element={<MenuView />} />
        <Route path="pedidos" element={<MyOrders />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
