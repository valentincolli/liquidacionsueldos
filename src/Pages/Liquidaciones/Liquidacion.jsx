import React, { useState } from 'react';
import { Calculator, Plus, TrendingUp, Clock, History, Settings, Search, FileText, Users, Printer, Download, Eye, Calendar } from 'lucide-react';
import '../../PlaceHolder.scss';
import './Liquidacion.scss'

// Mock data for recent individual payrolls
const recentPayrolls = [
  {
    id: 1,
    employeeName: 'María González',
    employeeId: 1001,
    position: 'Desarrolladora Senior',
    department: 'IT',
    period: '2024-01',
    periodName: 'Enero 2024',
    basicSalary: 85000,
    bonifications: 12750,
    deductions: 18700,
    netSalary: 79050,
    status: 'Procesada',
    processedDate: '2024-02-01',
    paymentDate: '2024-02-05'
  },
  {
    id: 2,
    employeeName: 'Carlos Rodríguez',
    employeeId: 1002,
    position: 'Analista de Marketing',
    department: 'Marketing',
    period: '2024-01',
    periodName: 'Enero 2024',
    basicSalary: 65000,
    bonifications: 6500,
    deductions: 14300,
    netSalary: 57200,
    status: 'Procesada',
    processedDate: '2024-02-01',
    paymentDate: '2024-02-05'
  },
  {
    id: 3,
    employeeName: 'Ana Martínez',
    employeeId: 1003,
    position: 'Gerente de Ventas',
    department: 'Ventas',
    period: '2024-01',
    periodName: 'Enero 2024',
    basicSalary: 95000,
    bonifications: 19000,
    deductions: 20900,
    netSalary: 93100,
    status: 'Procesada',
    processedDate: '2024-02-01',
    paymentDate: '2024-02-05'
  },
  {
    id: 4,
    employeeName: 'Luis Pérez',
    employeeId: 1004,
    position: 'Contador',
    department: 'Finanzas',
    period: '2024-01',
    periodName: 'Enero 2024',
    basicSalary: 70000,
    bonifications: 7000,
    deductions: 15400,
    netSalary: 61600,
    status: 'Pendiente',
    processedDate: null,
    paymentDate: null
  },
  {
    id: 5,
    employeeName: 'Patricia Silva',
    employeeId: 1005,
    position: 'Diseñadora UX',
    department: 'IT',
    period: '2024-01',
    periodName: 'Enero 2024',
    basicSalary: 75000,
    bonifications: 11250,
    deductions: 16500,
    netSalary: 69750,
    status: 'Procesada',
    processedDate: '2024-02-01',
    paymentDate: '2024-02-05'
  }
];

