import { NavLink } from "react-router-dom";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}

function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>

      <div className="sidebar-header">

        {!collapsed && (
          <div className="logo">
            Meu App
          </div>
        )}

        <button
          className="toggle-button"
          onClick={() => setCollapsed(!collapsed)}
        >
          ☰
        </button>

      </div>

      <nav className="sidebar-menu">

        <NavLink
          to="/produtos"
          className={({ isActive }) =>
            isActive ? "menu-link active" : "menu-link"
          }
        >
          <span>📦</span>

          {!collapsed && (
            <span className="menu-text">Produtos</span>
          )}
        </NavLink>

        <NavLink
          to="/clientes"
          className={({ isActive }) =>
            isActive ? "menu-link active" : "menu-link"
          }
        >
          <span>👥</span>

          {!collapsed && (
            <span className="menu-text">Clientes</span>
          )}
        </NavLink>

      </nav>

    </aside>
  );
}

export default Sidebar;