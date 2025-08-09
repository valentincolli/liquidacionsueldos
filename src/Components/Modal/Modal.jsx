import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import styles from './Modal.module.scss';

export function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'medium',
  showCloseButton = true,
  className = ''
}) {
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles['modal-overlay']} onClick={onClose}>
      <div 
        className={`${styles['modal-content']} ${size === 'large' ? styles['large'] : ''} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || showCloseButton) && (
          <div className={styles['modal-header']}>
            {title && <h2 className={styles['modal-title']}>{title}</h2>}
            {showCloseButton && (
              <button
                className={styles['modal-close-btn']}
                onClick={onClose}
                aria-label="Cerrar modal"
              >
                <X className={styles['close-icon']} />
              </button>
            )}
          </div>
        )}
        
        <div className={styles['modal-body']}>
          {children}
        </div>
      </div>
    </div>
  );
}

export function ModalFooter({ children, className = '' }) {
  return (
    <div className={`${styles['modal-footer']} ${className}`}>
      {children}
    </div>
  );
}
