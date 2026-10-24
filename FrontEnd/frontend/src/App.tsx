import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import { AuthProvider, useAuth } from './context/AuthContext'
import Sidebar from './components/Sidebar'
import ProtectedRoute from './components/ProtectedRoute'

import LoginPage from './pages/LoginPage'
import ProdutosPage from './pages/ProdutosPage'
import ClientesPage from './pages/ClientesPage'
import VendasPage from './pages/VendasPage'

function Layout() {
  const { isAuthenticated } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {isAuthenticated && (
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
      )}

      <main style={{ flex: 1, minWidth: 0, padding: '24px' }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/"
            element={<Navigate to="/produtos" replace />}
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