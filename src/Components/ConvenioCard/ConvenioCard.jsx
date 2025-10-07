import React, { useState } from 'react';
import { Eye, Edit, Upload, Download, Users, Calendar, Layers, FileText, Layers3Icon } from 'lucide-react';
import { Tooltip } from '../ToolTip/ToolTip';
import './ConvenioCard.scss';

export function ConvenioCard({ convenio, onView, onEdit, onUploadDocument }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="convenio-card">
      <div className="convenio-header">
        <div className="convenio-title">
          <FileText className="convenio-icon" />
          <div className="title-content">
            <h3 className="convenio-name">{convenio.name}</h3>
          </div>
        </div>
        <div className={`convenio-status ${convenio.status.toLowerCase()}`}>
          {convenio.status}
        </div>
      </div>

      <div className="convenio-summary">
        <div className="summary-item">
          <Users className="summary-icon" />
          <div className="summary-content">
            <span className="summary-value">{convenio.employeeCount}</span>
            <span className="summary-label">Empleados</span>
          </div>
        </div>
        
        <div className="summary-item">
          <Layers className="summary-icon" />
          <div className="summary-content">
            <span className="convenio-status">{convenio.categories}</span>
            <span className="summary-label">Categorías</span>
          </div>
        </div>
      </div>

      {showDetails && (
        <div className="convenio-details">
          <div className="details-grid">
            <div className="detail-group">
              <h4>Información General</h4>
              <div className="detail-item">
                <span className="detail-value">{convenio.description || "Sin descripción"}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="convenio-actions">
        <button 
          className="details-toggle"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? 'Ocultar detalles' : 'Ver detalles'}
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