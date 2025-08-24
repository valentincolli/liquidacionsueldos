import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Download, Save, X, Printer, Calendar, Users, FileText, Plus, Trash2 } from 'lucide-react';
import './ConvenioDetail.scss';

// Mock data que coincide con los convenios existentes
const conveniosDetailData = {
  1: { // Luz y Fuerza
    id: 1,
    name: 'Luz y Fuerza',
    sector: 'Energía Eléctrica',
    status: 'Activo',
    employeeCount: 45,
    validFrom: '2024-01-01',
    validTo: '2024-12-31',
    lastUpdate: '2024-01-15',
    salaryTable: {
      categories: [
        { cat: 1, basicSalary: 523690.91, office: null, technical: null, administrative: null, operations: 15594.96, hierarchical: null, functional: null },
        { cat: 2, basicSalary: 525941.39, office: null, technical: null, administrative: null, operations: null, hierarchical: null, functional: null },
        { cat: 3, basicSalary: 527193.15, office: 33789.39, technical: null, administrative: 21659.66, operations: 21659.66, hierarchical: null, functional: null },
        { cat: 4, basicSalary: 528799.40, office: 33789.39, technical: null, administrative: 21659.66, operations: 21659.66, hierarchical: null, functional: null },
        { cat: 5, basicSalary: 530655.70, office: 45051.87, technical: null, administrative: 31190.30, operations: 31190.30, hierarchical: 56315.39, functional: null },
        { cat: 6, basicSalary: 532051.90, office: 56316.25, technical: 67578.72, administrative: 45052.43, operations: 31190.30, hierarchical: 56315.39, functional: null },
        { cat: 7, basicSalary: 533832.50, office: 67578.72, technical: 67578.72, administrative: 45052.43, operations: 45052.43, hierarchical: 67578.72, functional: null },
        { cat: 8, basicSalary: 535667.49, office: 67578.72, technical: 78841.24, administrative: 56315.39, operations: 45052.43, hierarchical: 90104.61, functional: null },
        { cat: 9, basicSalary: 537570.42, office: 78841.24, technical: 78841.24, administrative: 56315.39, operations: 56315.39, hierarchical: 105399.32, functional: null },
        { cat: 10, basicSalary: 539377.43, office: 78841.24, technical: 90105.59, administrative: 67578.72, operations: 56315.39, hierarchical: 123893.36, functional: null },
        { cat: 11, basicSalary: 541495.34, office: 90105.59, technical: 90105.85, administrative: 67578.72, operations: 67578.72, hierarchical: 140788.55, functional: null },
        { cat: 12, basicSalary: 548419.07, office: 105349.04, technical: 105349.04, administrative: 86530.95, operations: 86530.95, hierarchical: 159957.33, functional: null },
        { cat: 13, basicSalary: 565238.81, office: 116745.49, technical: 142304.77, administrative: 105337.24, operations: 105337.24, hierarchical: 181725.32, functional: 257761.22 },
        { cat: 14, basicSalary: 589881.78, office: 154543.43, technical: 197482.74, administrative: 142304.74, operations: 142304.74, hierarchical: 206471.43, functional: 324144.66 },
        { cat: 15, basicSalary: 619489.66, office: 192231.26, technical: 252878.74, administrative: 178693.18, operations: 178693.18, hierarchical: 231976.20, functional: 380779.49 },
        { cat: 16, basicSalary: 644004.91, office: null, technical: null, administrative: null, operations: null, hierarchical: 257534.65, functional: 470359.38 },
        { cat: 17, basicSalary: 674361.79, office: null, technical: null, administrative: null, operations: null, hierarchical: 283059.24, functional: 590614.22 },
        { cat: 18, basicSalary: 699834.13, office: null, technical: null, administrative: null, operations: null, hierarchical: 308651.81, functional: 698313.52 }
      ],
      bonifications: {
        antiguedad: 14901.57,
        sumaFija: 216597.21,
        guarderia: 98984.98,
        quebrantoCaja: 37904.39,
        bonificacionChofer: 10829.55,
        gastoRepVent: 27074.80,
        gastoRepFLocal: 37904.39,
        gastosComida: 10829.55,
        refrigerio: 32490.35,
        gas: 42941.23,
        usoBicicleta: 32490.35,
        movilidad: 27074.80
      },
      titles: {
        incAp: {
          A: 412394.87,
          B: 288693.01,
          C: 206171.37,
          D: 80244.71
        },
        inc2Ap: {
          A: 110681.91,
          B: 80244.71
        },
        inc3Ap: {
          A: 110681.91,
          B: 80244.71
        },
        inc4Ap: {
          A: 62067.70
        },
        inc5Ap: {
          A: 80244.71,
          B: 46335.00
        },
        inc6Ap: {
          A: 64075.97,
          B: 46335.00
        },
        inc7Ap: {
          A: 21918.28,
          B: 32227.05
        }
      }
    }
  },
  2: { // UOCRA
    id: 2,
    name: 'UOCRA',
    sector: 'Construcción',
    status: 'Activo',
    employeeCount: 79,
    validFrom: '2024-01-01',
    validTo: '2024-12-31',
    lastUpdate: '2024-02-01',
    salaryTable: {
      categories: [
        { cat: 'Oficial Especializado', basicSalary: 4846, zone: 533, total: 5379, may25: { basicSalary: 4846, additional: 2593, total: 7439 }, zonaC: { basicSalary: 4846, additional: 4846, total: 9691 } },
        { cat: 'Oficial', basicSalary: 4143, zone: 458, total: 4604, may25: { basicSalary: 4143, additional: 2929, total: 6975 }, zonaC: { basicSalary: 4143, additional: 4143, total: 8291 } },
        { cat: 'Medio Oficial', basicSalary: 3831, zone: 416, total: 4246, may25: { basicSalary: 3831, additional: 2900, total: 6731 }, zonaC: { basicSalary: 3831, additional: 3831, total: 7661 } },
        { cat: 'Ayudante', basicSalary: 3520, zone: 408, total: 3931, may25: { basicSalary: 3520, additional: 2500, total: 6635 }, zonaC: { basicSalary: 3520, additional: 3520, total: 7052 } },
        { cat: 'Sereno', basicSalary: 640543, zone: 73050, total: 713593, may25: { basicSalary: 640543, additional: 430300, total: 1070849 }, zonaC: { basicSalary: 640543, additional: 640543, total: 1281089 } }
      ],
      notes: [
        'Mas: Suma no remunerativa mensual liquidada quincenalmente',
        'Ayudante - Zona "A" $33,000; Zona "B" $ 36,600; Zona "C" $ 61,200; Zona "C-Austral" $66,000',
        'Medio Oficial - Zona "A" $34,000; Zona "B" $ 37,700; Zona "C" $ 63,000; Zona "C-Austral" $68,000',
        'Oficial - Zona "A" $35,000; Zona "B" $ 42,200; Zona "C" $ 70,400; Zona "C-Austral" $76,000',
        'Oficial Espec - Zona "A" $40,000; Zona "B" $ 44,900; Zona "C" $ 74,100; Zona "C-Austral" $80,000'
      ],
      junio2025: {
        categories: [
          { cat: 'Oficial Especializado', basicSalary: 4894, zone: 538, total: 5433, basicSalary2: 4894, additional: 2615, total2: 7514, zonaCAdditional: 4894, totalZonaC: 9788 },
          { cat: 'Oficial', basicSalary: 4187, zone: 463, total: 4650, basicSalary2: 4187, additional: 2956, total2: 7043, zonaCAdditional: 4187, totalZonaC: 8374 },
          { cat: 'Medio Oficial', basicSalary: 3869, zone: 420, total: 4285, basicSalary2: 3869, additional: 2925, total2: 6758, zonaCAdditional: 3869, totalZonaC: 7738 },
          { cat: 'Ayudante', basicSalary: 3561, zone: 410, total: 3971, basicSalary2: 3561, additional: 2520, total2: 6650, zonaCAdditional: 3561, totalZonaC: 7122 },
          { cat: 'Sereno', basicSalary: 646545, zone: 73701, total: 720773, basicSalary2: 646545, additional: 434600, total2: 1080535, zonaCAdditional: 646545, totalZonaC: 1293897 }
        ]
      }
    }
  }
};

