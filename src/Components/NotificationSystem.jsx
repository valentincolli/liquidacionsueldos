import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import '../styles/NotificationSystem.scss';

let notificationId = 0;

export const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  useEffect(() => {
    // Función global para agregar notificaciones
    window.showNotification = (message, type = 'info', duration = 5000) => {
      const id = ++notificationId;
      const notification = { id, message, type };
      
      setNotifications(prev => [...prev, notification]);
      
      if (duration > 0) {
        setTimeout(() => {
          removeNotification(id);
        }, duration);
      }
    };

    return () => {
      delete window.showNotification;
    };
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="notification-icon" />;
      case 'error':
        return <AlertCircle className="notification-icon" />;
      case 'info':
      default:
        return <Info className="notification-icon" />;
    }
  };

  return (
    <div className="notification-container">
      {notifications.map(notification => (
        <div key={notification.id} className={`notification ${notification.type}`}>
          {getIcon(notification.type)}
          <span className="notification-message">{notification.message}</span>
          <button 
            className="notification-close"
            onClick={() => removeNotification(notification.id)}
          >
            <X className="close-icon" />
          </button>
        </div>
      ))}
    </div>
  );
};

// Helper functions for easy use
export const showSuccess = (message) => {
  if (window.showNotification) {
    window.showNotification(message, 'success');
  }
};

export const showError = (message) => {
  if (window.showNotification) {
    window.showNotification(message, 'error');
  }
};

export const showInfo = (message) => {
  if (window.showNotification) {
    window.showNotification(message, 'info');
  }
};
