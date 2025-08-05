import { useState, useEffect } from 'react';
import { Modal, ModalFooter } from './Modal/Modal';
import { User, Building, DollarSign, Save, X } from 'lucide-react';

export function EmployeeEditModal({ isOpen, onClose, employee, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    position: '',
    department: '',
    salary: '',
    status: 'Activo',
    contractType: 'Tiempo Completo',
    manager: '',
    convenio: 'Convenio General',
    category: 'A1',
    bank: 'Banco Nación',
    cbu: '',
    cuil: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        address: employee.address || '',
        position: employee.position || '',
        department: employee.department || '',
        salary: employee.salary || '',
        status: employee.status || 'Activo',
        contractType: employee.contractType || 'Tiempo Completo',
        manager: employee.manager || '',
        convenio: employee.convenio || 'Convenio General',
        category: employee.category || 'A1',
        bank: employee.bank || 'Banco Nación',
        cbu: employee.cbu || '',
        cuil: employee.cuil || ''
      });
      setErrors({});
    }
  }, [employee]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.position.trim()) {
      newErrors.position = 'El cargo es requerido';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'El departamento es requerido';
    }

    if (!formData.salary || isNaN(formData.salary) || Number(formData.salary) <= 0) {
      newErrors.salary = 'El salario debe ser un número válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedEmployee = {
        ...employee,
        ...formData,
        salary: Number(formData.salary)
      };

      onSave && onSave(updatedEmployee);
      onClose();
    } catch (error) {
      console.error('Error saving employee:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!employee) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Editar Empleado - ${employee.name}`}
      size="large"
      className="employee-edit-modal"
    >
      <form onSubmit={handleSubmit} className="employee-form">
        {/* Información Personal */}
        <div className="form-section">
          <h3 className="section-title">
            <User className="title-icon" />
            Información Personal
          </h3>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Nombre Completo *</label>
              <input
                type="text"
                className={`form-input ${errors.name ? 'error' : ''}`}
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ingrese el nombre completo"
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
            
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input
                type="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="ejemplo@empresa.com"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Teléfono</label>
              <input
                type="tel"
                className="form-input"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+54 11 1234-5678"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Dirección</label>
              <input
                type="text"
                className="form-input"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Dirección completa"
              />
            </div>

            <div className="form-group">
              <label className="form-label">CUIL</label>
              <input
                type="text"
                className="form-input"
                value={formData.cuil}
                onChange={(e) => handleInputChange('cuil', e.target.value)}
                placeholder="20-12345678-9"
              />
            </div>
          </div>
        </div>

        {/* Información Laboral */}
        <div className="form-section">
          <h3 className="section-title">
            <Building className="title-icon" />
            Información Laboral
          </h3>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Cargo *</label>
              <input
                type="text"
                className={`form-input ${errors.position ? 'error' : ''}`}
                value={formData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                placeholder="Cargo del empleado"
              />
              {errors.position && <span className="error-message">{errors.position}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Departamento *</label>
              <select
                className={`form-select ${errors.department ? 'error' : ''}`}
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
              >
                <option value="">Seleccionar departamento</option>
                <option value="IT">IT</option>
                <option value="Marketing">Marketing</option>
                <option value="Ventas">Ventas</option>
                <option value="Finanzas">Finanzas</option>
                <option value="RRHH">RRHH</option>
                <option value="Operaciones">Operaciones</option>
              </select>
              {errors.department && <span className="error-message">{errors.department}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Estado</label>
              <select
                className="form-select"
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
                <option value="Licencia">Licencia</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Tipo de Contrato</label>
              <select
                className="form-select"
                value={formData.contractType}
                onChange={(e) => handleInputChange('contractType', e.target.value)}
              >
                <option value="Tiempo Completo">Tiempo Completo</option>
                <option value="Medio Tiempo">Medio Tiempo</option>
                <option value="Contrato">Contrato</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Jefe Directo</label>
              <input
                type="text"
                className="form-input"
                value={formData.manager}
                onChange={(e) => handleInputChange('manager', e.target.value)}
                placeholder="Nombre del jefe directo"
              />
            </div>
          </div>
        </div>

        {/* Información Salarial */}
        <div className="form-section">
          <h3 className="section-title">
            <DollarSign className="title-icon" />
            Información Salarial
          </h3>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Salario Base *</label>
              <input
                type="number"
                className={`form-input ${errors.salary ? 'error' : ''}`}
                value={formData.salary}
                onChange={(e) => handleInputChange('salary', e.target.value)}
                placeholder="0"
                min="0"
                step="1000"
              />
              {errors.salary && <span className="error-message">{errors.salary}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Convenio</label>
              <select
                className="form-select"
                value={formData.convenio}
                onChange={(e) => handleInputChange('convenio', e.target.value)}
              >
                <option value="Convenio General">Convenio General</option>
                <option value="Convenio IT">Convenio IT</option>
                <option value="Convenio Comercio">Convenio Comercio</option>
                <option value="Convenio Metalúrgico">Convenio Metalúrgico</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Categoría</label>
              <select
                className="form-select"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
              >
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
                <option value="C1">C1</option>
                <option value="C2">C2</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Banco</label>
              <select
                className="form-select"
                value={formData.bank}
                onChange={(e) => handleInputChange('bank', e.target.value)}
              >
                <option value="Banco Nación">Banco Nación</option>
                <option value="Banco Provincia">Banco Provincia</option>
                <option value="Banco Santander">Banco Santander</option>
                <option value="Banco Galicia">Banco Galicia</option>
                <option value="BBVA">BBVA</option>
                <option value="Banco Macro">Banco Macro</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">CBU</label>
              <input
                type="text"
                className="form-input"
                value={formData.cbu}
                onChange={(e) => handleInputChange('cbu', e.target.value)}
                placeholder="0110123456789012345678"
                maxLength="22"
              />
            </div>
          </div>
        </div>
      </form>

      <ModalFooter>
        <button 
          type="button" 
          className="btn btn-secondary" 
          onClick={onClose}
          disabled={isLoading}
        >
          <X className="h-4 w-4 mr-2" />
          Cancelar
        </button>
        <button 
          type="submit" 
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </ModalFooter>
    </Modal>
  );
}
