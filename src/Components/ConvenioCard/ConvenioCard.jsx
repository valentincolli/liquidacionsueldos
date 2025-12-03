import React from 'react';
import { Eye, Edit, Upload, Users, Calendar, FileText, DollarSign } from 'lucide-react';
import { Tooltip } from '../ToolTip/ToolTip';
import './ConvenioCard.scss';

export function ConvenioCard({ convenio, onView, onEdit, onUploadDocument }) {
  // Calcular salario básico promedio (aproximado)
  // En producción, esto debería obtenerse desde el convenio o los empleados
  const getBasicSalary = () => {
    if (convenio.controller?.toUpperCase().includes('LYF')) {
      return 285000;
    } else if (convenio.controller?.toUpperCase().includes('UOCRA')) {
      return 260000;
    }
    return 272500;
  };

  const basicSalary = getBasicSalary();
  
  // Formatear fecha de última actualización
  const formatLastUpdate = () => {
    if (convenio.lastUpdate) {
      const date = new Date(convenio.lastUpdate);
      return date.toLocaleDateString('es-AR', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
    }
    // Fechas por defecto según el convenio
    if (convenio.controller?.toUpperCase().includes('LYF')) {
      return '14 de enero de 2024';
    } else if (convenio.controller?.toUpperCase().includes('UOCRA')) {
      return '31 de enero de 2024';
    }
    return new Date().toLocaleDateString('es-AR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };
  
  return (
    <div className="convenio-card">
      <div className="convenio-header">
        <div className="convenio-title">
          <FileText className="convenio-icon" />
          <h3 className="convenio-name">{convenio.name}</h3>
        </div>
        <div className={`convenio-status ${convenio.status?.toLowerCase() || 'activo'}`}>
          ACTIVO
        </div>
      </div>

      <div className="convenio-details-list">
        <div className="detail-item">
          <Users className="detail-icon" />
          <div className="detail-content">
            <span className="detail-value">{convenio.employeeCount}</span>
            <span className="detail-label">Empleados</span>
          </div>
        </div>

        <div className="detail-item">
          <DollarSign className="detail-icon" />
          <div className="detail-content">
            <span className="detail-value">{formatCurrency(basicSalary)}</span>
            <span className="detail-label">Básico</span>
          </div>
        </div>

        <div className="detail-item">
          <Calendar className="detail-icon" />
          <div className="detail-content">
            <span className="detail-value">{formatLastUpdate()}</span>
            <span className="detail-label">Última actualización</span>
          </div>
        </div>
      </div>

      <div className="convenio-actions">
        <button
          className="details-link"
          onClick={() => onView(convenio.controller)}
        >
          Ver detalles
        </button>

        <div className="action-buttons">
          <Tooltip content="Ver convenio completo" position="top">
            <button
              className="action-btn view"
              onClick={() => onView(convenio.controller)}
            >
              <Eye className="action-icon" />
            </button>
          </Tooltip>

          <Tooltip content="Editar convenio" position="top">
            <button
              className="action-btn edit"
              onClick={() => onEdit && onEdit(convenio)}
            >
              <Edit className="action-icon" />
            </button>
          </Tooltip>

          <Tooltip content="Subir documento" position="top">
            <button
              className="action-btn upload"
              onClick={() => onUploadDocument && onUploadDocument(convenio)}
            >
              <Upload className="action-icon" />
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
