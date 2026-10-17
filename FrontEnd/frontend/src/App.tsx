
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'

import { useState } from 'react'

import Sidebar from './components/Sidebar'
import ProdutosPage from './pages/ProdutosPage'
import ClientesPage from './pages/ClientesPage'
import VendasPage from './pages/VendasPage'

import './App.css'

function App() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <BrowserRouter>
      <div
        className={`app ${
          collapsed ? 'sidebar-collapsed' : ''
        }`}
      >
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <Navigate
                  to="/produtos"
                  replace
                />
              }
            />

            <Route
              path="/produtos"
              element={<ProdutosPage />}
            />

            <Route
              path="/clientes"
              element={<ClientesPage />}
            />

            <Route
              path="/vendas"
              element={<VendasPage />}
            />

            <Route
              path="*"
              element={
                <Navigate
                  to="/produtos"
                  replace
                />
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
