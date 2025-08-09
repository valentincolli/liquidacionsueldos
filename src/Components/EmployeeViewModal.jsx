import { Modal, ModalFooter } from './Modal/Modal';
import { User, Mail, Phone, MapPin, Calendar, DollarSign, Building, FileText } from 'lucide-react';
import styles from './Modal/Modal.module.scss';

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
      className={styles['employee-view-modal']}
    >
      <div className={styles['employee-details']}>
        {/* Información Personal */}
        <div className={styles['detail-section']}>
          <h3 className={styles['section-title']}>
            <User className={styles['title-icon']} />
            Información Personal
          </h3>
          <div className={styles['detail-grid']}>
            <div className={styles['detail-item']}>
              <div className={styles['detail-label']}>Nombre Completo</div>
              <div className={styles['detail-value']}>{employee.name}</div>
            </div>
            <div className={styles['detail-item']}>
              <div className={styles['detail-label']}>Email</div>
              <div className={styles['detail-value']}>{employee.email}</div>
            </div>
            <div className={styles['detail-item']}>
              <div className={styles['detail-label']}>Teléfono</div>
              <div className={styles['detail-value']}>{employee.phone || '+54 11 1234-5678'}</div>
            </div>
            <div className={styles['detail-item']}>
              <div className={styles['detail-label']}>Dirección</div>
              <div className={styles['detail-value']}>{employee.address || 'Av. Corrientes 1234, CABA'}</div>
            </div>
            <div className={styles['detail-item']}>
              <div className={styles['detail-label']}>Fecha de Nacimiento</div>
              <div className={styles['detail-value']}>{employee.birthDate || '15/03/1985'}</div>
            </div>
            <div className={styles['detail-item']}>
              <div className={styles['detail-label']}>DNI</div>
              <div className={styles['detail-value']}>{employee.dni || '12.345.678'}</div>
            </div>
          </div>
        </div>

        {/* Información Laboral */}
        <div className={styles['detail-section']}>
          <h3 className={styles['section-title']}>
            <Building className={styles['title-icon']} />
            Información Laboral
          </h3>
          <div className={styles['detail-grid']}>
            <div className={styles['detail-item']}>
              <div className={styles['detail-label']}>Cargo</div>
              <div className={styles['detail-value']}>{employee.position}</div>
            </div>
            <div className={styles['detail-item']}>
              <div className={styles['detail-label']}>Departamento</div>
              <div className={styles['detail-value']}>{employee.department}</div>
            </div>
            <div className={styles['detail-item']}>
              <div className={styles['detail-label']}>Fecha de Ingreso</div>
              <div className={styles['detail-value']}>{employee.hireDate}</div>
            </div>
            <div className={styles['detail-item']}>
              <div className={styles['detail-label']}>Estado</div>
              <div className={`${styles['detail-value']} ${styles[getStatusClass(employee.status)]}`}>
                {employee.status}
              </div>
            </div>
            <div className={styles['detail-item']}>
              <div className={styles['detail-label']}>Tipo de Contrato</div>
              <div className={styles['detail-value']}>{employee.contractType || 'Tiempo Completo'}</div>
            </div>
            <div className={styles['detail-item']}>
              <div className={styles['detail-label']}>Jefe Directo</div>
              <div className={styles['detail-value']}>{employee.manager || 'Roberto García'}</div>
            </div>
          </div>
        </div>

        {/* Información Salarial */}
        <div className={styles['detail-section']}>
          <h3 className={styles['section-title']}>
            <DollarSign className={styles['title-icon']} />
            Información Salarial
          </h3>
          <div className={styles['detail-grid']}>
            <div className={styles['detail-item']}>
              <div className={styles['detail-label']}>Salario Base</div>
              <div className={`${styles['detail-value']} ${styles['highlight']}`}>${employee.salary.toLocaleString()}</div>
            </div>
            <div className={styles['detail-item']}>
              <div className={styles['detail-label']}>Convenio</div>
              <div className={styles['detail-value']}>{employee.convenio || 'Convenio General'}</div>
            </div>
            <div className={styles['detail-item']}>
              <div className={styles['detail-label']}>Categoría</div>
              <div className={styles['detail-value']}>{employee.category || 'A1'}</div>
            </div>
            <div className={styles['detail-item']}>
              <div className={styles['detail-label']}>Banco</div>
              <div className={styles['detail-value']}>{employee.bank || 'Banco Nación'}</div>
            </div>
            <div className={styles['detail-item']}>
              <div className={styles['detail-label']}>CBU</div>
              <div className={styles['detail-value']}>{employee.cbu || '0110123456789012345678'}</div>
            </div>
            <div className={styles['detail-item']}>
              <div className={styles['detail-label']}>CUIL</div>
              <div className={styles['detail-value']}>{employee.cuil || '20-12345678-9'}</div>
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className={styles['action-buttons']}>
          <button 
            className={`${styles['action-btn']} ${styles['primary']}`}
            onClick={() => onLiquidarSueldo && onLiquidarSueldo(employee)}
          >
            <DollarSign className="btn-icon" />
            Liquidar Sueldo
          </button>
          <button 
            className={`${styles['action-btn']} ${styles['secondary']}`}
            onClick={() => onHistorialLiquidaciones && onHistorialLiquidaciones(employee)}
          >
            <FileText className="btn-icon" />
            Historial de Liquidaciones
          </button>
        </div>
      </div>

      <ModalFooter>
        <button className={`${styles['btn']} ${styles['btn-secondary']}`} onClick={onClose}>
          Cerrar
        </button>
      </ModalFooter>
    </Modal>
  );
}
