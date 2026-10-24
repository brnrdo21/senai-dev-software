import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

import {
  MenuIcon,
  XIcon,
  PackageIcon,
  UsersIcon,
} from './Icon'

interface SidebarProps {
  collapsed: boolean
  setCollapsed: (value: boolean) => void
}

function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  // Dados do usuário logado e função para sair
  const { user, logout } = useAuth()

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>

      {/* Cabeçalho */}
      <div className="sidebar-top">
        <NavLink to="/vendas" className="brand">
          <div className="brand-mark">
            <PackageIcon size={21} />
          </div>

          {!collapsed && (
            <div className="brand-text">
              <strong>Meu App</strong>
              <span>Gestão de cadastros e vendas</span>
            </div>
          )}
        </NavLink>

        <button
          type="button"
          className="sidebar-toggle"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Abrir menu' : 'Recolher menu'}
          aria-label={collapsed ? 'Abrir menu' : 'Recolher menu'}
        >
          {collapsed ? (
            <MenuIcon size={19} />
          ) : (
            <XIcon size={19} />
          )}
        </button>
      </div>

      {/* Navegação */}
      <div className="sidebar-nav-area">
        {!collapsed && (
          <div className="nav-title">
            MENU PRINCIPAL
          </div>
        )}

        <nav className="sidebar-nav">
          <NavLink
            to="/produtos"
            title={collapsed ? 'Produtos' : undefined}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <span className="sidebar-link-icon">
              <PackageIcon size={20} />
            </span>

            {!collapsed && (
              <>
                <span className="sidebar-link-text">Produtos</span>
                <span className="sidebar-link-arrow">→</span>
              </>
            )}
          </NavLink>

          <NavLink
            to="/clientes"
            title={collapsed ? 'Clientes' : undefined}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <span className="sidebar-link-icon">
              <UsersIcon size={20} />
            </span>

            {!collapsed && (
              <>
                <span className="sidebar-link-text">Clientes</span>
                <span className="sidebar-link-arrow">→</span>
              </>
            )}
          </NavLink>

          <NavLink
            to="/vendas"
            title={collapsed ? 'Vendas' : undefined}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <span className="sidebar-link-icon">
              <span className="sales-nav-icon">↗</span>
            </span>

            {!collapsed && (
              <>
                <span className="sidebar-link-text">Vendas</span>
                <span className="sidebar-link-arrow">→</span>
              </>
            )}
          </NavLink>
        </nav>
      </div>

      {/* Rodapé com usuário e opção de sair */}
      <div className="sidebar-bottom">

        {!collapsed && (
          <>
            <div className="system-status">
              <span className="status-indicator" />

              <div className="system-status-text">
                <strong>Sistema online</strong>
                <span>Funcionando normalmente</span>
              </div>
            </div>

            <div className="sidebar-user">
              <p>👤 {user?.nome ?? 'Usuário'}</p>

              <button
                type="button"
                className="sidebar-logout"
                onClick={logout}
              >
                🚪 Sair
              </button>
            </div>

            <div className="sidebar-version">
              <span>Meu App</span>
              <span>v1.0.0</span>
            </div>
          </>
        )}

      </div>
    </aside>
  )
}

export default Sidebar