export default function ConvenioDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [convenio, setConvenio] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableData, setEditableData] = useState(null);
  const [isEditingBonifications, setIsEditingBonifications] = useState(false);
  const [isEditingTitles, setIsEditingTitles] = useState(false);

  useEffect(() => {
    const convenioData = conveniosDetailData[parseInt(id)];
    if (convenioData) {
      setConvenio(convenioData);
      setEditableData(JSON.parse(JSON.stringify(convenioData)));
    }
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setConvenio(editableData);
    setIsEditing(false);
    if (window.showNotification) {
      window.showNotification('Convenio actualizado exitosamente', 'success');
    }
  };

  const handleCancel = () => {
    setEditableData(JSON.parse(JSON.stringify(convenio)));
    setIsEditing(false);
  };

  const handleDownload = () => {
    window.print();
  };

  const handleGoBack = () => {
    navigate('/convenios');
  };

  const updateSalaryValue = (catIndex, field, value) => {
    const newData = { ...editableData };
    // Usar parseFloat solo para valores numéricos, mantener strings para texto
    const numericValue = parseFloat(value.replace(/[^0-9.,]/g, '').replace(',', ''));
    newData.salaryTable.categories[catIndex][field] = isNaN(numericValue) ? 0 : numericValue;
    setEditableData(newData);
  };

  const addBonification = () => {
    const newKey = `nuevaBonificacion${Date.now()}`;
    const newData = { ...editableData };
    newData.salaryTable.bonifications[newKey] = 0;
    setEditableData(newData);
  };

  const removeBonification = (key) => {
    const newData = { ...editableData };
    delete newData.salaryTable.bonifications[key];
    setEditableData(newData);
  };

  const updateBonificationValue = (key, value) => {
    const newData = { ...editableData };
    const numericValue = parseFloat(value.replace(/[^0-9.,]/g, '').replace(',', ''));
    newData.salaryTable.bonifications[key] = isNaN(numericValue) ? 0 : numericValue;
    setEditableData(newData);
  };

  const addTitle = () => {
    const newKey = `nuevoTitulo${Date.now()}`;
    const newData = { ...editableData };
    newData.salaryTable.titles[newKey] = { A: 0 };
    setEditableData(newData);
  };

  const removeTitle = (key) => {
    const newData = { ...editableData };
    delete newData.salaryTable.titles[key];
    setEditableData(newData);
  };

  const addTitleLevel = (titleKey) => {
    const newData = { ...editableData };
    const existingLevels = Object.keys(newData.salaryTable.titles[titleKey]);
    const nextLevel = String.fromCharCode(65 + existingLevels.length); // A, B, C, D...
    if (nextLevel <= 'Z') {
      newData.salaryTable.titles[titleKey][nextLevel] = 0;
      setEditableData(newData);
    }
  };

  const removeTitleLevel = (titleKey, level) => {
    const newData = { ...editableData };
    delete newData.salaryTable.titles[titleKey][level];
    setEditableData(newData);
  };

  const updateTitleValue = (titleKey, level, value) => {
    const newData = { ...editableData };
    const numericValue = parseFloat(value.replace(/[^0-9.,]/g, '').replace(',', ''));
    newData.salaryTable.titles[titleKey][level] = isNaN(numericValue) ? 0 : numericValue;
    setEditableData(newData);
  };

  const updateUOCRAValue = (catIndex, field, value) => {
    const newData = { ...editableData };
    const numericValue = parseFloat(value.replace(/[^0-9.,]/g, '').replace(',', ''));

    if (field.startsWith('junio2025.')) {
      // Handle Junio 2025 fields
      const junioField = field.replace('junio2025.', '');
      if (!newData.salaryTable.junio2025) {
        newData.salaryTable.junio2025 = { categories: [...newData.salaryTable.categories] };
      }
      if (!newData.salaryTable.junio2025.categories[catIndex]) {
        newData.salaryTable.junio2025.categories[catIndex] = { ...newData.salaryTable.categories[catIndex] };
      }
      newData.salaryTable.junio2025.categories[catIndex][junioField] = isNaN(numericValue) ? 0 : numericValue;
    } else if (field.includes('.')) {
      // Handle nested fields like may25.basicSalary, zonaC.additional
      const [parentField, childField] = field.split('.');
      if (!newData.salaryTable.categories[catIndex][parentField]) {
        newData.salaryTable.categories[catIndex][parentField] = {};
      }
      newData.salaryTable.categories[catIndex][parentField][childField] = isNaN(numericValue) ? 0 : numericValue;
    } else {
      // Handle direct fields
      newData.salaryTable.categories[catIndex][field] = isNaN(numericValue) ? 0 : numericValue;
    }

    setEditableData(newData);
  };

  if (!convenio) {
    return (
      <div className="convenio-detail">
        <div className="loading">Cargando convenio...</div>
      </div>
    );
  }

  const currentData = isEditing ? editableData : convenio;

  return (
    <div className="convenio-detail">
      {/* Header */}
      <div className="detail-header">
        <div className="header-navigation">
          <button className="back-btn" onClick={handleGoBack}>
            <ArrowLeft className="back-icon" />
            Volver a Convenios
          </button>
        </div>
        
        <div className="header-content">
          <div className="header-info">
            <h1 className="detail-title">{currentData.name}</h1>
            <div className="header-meta">
              <div className="meta-item">
                <Users className="meta-icon" />
                <span>{currentData.employeeCount} empleados</span>
              </div>
              <div className="meta-item">
                <Calendar className="meta-icon" />
                <span>Vigente hasta {new Date(currentData.validTo).toLocaleDateString('es-ES')}</span>
              </div>
              <div className={`status-badge ${currentData.status.toLowerCase()}`}>
                {currentData.status}
              </div>
            </div>
          </div>
          
          <div className="header-actions">
            {isEditing ? (
              <>
                <button className="action-btn save" onClick={handleSave}>
                  <Save className="action-icon" />
                  Guardar
                </button>
                <button className="action-btn cancel" onClick={handleCancel}>
                  <X className="action-icon" />
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <button className="action-btn edit" onClick={handleEdit}>
                  <Edit className="action-icon" />
                  Editar
                </button>
                <button className="action-btn download" onClick={handleDownload}>
                  <Download className="action-icon" />
                  Descargar
                </button>
                <button className="action-btn print" onClick={handleDownload}>
                  <Printer className="action-icon" />
                  Imprimir
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Salary Table */}
      <div className="salary-table-container">
        {currentData.name === 'Luz y Fuerza' ? (
          // Tabla formato Luz y Fuerza
          <div className="salary-table luz-y-fuerza">
            <div className="table-header">
              <h2>ESCALAS SALARIALES - LUZ Y FUERZA</h2>
              <p>Vigencia: {new Date(currentData.validFrom).toLocaleDateString('es-ES')} - {new Date(currentData.validTo).toLocaleDateString('es-ES')}</p>
            </div>
            
            <table className="salary-grid">
              <thead>
                <tr>
                  <th rowSpan="2">CAT</th>
                  <th rowSpan="2">SUELDO BÁSICO</th>
                  <th colSpan="5">BONIFICACIONES</th>
                </tr>
                <tr>
                  <th>OFICIO</th>
                  <th>TÉCNICA</th>
                  <th>ADMINISTRATIVA</th>
                  <th>OPERACIONES</th>
                  <th>JERÁRQUICA</th>
                  <th>FUNCIONAL</th>
                </tr>
              </thead>
              <tbody>
                {currentData.salaryTable.categories.map((category, index) => (
                  <tr key={index}>
                    <td className="category-cell">{category.cat}</td>
                    <td className="salary-cell">
                      {isEditing ? (
                        <input
                          type="text"
                          value={`$${category.basicSalary.toLocaleString()}`}
                          onChange={(e) => updateSalaryValue(index, 'basicSalary', e.target.value)}
                          className="salary-input"
                        />
                      ) : (
                        `$${category.basicSalary.toLocaleString()}`
                      )}
                    </td>
                    <td className="bonus-cell">
                      {category.office ? (
                        isEditing ? (
                          <input
                            type="text"
                            value={`$${category.office.toLocaleString()}`}
                            onChange={(e) => updateSalaryValue(index, 'office', e.target.value)}
                            className="bonus-input"
                          />
                        ) : (
                          `$${category.office.toLocaleString()}`
                        )
                      ) : ''}
                    </td>
                    <td className="bonus-cell">
                      {category.technical ? (
                        isEditing ? (
                          <input
                            type="number"
                            value={category.technical}
                            onChange={(e) => updateSalaryValue(index, 'technical', e.target.value)}
                            className="bonus-input"
                          />
                        ) : (
                          `$${category.technical.toLocaleString()}`
                        )
                      ) : ''}
                    </td>
                    <td className="bonus-cell">
                      {category.administrative ? (
                        isEditing ? (
                          <input
                            type="number"
                            value={category.administrative}
                            onChange={(e) => updateSalaryValue(index, 'administrative', e.target.value)}
                            className="bonus-input"
                          />
                        ) : (
                          `$${category.administrative.toLocaleString()}`
                        )
                      ) : ''}
                    </td>
                    <td className="bonus-cell">
                      {category.operations ? (
                        isEditing ? (
                          <input
                            type="number"
                            value={category.operations}
                            onChange={(e) => updateSalaryValue(index, 'operations', e.target.value)}
                            className="bonus-input"
                          />
                        ) : (
                          `$${category.operations.toLocaleString()}`
                        )
                      ) : ''}
                    </td>
                    <td className="bonus-cell">
                      {category.hierarchical ? (
                        isEditing ? (
                          <input
                            type="number"
                            value={category.hierarchical}
                            onChange={(e) => updateSalaryValue(index, 'hierarchical', e.target.value)}
                            className="bonus-input"
                          />
                        ) : (
                          `$${category.hierarchical.toLocaleString()}`
                        )
                      ) : ''}
                    </td>
                    <td className="bonus-cell">
                      {category.functional ? (
                        isEditing ? (
                          <input
                            type="text"
                            value={`$${category.functional.toLocaleString()}`}
                            onChange={(e) => updateSalaryValue(index, 'functional', e.target.value)}
                            className="bonus-input"
                          />
                        ) : (
                          `$${category.functional.toLocaleString()}`
                        )
                      ) : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Additional bonifications section */}
            <div className="additional-bonifications">
              <div className="bonif-section">
                <div className="section-header">
                  <h3>BONIFICACIONES ADICIONALES</h3>
                  {currentData.name === 'Luz y Fuerza' && (
                    <div className="section-actions">
                      <button
                        className="action-btn edit-small"
                        onClick={() => setIsEditingBonifications(!isEditingBonifications)}
                      >
                        <Edit className="action-icon-small" />
                        {isEditingBonifications ? 'Listo' : 'Editar'}
                      </button>
                      {isEditingBonifications && (
                        <button className="action-btn add-small" onClick={addBonification}>
                          <Plus className="action-icon-small" />
                          Agregar
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <div className="bonif-grid">
                  {Object.entries(currentData.salaryTable.bonifications).map(([key, value]) => (
                    <div key={key} className="bonif-item">
                      <span className="bonif-label">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </span>
                      {isEditingBonifications ? (
                        <div className="bonif-edit-group">
                          <input
                            type="text"
                            value={`$${value.toLocaleString()}`}
                            onChange={(e) => updateBonificationValue(key, e.target.value)}
                            className="bonif-input"
                          />
                          <button
                            className="remove-btn"
                            onClick={() => removeBonification(key)}
                            title="Eliminar bonificación"
                          >
                            <Trash2 className="remove-icon" />
                          </button>
                        </div>
                      ) : (
                        <span className="bonif-value">${value.toLocaleString()}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="titles-section">
                <div className="section-header">
                  <h3>TÍTULOS</h3>
                  {currentData.name === 'Luz y Fuerza' && (
                    <div className="section-actions">
                      <button
                        className="action-btn edit-small"
                        onClick={() => setIsEditingTitles(!isEditingTitles)}
                      >
                        <Edit className="action-icon-small" />
                        {isEditingTitles ? 'Listo' : 'Editar'}
                      </button>
                      {isEditingTitles && (
                        <button className="action-btn add-small" onClick={addTitle}>
                          <Plus className="action-icon-small" />
                          Agregar Título
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <div className="titles-grid">
                  {Object.entries(currentData.salaryTable.titles).map(([key, values]) => (
                    <div key={key} className="title-group">
                      <div className="title-header">
                        <span className="title-name">{key.toUpperCase()}</span>
                        {isEditingTitles && (
                          <div className="title-actions">
                            <button
                              className="add-level-btn"
                              onClick={() => addTitleLevel(key)}
                              title="Agregar nivel"
                            >
                              <Plus className="add-icon" />
                            </button>
                            <button
                              className="remove-btn"
                              onClick={() => removeTitle(key)}
                              title="Eliminar título"
                            >
                              <Trash2 className="remove-icon" />
                            </button>
                          </div>
                        )}
                      </div>
                      {Object.entries(values).map(([letter, amount]) => (
                        <div key={letter} className="title-item">
                          <span className="title-letter">{letter}</span>
                          {isEditingTitles ? (
                            <div className="title-edit-group">
                              <input
                                type="text"
                                value={`$${amount.toLocaleString()}`}
                                onChange={(e) => updateTitleValue(key, letter, e.target.value)}
                                className="title-input"
                              />
                              <button
                                className="remove-level-btn"
                                onClick={() => removeTitleLevel(key, letter)}
                                title="Eliminar nivel"
                              >
                                <X className="remove-icon-small" />
                              </button>
                            </div>
                          ) : (
                            <span className="title-amount">${amount.toLocaleString()}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Tabla formato UOCRA con estilo Luz y Fuerza
          <div className="salary-table luz-y-fuerza">
            <div className="table-header">
              <h2>UOCRA - JORNALES DE SALARIOS BÁSICOS CON VIGENCIA A PARTIR DEL 01 DE MAYO 2025</h2>
            </div>

            <table className="salary-grid">
              <thead>
                <tr>
                  <th rowSpan="2">Mes</th>
                  <th rowSpan="2">Categoria</th>
                  <th colSpan="3">ZONA "A"</th>
                  <th colSpan="3">ZONA "B"</th>
                  <th colSpan="3">ZONA "C"</th>
                  <th colSpan="3">ZONA "C-Austral"</th>
                </tr>
                <tr>
                  <th>Salario Básico</th>
                  <th>Adicional Zona</th>
                  <th>Total</th>
                  <th>Salario Básico</th>
                  <th>Adicional Zona</th>
                  <th>Total</th>
                  <th>Salario Básico</th>
                  <th>Adicional Zona</th>
                  <th>Total</th>
                  <th>Salario Básico</th>
                  <th>Adicional Zona</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {currentData.salaryTable.categories.map((category, index) => (
                  <tr key={index}>
                    <td className="month-cell">{index === 0 ? 'may-25' : ''}</td>
                    <td className="category-cell">{category.cat}</td>
                    <td className="salary-cell">
                      {isEditing ? (
                        <input
                          type="text"
                          value={`$${typeof category.basicSalary === 'number' ? category.basicSalary.toLocaleString() : category.basicSalary}`}
                          onChange={(e) => updateUOCRAValue(index, 'basicSalary', e.target.value)}
                          className="salary-input"
                        />
                      ) : (
                        `$${typeof category.basicSalary === 'number' ? category.basicSalary.toLocaleString() : category.basicSalary}`
                      )}
                    </td>
                    <td className="zone-cell">
                      {isEditing ? (
                        <input
                          type="text"
                          value={`$${typeof category.zone === 'number' ? category.zone.toLocaleString() : category.zone}`}
                          onChange={(e) => updateUOCRAValue(index, 'zone', e.target.value)}
                          className="bonus-input"
                        />
                      ) : (
                        `$${typeof category.zone === 'number' ? category.zone.toLocaleString() : category.zone}`
                      )}
                    </td>
                    <td className="total-cell">
                      {isEditing ? (
                        <input
                          type="text"
                          value={`$${typeof category.total === 'number' ? category.total.toLocaleString() : category.total}`}
                          onChange={(e) => updateUOCRAValue(index, 'total', e.target.value)}
                          className="bonus-input"
                        />
                      ) : (
                        `$${typeof category.total === 'number' ? category.total.toLocaleString() : category.total}`
                      )}
                    </td>
                    <td className="salary-cell">
                      {isEditing ? (
                        <input
                          type="text"
                          value={`$${typeof (category.may25?.basicSalary || category.basicSalary) === 'number' ? (category.may25?.basicSalary || category.basicSalary).toLocaleString() : (category.may25?.basicSalary || category.basicSalary)}`}
                          onChange={(e) => updateUOCRAValue(index, 'may25.basicSalary', e.target.value)}
                          className="salary-input"
                        />
                      ) : (
                        `$${typeof (category.may25?.basicSalary || category.basicSalary) === 'number' ? (category.may25?.basicSalary || category.basicSalary).toLocaleString() : (category.may25?.basicSalary || category.basicSalary)}`
                      )}
                    </td>
                    <td className="zone-cell">
                      {isEditing ? (
                        <input
                          type="text"
                          value={`$${typeof (category.may25?.additional || category.zone) === 'number' ? (category.may25?.additional || category.zone).toLocaleString() : (category.may25?.additional || category.zone)}`}
                          onChange={(e) => updateUOCRAValue(index, 'may25.additional', e.target.value)}
                          className="bonus-input"
                        />
                      ) : (
                        `$${typeof (category.may25?.additional || category.zone) === 'number' ? (category.may25?.additional || category.zone).toLocaleString() : (category.may25?.additional || category.zone)}`
                      )}
                    </td>
                    <td className="total-cell">
                      {isEditing ? (
                        <input
                          type="text"
                          value={`$${typeof (category.may25?.total || category.total) === 'number' ? (category.may25?.total || category.total).toLocaleString() : (category.may25?.total || category.total)}`}
                          onChange={(e) => updateUOCRAValue(index, 'may25.total', e.target.value)}
                          className="bonus-input"
                        />
                      ) : (
                        `$${typeof (category.may25?.total || category.total) === 'number' ? (category.may25?.total || category.total).toLocaleString() : (category.may25?.total || category.total)}`
                      )}
                    </td>
                    <td className="salary-cell">
                      {isEditing ? (
                        <input
                          type="text"
                          value={`$${typeof (category.zonaC?.basicSalary || category.basicSalary) === 'number' ? (category.zonaC?.basicSalary || category.basicSalary).toLocaleString() : (category.zonaC?.basicSalary || category.basicSalary)}`}
                          onChange={(e) => updateUOCRAValue(index, 'zonaC.basicSalary', e.target.value)}
                          className="salary-input"
                        />
                      ) : (
                        `$${typeof (category.zonaC?.basicSalary || category.basicSalary) === 'number' ? (category.zonaC?.basicSalary || category.basicSalary).toLocaleString() : (category.zonaC?.basicSalary || category.basicSalary)}`
                      )}
                    </td>
                    <td className="zone-cell">
                      {isEditing ? (
                        <input
                          type="text"
                          value={`$${typeof (category.zonaC?.additional || category.zone) === 'number' ? (category.zonaC?.additional || category.zone).toLocaleString() : (category.zonaC?.additional || category.zone)}`}
                          onChange={(e) => updateUOCRAValue(index, 'zonaC.additional', e.target.value)}
                          className="bonus-input"
                        />
                      ) : (
                        `$${typeof (category.zonaC?.additional || category.zone) === 'number' ? (category.zonaC?.additional || category.zone).toLocaleString() : (category.zonaC?.additional || category.zone)}`
                      )}
                    </td>
                    <td className="total-cell">
                      {isEditing ? (
                        <input
                          type="text"
                          value={`$${typeof (category.zonaC?.total || category.total) === 'number' ? (category.zonaC?.total || category.total).toLocaleString() : (category.zonaC?.total || category.total)}`}
                          onChange={(e) => updateUOCRAValue(index, 'zonaC.total', e.target.value)}
                          className="bonus-input"
                        />
                      ) : (
                        `$${typeof (category.zonaC?.total || category.total) === 'number' ? (category.zonaC?.total || category.total).toLocaleString() : (category.zonaC?.total || category.total)}`
                      )}
                    </td>
                    <td className="salary-cell">
                      {isEditing ? (
                        <input
                          type="text"
                          value={`$${typeof category.basicSalary === 'number' ? category.basicSalary.toLocaleString() : category.basicSalary}`}
                          onChange={(e) => updateUOCRAValue(index, 'basicSalary', e.target.value)}
                          className="salary-input"
                        />
                      ) : (
                        `$${typeof category.basicSalary === 'number' ? category.basicSalary.toLocaleString() : category.basicSalary}`
                      )}
                    </td>
                    <td className="zone-cell">
                      {isEditing ? (
                        <input
                          type="text"
                          value={`$${typeof category.zone === 'number' ? category.zone.toLocaleString() : category.zone}`}
                          onChange={(e) => updateUOCRAValue(index, 'zone', e.target.value)}
                          className="bonus-input"
                        />
                      ) : (
                        `$${typeof category.zone === 'number' ? category.zone.toLocaleString() : category.zone}`
                      )}
                    </td>
                    <td className="total-cell">
                      {isEditing ? (
                        <input
                          type="text"
                          value={`$${typeof category.total === 'number' ? category.total.toLocaleString() : category.total}`}
                          onChange={(e) => updateUOCRAValue(index, 'total', e.target.value)}
                          className="bonus-input"
                        />
                      ) : (
                        `$${typeof category.total === 'number' ? category.total.toLocaleString() : category.total}`
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="uocra-notes">
              <div className="notes-header">
                <FileText className="notes-icon" />
                <h4>Información Adicional</h4>
              </div>

              <div className="highlight-note">
                <div className="highlight-icon">💰</div>
                <p><strong>Suma no remunerativa mensual liquidada quincenalmente</strong></p>
              </div>

              <div className="notes-content">
                <h5>Escalas por Zona:</h5>
                <div className="notes-grid">
                  {currentData.salaryTable.notes.map((note, index) => (
                    <div key={index} className="note-item">
                      <div className="note-bullet">•</div>
                      <p>{note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Junio 2025 table */}
            {currentData.salaryTable.junio2025 && (
              <div className="junio-2025-section">
                <h3>JORNALES DE SALARIOS BÁSICOS CON VIGENCIA A PARTIR DEL 1 DE JUNIO 2025</h3>
                <table className="salary-grid">
                  <thead>
                    <tr>
                      <th rowSpan="2">Mes</th>
                      <th rowSpan="2">Categoria</th>
                      <th colSpan="3">ZONA "A"</th>
                      <th colSpan="3">ZONA "B"</th>
                      <th colSpan="3">ZONA "C"</th>
                      <th colSpan="3">ZONA "C-Austral"</th>
                    </tr>
                    <tr>
                      <th>Salario Básico</th>
                      <th>Adicional Zona</th>
                      <th>Total</th>
                      <th>Salario Básico</th>
                      <th>Adicional Zona</th>
                      <th>Total</th>
                      <th>Salario Básico</th>
                      <th>Adicional Zona</th>
                      <th>Total</th>
                      <th>Salario Básico</th>
                      <th>Adicional Zona</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.salaryTable.junio2025.categories.map((category, index) => (
                      <tr key={index}>
                        <td className="month-cell">{index === 0 ? 'jun-25' : ''}</td>
                        <td className="category-cell">{category.cat}</td>
                        <td className="salary-cell">
                          {isEditing ? (
                            <input
                              type="text"
                              value={`$${category.basicSalary}`}
                              onChange={(e) => updateUOCRAValue(index, 'junio2025.basicSalary', e.target.value)}
                              className="salary-input"
                            />
                          ) : (
                            `$${category.basicSalary}`
                          )}
                        </td>
                        <td className="zone-cell">
                          {isEditing ? (
                            <input
                              type="text"
                              value={`$${category.zone}`}
                              onChange={(e) => updateUOCRAValue(index, 'junio2025.zone', e.target.value)}
                              className="bonus-input"
                            />
                          ) : (
                            `$${category.zone}`
                          )}
                        </td>
                        <td className="total-cell">
                          {isEditing ? (
                            <input
                              type="text"
                              value={`$${category.total}`}
                              onChange={(e) => updateUOCRAValue(index, 'junio2025.total', e.target.value)}
                              className="bonus-input"
                            />
                          ) : (
                            `$${category.total}`
                          )}
                        </td>
                        <td className="salary-cell">
                          {isEditing ? (
                            <input
                              type="text"
                              value={`$${category.basicSalary2}`}
                              onChange={(e) => updateUOCRAValue(index, 'junio2025.basicSalary2', e.target.value)}
                              className="salary-input"
                            />
                          ) : (
                            `$${category.basicSalary2}`
                          )}
                        </td>
                        <td className="zone-cell">
                          {isEditing ? (
                            <input
                              type="text"
                              value={`$${category.additional}`}
                              onChange={(e) => updateUOCRAValue(index, 'junio2025.additional', e.target.value)}
                              className="bonus-input"
                            />
                          ) : (
                            `$${category.additional}`
                          )}
                        </td>
                        <td className="total-cell">
                          {isEditing ? (
                            <input
                              type="text"
                              value={`$${category.total2}`}
                              onChange={(e) => updateUOCRAValue(index, 'junio2025.total2', e.target.value)}
                              className="bonus-input"
                            />
                          ) : (
                            `$${category.total2}`
                          )}
                        </td>
                        <td className="salary-cell">
                          {isEditing ? (
                            <input
                              type="text"
                              value={`$${category.basicSalary}`}
                              onChange={(e) => updateUOCRAValue(index, 'junio2025.basicSalaryC', e.target.value)}
                              className="salary-input"
                            />
                          ) : (
                            `$${category.basicSalary}`
                          )}
                        </td>
                        <td className="zone-cell">
                          {isEditing ? (
                            <input
                              type="text"
                              value={`$${category.zonaCAdditional}`}
                              onChange={(e) => updateUOCRAValue(index, 'junio2025.zonaCAdditional', e.target.value)}
                              className="bonus-input"
                            />
                          ) : (
                            `$${category.zonaCAdditional}`
                          )}
                        </td>
                        <td className="total-cell">
                          {isEditing ? (
                            <input
                              type="text"
                              value={`$${category.totalZonaC}`}
                              onChange={(e) => updateUOCRAValue(index, 'junio2025.totalZonaC', e.target.value)}
                              className="bonus-input"
                            />
                          ) : (
                            `$${category.totalZonaC}`
                          )}
                        </td>
                        <td className="salary-cell">
                          {isEditing ? (
                            <input
                              type="text"
                              value={`$${category.basicSalary}`}
                              onChange={(e) => updateUOCRAValue(index, 'junio2025.basicSalaryCaustral', e.target.value)}
                              className="salary-input"
                            />
                          ) : (
                            `$${category.basicSalary}`
                          )}
                        </td>
                        <td className="zone-cell">
                          {isEditing ? (
                            <input
                              type="text"
                              value={`$${category.zone}`}
                              onChange={(e) => updateUOCRAValue(index, 'junio2025.zoneCaustral', e.target.value)}
                              className="bonus-input"
                            />
                          ) : (
                            `$${category.zone}`
                          )}
                        </td>
                        <td className="total-cell">
                          {isEditing ? (
                            <input
                              type="text"
                              value={`$${category.total}`}
                              onChange={(e) => updateUOCRAValue(index, 'junio2025.totalCaustral', e.target.value)}
                              className="bonus-input"
                            />
                          ) : (
                            `$${category.total}`
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer info */}
      <div className="detail-footer">
        <div className="footer-info">
          <div className="info-item">
            <FileText className="info-icon" />
            <span>Última actualización: {new Date(currentData.lastUpdate).toLocaleDateString('es-ES')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
