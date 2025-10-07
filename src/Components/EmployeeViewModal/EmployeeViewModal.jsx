import { Modal, ModalFooter } from '../Modal/Modal';
import { User, Mail, Phone, MapPin, Calendar, DollarSign, Building, FileText } from 'lucide-react';

export function EmployeeViewModal({ isOpen, onClose, employee, onLiquidarSueldo, onHistorialLiquidaciones }) {
  if (!employee) return null;

  const getStatusClass = (status) => {
    switch (status) {
      case 'Activo':
        return 'active';
      case 'Inactivo':
        return 'inactive';
      default:
        return 'active';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Detalles del Empleado - ${employee.nombre} ${employee.apellido}`}
      size="large"
      className={'employee-view-modal'}
    >
      <div className={'employee-details'}>
        {/* Información Personal */}
        <div className={'detail-section'}>
          <h3 className={'section-title'}>
            <User className={'title-icon'} />
            Información Personal
          </h3>
          <div className={'detail-grid'}>
            <div className={'detail-item'}>
              <div className={'detail-label'}>Legajo</div>
              <div className={'detail-value'}>{employee.legajo || '12.345.678'}</div>
            </div>
            <div className={'detail-item'}>
              <div className={'detail-label'}>Nombre Completo</div>
              <div className={'detail-value'}>{`${employee.nombre} ${employee.apellido}`}</div>
            </div>
            <div className={'detail-item'}>
              <div className={'detail-label'}>Dirección</div>
              <div className={'detail-value'}>{`${employee.domicilio}` || 'S/N'}</div>
            </div>
          </div>
        </div>

        {/* Información Laboral */}
          <div className={'detail-section'}>
          <h3 className={'section-title'}>
            <Building className={'title-icon'} />
            Información Laboral
          </h3>
          <div className={'detail-grid'}>
            <div className={'detail-item'}>
              <div className={'detail-label'}>Áreas</div>
              <div className={'detail-value'}>{employee.nombreAreas}</div>
            </div>
            <div className={'detail-item'}>
              <div className={'detail-label'}>Fecha de Ingreso</div>
              <div className={'detail-value'}>{employee.inicioActividad}</div>
            </div>
            <div className={'detail-item'}>
              <div className={'detail-label'}>Estado</div>
              <div className={`${'detail-value'} ${getStatusClass(employee.estado)}`}>
                {employee.estado === "ACTIVO" ? "Activo" : "Dado de baja"}
              </div>
            </div>
            <div className={'detail-item'}>
              <div className={'detail-label'}>Convenio</div>
              <div className={'detail-value'}>{employee.gremioNombre === "LUZ_Y_FUERZA" ? "Luz y Fuerza" : employee.gremioNombre}</div>
            </div>
            <div className={'detail-item'}>
              <div className={'detail-label'}>Categoría</div>
              <div className={'detail-value'}>{employee.idCategoria || '1'}</div>
            </div>
            <div className={'detail-item'}>
              <div className={'detail-label'}>Banco</div>
              <div className={'detail-value'}>{employee.banco || 'Banco Nación'}</div>
            </div>
            <div className={'detail-item'}>
              <div className={'detail-label'}>CUIL</div>
              <div className={'detail-value'}>{employee.cuil || 'Sin Cuil'}</div>
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className={'action-buttons'}>
          <button 
            className={`${'action-btn'} ${'primary'}`}
            onClick={() => onLiquidarSueldo && onLiquidarSueldo(employee)}
          >
            <DollarSign className="btn-icon" />
            Liquidar Sueldo
          </button>
          <button 
            className={`${'action-btn'} ${'secondary'}`}
            onClick={() => onHistorialLiquidaciones && onHistorialLiquidaciones(employee)}
          >
            <FileText className="btn-icon" />
            Historial de Liquidaciones
          </button>
        </div>
      </div>
    </Modal>
  );
}