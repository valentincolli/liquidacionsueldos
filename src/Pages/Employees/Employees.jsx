import { useState, useEffect } from 'react';
import { Search, Plus, Filter, MoreHorizontal, Eye, Edit, DollarSign, FileText } from 'lucide-react';
import * as api from '../../services/empleadosAPI';
import { Dropdown, DropdownItem } from '../../Components/Dropdown/Dropdown';
import { EmployeeViewModal } from '../../Components/EmployeeViewModal.jsx';
import { EmployeeEditModal } from '../../Components/EmployeeEditModal.jsx';
import './Employees.scss';

const employees = [
  {
    id: 1,
    name: 'María González',
    position: 'Desarrolladora Senior',
    department: 'IT',
    salary: 85000,
    status: 'Activo',
    hireDate: '2022-03-15',
    email: 'maria.gonzalez@empresa.com'
  },
  {
    id: 2,
    name: 'Carlos Rodríguez',
    position: 'Analista de Marketing',
    department: 'Marketing',
    salary: 65000,
    status: 'Activo',
    hireDate: '2023-01-10',
    email: 'carlos.rodriguez@empresa.com'
  },
  {
    id: 3,
    name: 'Ana Martínez',
    position: 'Gerente de Ventas',
    department: 'Ventas',
    salary: 95000,
    status: 'Activo',
    hireDate: '2021-08-22',
    email: 'ana.martinez@empresa.com'
  },
  {
    id: 4,
    name: 'Luis Pérez',
    position: 'Contador',
    department: 'Finanzas',
    salary: 70000,
    status: 'Licencia',
    hireDate: '2020-11-05',
    email: 'luis.perez@empresa.com'
  },
  {
    id: 5,
    name: 'Patricia Silva',
    position: 'Diseñadora UX',
    department: 'IT',
    salary: 75000,
    status: 'Activo',
    hireDate: '2022-06-18',
    email: 'patricia.silva@empresa.com'
  }
];

export default function Empleados() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('Todos');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [employeeList, setEmployeeList] = useState(employees);

  const departments = ['Todos', ...Array.from(new Set(employeeList.map(emp => emp.department)))];

  const filteredEmployees = employeeList.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'Todos' || employee.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

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

  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee);
    setShowViewModal(true);
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setShowEditModal(true);
  };

  const handleSaveEmployee = (updatedEmployee) => {
    setEmployeeList(prev =>
      prev.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp)
    );
    console.log('Empleado actualizado:', updatedEmployee);
  };

  const handleLiquidarSueldo = (employee) => {
    console.log('Liquidar sueldo para:', employee.name);
    setShowViewModal(false);
    // Aquí podrías redirigir a la página de liquidación o abrir otro modal
  };

  const handleHistorialLiquidaciones = (employee) => {
    console.log('Ver historial de liquidaciones para:', employee.name);
    setShowViewModal(false);
    // Aquí podrías abrir un modal con el historial o redirigir
  };

  const closeModals = () => {
    setShowViewModal(false);
    setShowEditModal(false);
    setSelectedEmployee(null);
  };

  return (
    <div className="empleados">
      {/* Header */}
      <div className="empleados-header">
        <div className="header-content">
          <h1 className="title title-gradient animated-title">
            Gestión de Empleados
          </h1>
          <p className="subtitle">
            Administra la información y datos de todos los empleados
          </p>
        </div>
        <button className="add-employee-btn">
          <Plus className="btn-icon" />
          Nuevo Empleado
        </button>
      </div>

      {/* Stats Summary */}
      <div className="stats-overview">
        <div className="card stat-card">
          <div className="stat-value success">{employees.length}</div>
          <p className="stat-label">Total Empleados</p>
        </div>
        <div className="card stat-card">
          <div className="stat-value primary">
            {employees.filter(emp => emp.status === 'Activo').length}
          </div>
          <p className="stat-label">Empleados Activos</p>
        </div>
        <div className="card stat-card">
          <div className="stat-value warning">
            {employees.filter(emp => emp.status === 'Licencia').length}
          </div>
          <p className="stat-label">En Licencia</p>
        </div>
        <div className="card stat-card">
          <div className="stat-value default">{departments.length - 1}</div>
          <p className="stat-label">Departamentos</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card filters-card">
        <div className="filters-content">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Buscar empleados por nombre, cargo o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input search-input"
            />
          </div>
          <div className="filter-controls">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="department-select"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <button className="filter-btn">
              <Filter className="filter-icon" />
              Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Employee List */}
      <div className="card employees-list">
        <div className="card-header list-header">
          <h2 className="list-title section-title-effect">Lista de Empleados</h2>
          <p className="list-description">
            {filteredEmployees.length} empleados encontrados
          </p>
        </div>
        <div className="card-content list-content">
          <div className="employee-list">
            {filteredEmployees.map((employee) => (
              <div
                key={employee.id}
                className="employee-item"
              >
                <div className="employee-grid">
                  <div className="employee-info">
                    <h3 className="employee-name">{employee.name}</h3>
                    <p className="employee-email">{employee.email}</p>
                  </div>
                  <div className="employee-position">
                    <p className="position-title">{employee.position}</p>
                    <p className="department">{employee.department}</p>
                  </div>
                  <div className="employee-salary">
                    <p className="salary-amount">
                      ${employee.salary.toLocaleString()}
                    </p>
                    <p className="hire-date">Ingreso: {employee.hireDate}</p>
                  </div>
                  <div className="employee-status">
                    <span className={`status-badge ${getStatusClass(employee.status)}`}>
                      {employee.status}
                    </span>
                  </div>
                </div>
                <div className="employee-actions">
                  <Dropdown
                    trigger={
                      <button className="actions-trigger">
                        <MoreHorizontal className="actions-icon" />
                      </button>
                    }
                    align="right"
                  >
                    <DropdownItem
                      icon={Eye}
                      onClick={() => handleViewEmployee(employee)}
                    >
                      Ver
                    </DropdownItem>
                    <DropdownItem
                      icon={Edit}
                      onClick={() => handleEditEmployee(employee)}
                    >
                      Editar
                    </DropdownItem>
                  </Dropdown>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modales */}
      <EmployeeViewModal
        isOpen={showViewModal}
        onClose={closeModals}
        employee={selectedEmployee}
        onLiquidarSueldo={handleLiquidarSueldo}
        onHistorialLiquidaciones={handleHistorialLiquidaciones}
      />

      <EmployeeEditModal
        isOpen={showEditModal}
        onClose={closeModals}
        employee={selectedEmployee}
        onSave={handleSaveEmployee}
      />
    </div>
  );
}
