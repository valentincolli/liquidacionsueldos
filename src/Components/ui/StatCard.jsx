import React from 'react';
import { motion } from 'framer-motion';
import './StatCard.scss';

/**
 * Componente StatCard unificado para mostrar estadísticas en cards
 * 
 * @param {string} title - Título/etiqueta de la estadística
 * @param {string|number} value - Valor a mostrar
 * @param {ReactNode} icon - Componente de icono (de lucide-react) - opcional
 * @param {string} colorClass - Clase de color: 'primary', 'success', 'warning', 'default' - opcional
 * @param {number} delay - Delay para animación (en segundos) - opcional
 * @param {boolean} showIcon - Si se muestra el icono (por defecto false) - opcional
 * @param {string} className - Clases CSS adicionales - opcional
 */
export const StatCard = ({
  title,
  value,
  icon: Icon,
  colorClass = 'primary',
  delay = 0,
  showIcon = false,
  className = ''
}) => {
  return (
    <motion.div
      className={`card stat-card ${className}`}
      whileHover={{
        scale: 1.05,
        y: -5,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        transition: { duration: 0.2 }
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      {showIcon && Icon ? (
        <div className="stat-content">
          <div className="stat-info">
            <div className={`stat-value ${colorClass}`}>{value}</div>
            <p className="stat-label">{title}</p>
          </div>
          <Icon className={`stat-icon ${colorClass}`} />
        </div>
      ) : (
        <>
          <p className="stat-label">{title}</p>
          <div className={`stat-value ${colorClass}`}>{value}</div>
        </>
      )}
    </motion.div>
  );
};

StatCard.displayName = 'StatCard';