export default function Liquidacion() {
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [payrollList, setPayrollList] = useState(recentPayrolls);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');

  const handleViewDetails = (payroll) => {
    setSelectedPayroll(payroll);
    setShowDetailModal(true);
  };

  const handleProcessPayroll = (result) => {
    console.log('Procesamiento completado:', result);
    // Aquí puedes actualizar la lista con el nuevo resultado
  };

  const handlePrintPayroll = (payroll) => {
    console.log('Imprimiendo liquidación:', payroll.periodName);
    window.print();
  };

  const handleDownloadPayroll = (payroll) => {
    console.log('Descargando liquidación:', payroll.periodName);
    const link = document.createElement('a');
    link.href = `data:text/plain;charset=utf-8,Liquidación ${payroll.periodName}`;
    link.download = `liquidacion_${payroll.period}.txt`;
    link.click();
  };

  const filteredPayrolls = payrollList.filter(payroll => {
    const matchesSearch = payroll.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payroll.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payroll.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'Todos' || payroll.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="placeholder-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="title title-gradient animated-title">
            Liquidación de Sueldos
          </h1>
          <p className="subtitle">
            Procesa y gestiona las liquidaciones de sueldos de los empleados
          </p>
        </div>
        <button className="add-btn">
          <Plus className="btn-icon" />
          Nueva Liquidación
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="card stat-card">
          <div className="stat-content">
            <div className="stat-info">
              <div className="stat-value warning">8</div>
              <p className="stat-label">Pendientes</p>
            </div>
            <Clock className="stat-icon warning" />
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-content">
            <div className="stat-info">
              <div className="stat-value success">116</div>
              <p className="stat-label">Completadas</p>
            </div>
            <TrendingUp className="stat-icon success" />
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-content">
            <div className="stat-info">
              <div className="stat-value primary">$2,847,500</div>
              <p className="stat-label">Total del Mes</p>
            </div>
            <Calculator className="stat-icon primary" />
          </div>
        </div>
      </div>
      {/* Search and Filter */}
      <div className="card mb-6">
        <div className="card-content">
          <div className="search-filter-container">
            <div className="search-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Buscar por empleado, cargo o departamento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input search-input"
              />
            </div>
            <div className="filter-controls">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="Todos">Todos los estados</option>
                <option value="Procesada">Procesadas</option>
                <option value="Pendiente">Pendientes</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Placeholder Content */}
      <div className="main-content">
      {/* Recent Payrolls */}
      <div className="card">
        <div className="card-header">
          <h2 className="section-title section-title-effect">
            <FileText className="title-icon" />
            Liquidaciones Recientes
          </h2>
          <p className="card-description">
            Historial de liquidaciones procesadas
          </p>
        </div>
        <div className="card-content">
          {filteredPayrolls.length === 0 ? (
            <div className="empty-state">
              <FileText className="empty-icon" />
              <h3>No se encontraron liquidaciones</h3>
              <p>
                {searchTerm || statusFilter !== 'Todos'
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'No hay liquidaciones registradas aún'
                }
              </p>
            </div>
          ) : (
            <div className="payroll-grid">
              {filteredPayrolls.map((payroll) => (
              <div key={payroll.id} className="payroll-card employee-payroll">
                <div className="payroll-header">
                  <div className="employee-info">
                    <Users className="employee-icon" />
                    <div className="employee-details">
                      <span className="employee-name">{payroll.employeeName}</span>
                      <span className="employee-position">{payroll.position}</span>
                      <span className="employee-department">{payroll.department}</span>
                    </div>
                  </div>
                  <div className={`payroll-status ${payroll.status.toLowerCase()}`}>
                    {payroll.status}
                  </div>
                </div>

                <div className="salary-breakdown">
                  <div className="salary-item">
                    <span className="salary-label">Básico:</span>
                    <span className="salary-value">${payroll.basicSalary.toLocaleString()}</span>
                  </div>
                  <div className="salary-item bonification">
                    <span className="salary-label">Bonificaciones:</span>
                    <span className="salary-value">+${payroll.bonifications.toLocaleString()}</span>
                  </div>
                  <div className="salary-item deduction">
                    <span className="salary-label">Descuentos:</span>
                    <span className="salary-value">-${payroll.deductions.toLocaleString()}</span>
                  </div>
                  <div className="salary-item total">
                    <span className="salary-label">Neto:</span>
                    <span className="salary-value">${payroll.netSalary.toLocaleString()}</span>
                  </div>
                </div>

                <div className="payroll-period-info">
                  <div className="period-detail">
                    <Calendar className="period-icon" />
                    <span>{payroll.periodName}</span>
                  </div>
                  {payroll.paymentDate && (
                    <div className="payment-date">
                      Pago: {new Date(payroll.paymentDate).toLocaleDateString('es-ES')}
                    </div>
                  )}
                </div>

                <div className="payroll-actions">
                  <button
                    className="action-btn view"
                    onClick={() => handleViewDetails(payroll)}
                    title="Ver detalles"
                  >
                    <Eye className="action-icon" />
                  </button>
                  <button
                    className="action-btn print"
                    onClick={() => handlePrintPayroll(payroll)}
                    title="Imprimir recibo"
                  >
                    <Printer className="action-icon" />
                  </button>
                  <button
                    className="action-btn download"
                    onClick={() => handleDownloadPayroll(payroll)}
                    title="Descargar recibo"
                  >
                    <Download className="action-icon" />
                  </button>
                </div>
              </div>
              ))}
            </div>
          )}
        </div>
      </div>
        {/* Quick Actions */}
        <div className="card quick-actions">
          <div className="card-header">
            <h2 className="card-title section-title-effect">Acciones Rápidas</h2>
            <p className="card-description">
              Próximas funcionalidades
            </p>
          </div>
          <div className="card-content">
            <div className="actions-list">
              <button className="action-btn primary">
                <span>Procesar Liquidación</span>
                <Calculator className="action-icon" />
              </button>
              <button className="action-btn success">
                <span>Generar Reportes</span>
                <TrendingUp className="action-icon" />
              </button>
              <button className="action-btn warning">
                <span>Historial</span>
                <History className="action-icon" />
              </button>
              <button className="action-btn secondary">
                <span>Configuración</span>
                <Settings className="action-icon" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
