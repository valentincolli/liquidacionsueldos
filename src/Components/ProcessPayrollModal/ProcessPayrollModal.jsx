import React, { useState } from 'react';
import { Modal, ModalFooter } from '../Modal/Modal';
import { Search, Users, DollarSign, Download, Printer, Plus, X, Edit, CheckCircle, AlertCircle, User, Calendar, Badge, Clock, Star } from 'lucide-react';
import './ProcessPayrollModal.scss';
import * as api from '../../services/empleadosAPI'

// Mock data de empleados
const employeesData = [
  {
    id: 1,
    legajo: 8,
    name: 'PAES GUILLERMO TOMAS',
    section: 'Ant:00/00',
    category: 'Medio Of.',
    cuit: '20.37291900.1',
    basicSalary: 326326.00,
    ingressDate: '02/01/2025',
    convenio: 'UOCRA'
  },
  {
    id: 2,
    legajo: 15,
    name: 'GONZALEZ MARIA ELENA',
    section: 'Adm:01/02',
    category: 'Oficial Esp.',
    cuit: '27.28456123.4',
    basicSalary: 385000.00,
    ingressDate: '15/03/2022',
    convenio: 'UOCRA'
  },
  {
    id: 3,
    legajo: 23,
    name: 'RODRIGUEZ CARLOS ALBERTO',
    section: 'Tec:02/01',
    category: 'Oficial',
    cuit: '23.15789456.8',
    basicSalary: 295000.00,
    ingressDate: '10/07/2021',
    convenio: 'UOCRA'
  },
  {
    id: 4,
    legajo: 7,
    name: 'MARTINEZ ANA SOFIA',
    section: 'Adm:01/01',
    category: 'Ayudante',
    cuit: '27.34567890.2',
    basicSalary: 245000.00,
    ingressDate: '28/11/2023',
    convenio: 'UOCRA'
  }
];

