
import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Sidebar from './components/Sidebar'
import ProtectedRoute from './components/ProtectedRoute'

import LoginPage from './pages/LoginPage'
import ProdutosPage from './pages/ProdutosPage'
import ClientesPage from './pages/ClientesPage'
import VendasPage from './pages/VendasPage'
import DashboardPage from './pages/DashboardPage'

function Layout() {
  const location = useLocation()
  const estaNoLogin = location.pathname === '/login'
  const { isAuthenticated } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="app">

      {isAuthenticated && (
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
      )}

      <main className={estaNoLogin ? 'main-content login-layout' : 'main-content'}>

        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/"
            element={<Navigate to="/dashboard" replace />}
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/produtos"
            element={
              <ProtectedRoute>
                <ProdutosPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/clientes"
            element={
              <ProtectedRoute>
                <ClientesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/vendas"
            element={
              <ProtectedRoute>
                <VendasPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="*"
            element={<Navigate to="/dashboard" replace />}
          />
        </Routes>

      </main>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
