import { NavLink } from 'react-router-dom'
import {
  MenuIcon,
  XIcon,
  PackageIcon,
  UsersIcon
} from './Icon'

interface SidebarProps {
  collapsed: boolean
  setCollapsed: (value: boolean) => void
}

function Sidebar({
  collapsed,
  setCollapsed
}: SidebarProps) {
  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>

      <div className="sidebar-top">

        <div className="brand">

          <div className="brand-mark">
            <PackageIcon size={20} />
          </div>

          {!collapsed && (
            <div className="brand-text">
              <strong>Meu App</strong>
              <span>Dashboard</span>
            </div>
          )}

        </div>

        <button
          type="button"
          className="sidebar-toggle"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Abrir menu' : 'Recolher menu'}
        >
          {collapsed
            ? <MenuIcon size={18} />
            : <XIcon size={18} />
          }
        </button>

      </div>


      <div className="sidebar-nav-area">

        {!collapsed && (
          <div className="nav-title">
            NAVEGAÇÃO
          </div>
        )}

        <nav className="sidebar-nav">

          <NavLink
            to="/produtos"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >

            <span className="sidebar-link-icon">
              <PackageIcon size={19} />
            </span>

            {!collapsed && (
              <>
                <span className="sidebar-link-text">
                  Produtos
                </span>

                <span className="sidebar-link-arrow">
                  →
                </span>
              </>
            )}

          </NavLink>


          <NavLink
            to="/clientes"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >

            <span className="sidebar-link-icon">
              <UsersIcon size={19} />
            </span>

            {!collapsed && (
              <>
                <span className="sidebar-link-text">
                  Clientes
                </span>

                <span className="sidebar-link-arrow">
                  →
                </span>
              </>
            )}

          </NavLink>

        </nav>

      </div>


      {!collapsed && (
        <div className="sidebar-bottom">

          <div className="system-status">
            <span className="status-indicator"></span>

            <div>
              <strong>Online</strong>
              <span>Sistema funcionando</span>
            </div>
          </div>

          <div className="sidebar-version">
            v1.0.0
          </div>

        </div>
      )}

    </aside>
  )
}

export default Sidebar