export function ProcessPayrollModal({ isOpen, onClose, onProcess }) {
  const [currentStep, setCurrentStep] = useState('search'); // 'search', 'payroll', 'preview'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [payrollData, setPayrollData] = useState({});
  const [concepts, setConcepts] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [employeeList, setEmployeeList] = useState(employeesData);

  // Filtrar empleados por búsqueda
  const filteredEmployees = employeesData.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.legajo.toString().includes(searchTerm)
  );

  // Seleccionar empleado
  const handleSelectEmployee = (employee) => {
    setSelectedEmployee(employee);
    initializePayrollData(employee);
    setCurrentStep('payroll');
  };

  // Inicializar datos de liquidación
  const initializePayrollData = (employee) => {
    const currentDate = new Date();
    const period = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

    setPayrollData({
      period: period,
      periodDisplay: getCurrentPeriod(),
      basicSalary: employee.basicSalary,
      category: employee.category
    });

    // Conceptos predeterminados basados en el recibo
    setConcepts([
      { id: 1, code: 2, name: 'Hs.Normales', units: 91.0, unitValue: 3586.00, amount: 326326.00, type: 'remuneration' },
      { id: 2, code: 3, name: 'Horas Extras', units: 1.5, unitValue: 5379.00, amount: 8068.50, type: 'remuneration' },
      { id: 3, code: 4, name: 'Hs.Extras Dobles', units: 7.0, unitValue: 7172.00, amount: 50204.00, type: 'remuneration' },
      { id: 4, code: 12, name: 'Asistencia', units: 99.5, unitValue: 717.50, amount: 71361.40, type: 'remuneration' },
      { id: 5, code: 70, name: 'Jubilacion', units: 11.0, unitValue: 0, amount: -50155.59, type: 'deduction' },
      { id: 6, code: 71, name: 'Ley 19032', units: 3.0, unitValue: 0, amount: -13678.80, type: 'deduction' },
      { id: 7, code: 73, name: 'UOCRA', units: 3.0, unitValue: 0, amount: -13678.80, type: 'deduction' },
      { id: 8, code: 75, name: 'Sindicato', units: 2.5, unitValue: 0, amount: -11399.00, type: 'deduction' },
      { id: 9, code: 79, name: 'Seguro', units: 0, unitValue: 0, amount: -3366.60, type: 'deduction' }
    ]);
  };

  // Obtener período actual
  const getCurrentPeriod = () => {
    const currentDate = new Date();
    const month = currentDate.toLocaleDateString('es-ES', { month: 'long' }).toUpperCase();
    const year = currentDate.getFullYear();
    const quarter = Math.ceil((currentDate.getMonth() + 1) / 6);
    return `${quarter}°Q. ${month} ${year}`;
  };

  // Agregar concepto manual
  const addManualConcept = () => {
    const newConcept = {
      id: Date.now(),
      code: '',
      name: '',
      units: 0,
      unitValue: 0,
      amount: 0,
      type: 'remuneration',
      isManual: true
    };
    setConcepts([...concepts, newConcept]);
  };

  // Actualizar concepto
  const updateConcept = (id, field, value) => {
    setConcepts(prev => prev.map(concept => {
      if (concept.id === id) {
        const updated = { ...concept, [field]: value };
        // Auto-calculate amount if units or unitValue change
        if (field === 'units' || field === 'unitValue') {
          updated.amount = (updated.units || 0) * (updated.unitValue || 0);
        }
        return updated;
      }
      return concept;
    }));
  };

  // Eliminar concepto
  const removeConcept = (id) => {
    setConcepts(prev => prev.filter(concept => concept.id !== id));
  };

  // Calcular totales
  const calculateTotals = () => {
    const remunerations = concepts.filter(c => c.type === 'remuneration').reduce((sum, c) => sum + (c.amount || 0), 0);
    const deductions = concepts.filter(c => c.type === 'deduction').reduce((sum, c) => sum + Math.abs(c.amount || 0), 0);
    const netAmount = remunerations - deductions;

    return { remunerations, deductions, netAmount };
  };

  // Generar recibo
  const generatePayroll = () => {
    setCurrentStep('preview');
  };

  // Imprimir recibo
  const handlePrint = () => {
    window.print();
  };

  // Descargar recibo
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = 'data:text/plain;charset=utf-8,Recibo de Sueldo - ' + selectedEmployee?.name;
    link.download = `recibo_${selectedEmployee?.legajo}_${payrollData.period}.txt`;
    link.click();
  };

  // Resetear modal
  const resetModal = () => {
    setCurrentStep('search');
    setSearchTerm('');
    setSelectedEmployee(null);
    setPayrollData({});
    setConcepts([]);
    setIsProcessing(false);
    onClose();
  };

  const { remunerations, deductions, netAmount } = calculateTotals();

  return (
    <Modal
      isOpen={isOpen}
      onClose={resetModal}
      title={
        currentStep === 'search' ? 'Buscar Empleado' :
        currentStep === 'payroll' ? `Liquidación - ${selectedEmployee?.name}` :
        'Vista Previa del Recibo'
      }
      size={currentStep === 'preview' ? 'large' : 'medium'}
      className="process-payroll-modal"
    >
      {/* STEP 1: EMPLOYEE SEARCH */}
      {currentStep === 'search' && (
        <div className="employee-search">
          <div className="search-section">
            <div className="section-header-enhanced">
              <div className="step-indicator">
                <span className="step-number">1</span>
                <Star className="step-star" />
              </div>
              <div className="header-content">
                <h3 className="section-title section-title-effect">
                  <Users className="title-icon" />
                  Seleccionar Empleado
                </h3>
                <p className="section-subtitle">Busca y selecciona el empleado para generar su liquidación</p>
              </div>
            </div>

            <div className="search-container">
              <div className="search-input-container">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="Buscar por nombre o legajo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                {searchTerm && (
                  <div className="search-badge">
                    <Badge className="badge-icon" />
                    <span>{filteredEmployees.length} resultado(s)</span>
                  </div>
                )}
              </div>
            </div>

            <div className="employees-list">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map(employee => (
                  <div key={employee.id} className="employee-card" onClick={() => handleSelectEmployee(employee)}>
                    <div className="employee-card-accent"></div>
                    <div className="employee-info">
                      <div className="employee-main">
                        <div className="employee-avatar">
                          <User className="employee-icon" />
                          <div className="status-dot"></div>
                        </div>
                        <div className="employee-details">
                          <h4 className="employee-name">{employee.name}</h4>
                          <div className="employee-badges">
                            <span className="badge legajo-badge">#{employee.legajo}</span>
                            <span className="badge category-badge">{employee.category}</span>
                            <span className="badge convenio-badge">{employee.convenio}</span>
                          </div>
                          <p className="employee-meta">
                            <Clock className="meta-icon" />
                            Ingreso: {employee.ingressDate}
                          </p>
                        </div>
                      </div>
                      <div className="employee-salary">
                        <span className="salary-label">Sueldo Básico:</span>
                        <span className="salary-amount">${employee.basicSalary.toLocaleString()}</span>
                        <div className="salary-indicator"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-results">
                  <Users className="no-results-icon" />
                  <p>No se encontraron empleados</p>
                  <span className="no-results-hint">Intenta con otro término de búsqueda</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: PAYROLL FORM */}
      {currentStep === 'payroll' && selectedEmployee && (
        <div className="payroll-form">
          <div className="section-header-enhanced">
            <div className="step-indicator">
              <span className="step-number">2</span>
              <Star className="step-star" />
            </div>
            <div className="header-content">
              <h3 className="section-title">Configurar Liquidación</h3>
              <p className="section-subtitle">Ajusta los conceptos y genera el recibo de sueldo</p>
            </div>
          </div>

          <div className="employee-header">
            <div className="employee-summary">
              <div className="employee-avatar-small">
                <User className="avatar-icon" />
                <div className="status-dot-small"></div>
              </div>
              <div className="summary-details">
                <h4>{selectedEmployee.name}</h4>
                <div className="summary-badges">
                  <span className="badge">#{selectedEmployee.legajo}</span>
                  <span className="badge">{selectedEmployee.category}</span>
                  <span className="badge">{selectedEmployee.convenio}</span>
                </div>
              </div>
            </div>
            <div className="period-info">
              <Calendar className="period-icon" />
              <div className="period-details">
                <span className="period-text">{payrollData.periodDisplay}</span>
                <span className="period-status">En proceso</span>
              </div>
            </div>
          </div>

          <div className="concepts-section">
            <div className="section-header">
              <div className="header-left">
                <h3>Conceptos de Liquidación</h3>
                <div className="concepts-counter">
                  <Badge className="counter-icon" />
                  <span>{concepts.length} conceptos</span>
                </div>
              </div>
              <button className="btn btn-secondary btn-sm enhanced-btn" onClick={addManualConcept}>
                <Plus className="h-4 w-4 mr-1" />
                Agregar Concepto
                <div className="btn-accent"></div>
              </button>
            </div>

            <div className="concepts-table">
              <div className="table-header">
                <span>Código</span>
                <span>Concepto</span>
                <span>Unidades</span>
                <span>Remuneraciones</span>
                <span>Descuentos</span>
                <span>Acciones</span>
              </div>

              {concepts.map(concept => (
                <div key={concept.id} className="concept-row">
                  <div className="concept-cell">
                    {concept.isManual ? (
                      <input
                        type="text"
                        value={concept.code}
                        onChange={(e) => updateConcept(concept.id, 'code', e.target.value)}
                        className="concept-input small"
                        placeholder="Cód"
                      />
                    ) : (
                      <span>{concept.code}</span>
                    )}
                  </div>

                  <div className="concept-cell">
                    {concept.isManual ? (
                      <input
                        type="text"
                        value={concept.name}
                        onChange={(e) => updateConcept(concept.id, 'name', e.target.value)}
                        className="concept-input"
                        placeholder="Nombre del concepto"
                      />
                    ) : (
                      <span>{concept.name}</span>
                    )}
                  </div>

                  <div className="concept-cell">
                    <input
                      type="number"
                      value={concept.units}
                      onChange={(e) => updateConcept(concept.id, 'units', parseFloat(e.target.value) || 0)}
                      className="concept-input small"
                      step="0.1"
                    />
                  </div>

                  <div className="concept-cell">
                    {concept.type === 'remuneration' && (
                      <span className="amount positive">
                        ${Math.abs(concept.amount || 0).toLocaleString()}
                      </span>
                    )}
                  </div>

                  <div className="concept-cell">
                    {concept.type === 'deduction' && (
                      <span className="amount negative">
                        ${Math.abs(concept.amount || 0).toLocaleString()}
                      </span>
                    )}
                  </div>

                  <div className="concept-cell">
                    <div className="concept-actions">
                      {concept.isManual && (
                        <>
                          <select
                            value={concept.type}
                            onChange={(e) => updateConcept(concept.id, 'type', e.target.value)}
                            className="type-select"
                          >
                            <option value="remuneration">Remuneración</option>
                            <option value="deduction">Descuento</option>
                          </select>
                          <button
                            className="remove-btn"
                            onClick={() => removeConcept(concept.id)}
                            title="Eliminar concepto"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="totals-summary">
              <div className="total-item">
                <span>Total Remuneraciones:</span>
                <span className="amount positive">${remunerations.toLocaleString()}</span>
              </div>
              <div className="total-item">
                <span>Total Descuentos:</span>
                <span className="amount negative">${deductions.toLocaleString()}</span>
              </div>
              <div className="total-item final">
                <span>NETO A COBRAR:</span>
                <span className="amount final">${netAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: RECEIPT PREVIEW */}
      {currentStep === 'preview' && selectedEmployee && (
        <div className="receipt-preview">
          <div className="section-header-enhanced">
            <div className="step-indicator">
              <span className="step-number">3</span>
              <Star className="step-star" />
            </div>
            <div className="header-content">
              <h3 className="section-title">Vista Previa del Recibo</h3>
              <p className="section-subtitle">Revisa y confirma la liquidación antes de imprimir</p>
            </div>
          </div>

          <div className="receipt-container">
            <div className="receipt-stamp">
              <CheckCircle className="stamp-icon" />
              <span>RECIBO GENERADO</span>
            </div>

            <div className="receipt-header">
              <div className="company-info">
                <div className="company-logo">
                  <div className="logo-circle">
                    <span>C</span>
                  </div>
                </div>
                <div className="company-details">
                  <h3>COOP.SERV.PUB.25 DE MAYO LTDA.</h3>
                  <p>Domicilio: RAMIREZ 367 - CUIT: 30-54569238-0</p>
                  <div className="company-accent"></div>
                </div>
              </div>
            </div>

            <div className="receipt-employee-info">
              <div className="employee-data">
                <div className="data-row">
                  <span className="label">APELLIDO Y NOMBRE:</span>
                  <span className="value">{selectedEmployee.name}</span>
                </div>
                <div className="data-row">
                  <span className="label">PERÍODO DE PAGO:</span>
                  <span className="value">{payrollData.periodDisplay}</span>
                </div>
              </div>
              <div className="employee-meta">
                <div className="meta-item">
                  <span className="label">SECCIÓN:</span>
                  <span className="value">{selectedEmployee.section}</span>
                </div>
                <div className="meta-item">
                  <span className="label">LEGAJO:</span>
                  <span className="value">{selectedEmployee.legajo}</span>
                </div>
                <div className="meta-item">
                  <span className="label">CATEGORÍA:</span>
                  <span className="value">{selectedEmployee.category}</span>
                </div>
              </div>
            </div>

            <div className="receipt-concepts">
              <div className="concepts-header">
                <span>CONCEPTO</span>
                <span>UNIDADES</span>
                <span>REMUNERACIONES</span>
                <span>DESCUENTOS</span>
              </div>

              {concepts.map(concept => (
                <div key={concept.id} className="concept-line">
                  <span className="concept-code">{concept.code}</span>
                  <span className="concept-name">{concept.name}</span>
                  <span className="concept-units">{concept.units}</span>
                  <span className="concept-remuneration">
                    {concept.type === 'remuneration' && concept.amount > 0 ? concept.amount.toLocaleString() : ''}
                  </span>
                  <span className="concept-deduction">
                    {concept.type === 'deduction' && concept.amount < 0 ? Math.abs(concept.amount).toLocaleString() : ''}
                  </span>
                </div>
              ))}
            </div>

            <div className="receipt-totals">
              <div className="total-breakdown">
                <div className="breakdown-line">
                  <span>Total Remuneraciones:</span>
                  <span className="amount-positive">+${remunerations.toLocaleString()}</span>
                </div>
                <div className="breakdown-line">
                  <span>Total Descuentos:</span>
                  <span className="amount-negative">-${deductions.toLocaleString()}</span>
                </div>
              </div>
              <div className="total-line">
                <span>TOTAL NETO:</span>
                <span className="final-amount">${netAmount.toLocaleString()}</span>
                <div className="amount-indicator"></div>
              </div>
            </div>

            <div className="receipt-footer">
              <div className="payment-info">
                <span>LUGAR Y FECHA DE PAGO: HASENKAMP - {new Date().toLocaleDateString('es-ES')}</span>
              </div>
              <div className="amount-words">
                <span>SON PESOS: {netAmount.toLocaleString()} * * * *</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <ModalFooter>
        {currentStep === 'search' && (
          <button className="btn btn-secondary" onClick={resetModal}>
            Cancelar
          </button>
        )}

        {currentStep === 'payroll' && (
          <>
            <button className="btn btn-secondary" onClick={() => setCurrentStep('search')}>
              Volver
            </button>
            <button className="btn btn-primary" onClick={generatePayroll}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Generar Recibo
            </button>
          </>
        )}

        {currentStep === 'preview' && (
          <>
            <button className="btn btn-secondary" onClick={() => setCurrentStep('payroll')}>
              Editar
            </button>
            <button className="btn btn-success" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </button>
            <button className="btn btn-primary" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Descargar
            </button>
          </>
        )}
      </ModalFooter>
    </Modal>
  );
}