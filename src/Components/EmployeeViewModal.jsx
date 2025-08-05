import { Modal, ModalFooter } from './Modal/Modal';
import { User, Mail, Phone, MapPin, Calendar, DollarSign, Building, FileText } from 'lucide-react';

export function EmployeeViewModal({ isOpen, onClose, employee, onLiquidarSueldo, onHistorialLiquidaciones }) {
  if (!employee) return null;

  const getStatusClass = (status) => {
    switch (status) {
      case 'Activo':
        return 'active';
      case 'Inactivo':
        return 'inactive';
      case 'Licencia':
        return 'license';
      default:
        return 'active';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Detalles del Empleado - ${employee.name}`}
      size="large"
      className="employee-view-modal"
    >
      <div className="employee-details">
        {/* Información Personal */}
        <div className="detail-section">
          <h3 className="section-title">
            <User className="title-icon" />
            Información Personal
          </h3>
          <div className="detail-grid">
            <div className="detail-item">
              <div className="detail-label">Nombre Completo</div>
              <div className="detail-value">{employee.name}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Email</div>
              <div className="detail-value">{employee.email}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Teléfono</div>
              <div className="detail-value">{employee.phone || '+54 11 1234-5678'}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Dirección</div>
              <div className="detail-value">{employee.address || 'Av. Corrientes 1234, CABA'}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Fecha de Nacimiento</div>
              <div className="detail-value">{employee.birthDate || '15/03/1985'}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">DNI</div>
              <div className="detail-value">{employee.dni || '12.345.678'}</div>
            </div>
          </div>
        </div>

        {/* Información Laboral */}
        <div className="detail-section">
          <h3 className="section-title">
            <Building className="title-icon" />
            Información Laboral
          </h3>
          <div className="detail-grid">
            <div className="detail-item">
              <div className="detail-label">Cargo</div>
              <div className="detail-value">{employee.position}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Departamento</div>
              <div className="detail-value">{employee.department}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Fecha de Ingreso</div>
              <div className="detail-value">{employee.hireDate}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Estado</div>
              <div className={`detail-value status ${getStatusClass(employee.status)}`}>
                {employee.status}
              </div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Tipo de Contrato</div>
              <div className="detail-value">{employee.contractType || 'Tiempo Completo'}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Jefe Directo</div>
              <div className="detail-value">{employee.manager || 'Roberto García'}</div>
            </div>
          </div>
        </div>

        {/* Información Salarial */}
        <div className="detail-section">
          <h3 className="section-title">
            <DollarSign className="title-icon" />
            Información Salarial
          </h3>
          <div className="detail-grid">
            <div className="detail-item">
              <div className="detail-label">Salario Base</div>
              <div className="detail-value highlight">${employee.salary.toLocaleString()}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Convenio</div>
              <div className="detail-value">{employee.convenio || 'Convenio General'}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Categoría</div>
              <div className="detail-value">{employee.category || 'A1'}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Banco</div>
              <div className="detail-value">{employee.bank || 'Banco Nación'}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">CBU</div>
              <div className="detail-value">{employee.cbu || '0110123456789012345678'}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">CUIL</div>
              <div className="detail-value">{employee.cuil || '20-12345678-9'}</div>
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="action-buttons">
          <button 
            className="action-btn primary"
            onClick={() => onLiquidarSueldo && onLiquidarSueldo(employee)}
          >
            <DollarSign className="btn-icon" />
            Liquidar Sueldo
          </button>
          <button 
            className="action-btn secondary"
            onClick={() => onHistorialLiquidaciones && onHistorialLiquidaciones(employee)}
          >
            <FileText className="btn-icon" />
            Historial de Liquidaciones
          </button>
        </div>
      </div>

      <ModalFooter>
        <button className="btn btn-secondary" onClick={onClose}>
          Cerrar
        </button>
      </ModalFooter>
    </Modal>
  );
}
