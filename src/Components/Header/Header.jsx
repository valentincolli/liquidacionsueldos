import { useNavigate } from 'react-router-dom';
import styles from './Header.module.scss';

function Header() {
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <button 
          onClick={() => navigate('/inicio')}
          className={styles.navButton}
        >
          Inicio
        </button>
        <button 
          onClick={() => navigate('/productos')}
          className={styles.navButton}
        >
          Productos
        </button>
        <button 
          onClick={() => navigate('/servicios')}
          className={styles.navButton}
        >
          Servicios
        </button>
        <button 
          onClick={() => navigate('/contacto')}
          className={styles.navButton}
        >
          Contacto
        </button>
      </nav>
    </header>
  );
}

export default Header;
