import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  FileText, 
  Calculator, 
  ChevronLeft, 
  ChevronRight,
  DollarSign
} from 'lucide-react';
import '../../styles/components/_sidebar.scss';

const navItems = [
  {
    title: 'Dashboard',
    href: '/',
    icon: Home,
  },
  {
    title: 'Empleados',
    href: '/empleados',
    icon: Users,
  },
  {
    title: 'Convenios',
    href: '/convenios',
    icon: FileText,
  },
  {
    title: 'Liquidación',
    href: '/liquidacion',
    icon: Calculator,
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(true); // Inicia colapsado
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);
  const location = useLocation();

  // Determinar si el sidebar debe estar expandido
  // Si está fijado: usa el estado collapsed directamente
  // Si no está fijado: se expande con hover si está colapsado, o se mantiene expandido si no está colapsado
  const isExpanded = pinned ? !collapsed : (collapsed ? hovered : !collapsed);

  const handleToggle = (e) => {
    e.stopPropagation(); // Evitar que el hover interfiera
    // Si no está fijado, fijar en el estado actual (expandido o colapsado según isExpanded)
    // Si ya está fijado, desfijar para volver al comportamiento de hover
    if (!pinned) {
      // Fijar en el estado actual visible
      // Si está expandido por hover, fijar expandido; si está colapsado, fijar colapsado
      setCollapsed(!isExpanded);
      setPinned(true);
      setHovered(false); // Limpiar hover al fijar
    } else {
      // Si ya está fijado, desfijar para volver al comportamiento de hover
      // Volver al estado colapsado por defecto cuando se desfija
      setPinned(false);
      setCollapsed(true);
      setHovered(false);
    }
  };

  const handleMouseEnter = () => {
    if (!pinned) {
      // Si no está fijado, expandir con hover
      setHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (!pinned) {
      // Si no está fijado, volver al estado colapsado al salir
      setHovered(false);
      // Asegurar que vuelva al estado colapsado cuando no está fijado
      setCollapsed(true);
    }
  };

  return (
    <div 
      className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'} ${pinned ? 'pinned' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Header */}
      <div className={`sidebar-header ${!isExpanded ? 'collapsed' : ''}`}>
        <div className="header-content">
          {isExpanded && (
            <div className="brand">
              <DollarSign className="brand-icon" />
              <h1 className="brand-text">Liq. Sueldos</h1>
            </div>
          )}
          {!isExpanded && (
            <DollarSign className="brand-icon" />
          )}
          <button
            onClick={handleToggle}
            className="toggle-btn"
            title={pinned ? 'Desfijar (volver a hover)' : (isExpanded ? 'Fijar expandido' : 'Fijar colapsado')}
          >
            {isExpanded ? (
              <ChevronLeft className="toggle-icon" />
            ) : (
              <ChevronRight className="toggle-icon" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            
            return (
              <li key={item.href} className="nav-item">
                <Link
                  to={item.href}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  title={!isExpanded ? item.title : undefined}
                >
                  <Icon className="nav-icon" />
                  {isExpanded && (
                    <span className="nav-text">{item.title}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className={`sidebar-footer ${!isExpanded ? 'collapsed' : ''}`}>
        {isExpanded ? (
          <div className="footer-content">
            <p>Gestión de Sueldos</p>
            <p className="version">v1.0.0</p>
          </div>
        ) : (
          <div className="footer-content">
            <span className="version">v1.0</span>
          </div>
        )}
      </div>
    </div>
  );
}