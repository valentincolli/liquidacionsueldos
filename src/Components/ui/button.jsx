import React from "react";
import './Button.scss';

/**
 * Componente Button unificado para todo el proyecto
 * 
 * @param {string} variant - Variante del botón:
 *   - Principales: 'primary', 'secondary', 'success', 'warning', 'cancel', 'outline', 'ghost', 'default'
 *   - Acciones: 'edit', 'download', 'print', 'save', 'gray'
 *   - Especiales: 'edit-small', 'add-small', 'back', 'expand', 'add-level', 'remove', 'remove-level', 'liquidar', 'accent', 'plus'
 * @param {string} size - Tamaño: 'sm', 'default', 'lg'
 * @param {ReactNode} icon - Componente de icono (de lucide-react)
 * @param {string} iconPosition - Posición del icono: 'left' | 'right'
 * @param {string} action - Acción específica: 'edit', 'download', 'print', 'save', 'cancel' (alternativa a variant)
 * @param {boolean} fullWidth - Si el botón ocupa todo el ancho disponible
 * @param {boolean} disabled - Si el botón está deshabilitado
 * @param {string} className - Clases CSS adicionales
 * @param {object} ...props - Props adicionales del elemento button
 * 
 * @example
 * // Botón primario con icono
 * <Button variant="primary" icon={Plus} iconPosition="left">
 *   Nueva Liquidación
 * </Button>
 * 
 * @example
 * // Botón de acción (con borde)
 * <Button variant="edit" size="sm" icon={Edit}>
 *   Editar
 * </Button>
 * 
 * @example
 * // Botón pequeño sin texto
 * <Button variant="remove" icon={Trash} />
 */
export const Button = React.forwardRef(({
  children,
  variant = 'default',
  size = 'default',
  icon: Icon,
  iconPosition = 'left',
  action,
  fullWidth = false,
  disabled = false,
  className = '',
  ...props
}, ref) => {
  // Determinar la variante final
  // Si se proporciona 'action', tiene prioridad sobre 'variant'
  const finalVariant = action || variant;

  // Construir clases CSS
  const classes = [
    'btn',
    `btn-${finalVariant}`,
    size !== 'default' && `btn-${size}`,
    fullWidth && 'btn-full-width',
    disabled && 'btn-disabled',
    className
  ].filter(Boolean).join(' ');

  // Renderizar icono
  const renderIcon = () => {
    if (!Icon) return null;
    
    const iconSize = size === 'sm' ? 14 : size === 'lg' ? 20 : 16;
    
    return (
      <Icon 
        className={`btn-icon btn-icon-${iconPosition}`}
        size={iconSize}
        aria-hidden="true"
      />
    );
  };

  return (
    <button 
      ref={ref}
      className={classes}
      disabled={disabled}
      {...props}
    >
      {iconPosition === 'left' && renderIcon()}
      {children && <span className="btn-text">{children}</span>}
      {iconPosition === 'right' && renderIcon()}
    </button>
  );
});

Button.displayName = 'Button';
