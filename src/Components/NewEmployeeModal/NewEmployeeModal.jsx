import React, { useState, useEffect } from 'react';
import { Modal, ModalFooter } from '../Modal/Modal';
import { User, Building, X, UserPlus } from 'lucide-react';
import * as api from "../../services/empleadosAPI";

export function NewEmployeeModal({ isOpen, onClose, onSave }) {
  const removeArea = (id) => {
    const numId = Number(id);
    setFormData(prev => ({
      ...prev,
      areas: (prev.areas || []).filter(aid => aid !== numId)
    }));
  }
  
  const [formData, setFormData] = useState({
    legajo: '',
    nombre: '',
    apellido: '',
    domicilio: '',
    areas: [],
    inicioActividad: new Date().toISOString().split('T')[0], // Fecha actual
    estado: 'Activo',
    gremio: '',
    categoria: '',
    idCategoria: '',
    banco: '',
    cuil: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [areas, setAreas] = useState([]);
  const [selectedAreaToAdd, setSelectedAreaToAdd] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [categoriaNoEncontrada, setCategoriaNoEncontrada] = useState(false);
  const selectedSet = new Set((formData.areas || []).map(Number));
  const availableAreas = areas.filter(a => !selectedSet.has(a.id));

  // Carga las áreas al montar el componente
  useEffect(() => {
    const loadAreas = async () => {
      try {
        const data = await api.getAreas();
        // Normaliza a números SIEMPRE
        const normalized = (data || []).map(a => {
        const id = Number(a.id ?? a.idArea ?? a.areaId);
        return { id, nombre: a.nombre ?? a.name ?? a.descripcion ?? `Área ${id}` };
        }).filter(a => Number.isFinite(a.id));
        setAreas(normalized);
      } catch (err) {
        console.error("Error loading areas:", err);
      }
    };
    loadAreas();
  }, []);

  // Carga las categorías al montar el componente
  useEffect(() => {
      const loadCategorias = async () => {
        try {
          const data = await api.getCategorias(); // hace el fetch con axios
          setCategorias(data); // guarda las categorías en el estado
        } catch (err) {
          console.error("Error loading categories:", err);
        }
      };
      loadCategorias();
    }, []);

  // Actualiza el salario base cuando cambia la categoría seleccionada
  useEffect(() => {
    if (!categorias.length) return;

    // preferimos el id si ya está (por ej. usuario seleccionó algo)
    if (formData.idCategoria) {
      const cat = findCategoriaById(formData.idCategoria);
      if (cat) {
        const basico = getCatBasico(cat);
        setFormData(prev => 
          prev.salary === basico && prev.categoria === getCatNombre(cat)
          ? prev
          : { ...prev, salary: basico, categoria: getCatNombre(cat) }
        );
        setCategoriaNoEncontrada(false);
      }
      return;
    }
  });

  // Normaliza strings para comparar sin importar mayúsculas, tildes, espacios, etc.
  const normalize = (s) =>
  (s || '')
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
  
  // Compara dos strings normalizados
  const sameName = (a, b) => normalize(a) === normalize(b);

  const findCategoriaByName = (name) => 
    categorias.find(c => sameName(getCatNombre(c), name));

  // Verifica si la categoría actual no está en el catálogo
  const getCatId = (c) => c?.id ?? c?.idCategoria ?? c?.categoriaId;
  const getCatNombre = (c) => c?.nombre ?? c?.descripcion ?? c?.categoria ?? `Categoría ${getCatId(c)}`;
  const getCatBasico = (c) => c?.salarioBasico ?? c?.basico ?? c?.sueldoBasico ?? c?.monto ?? c?.salario ?? 0;

  const findCategoriaById = (id) => categorias.find(c => String(getCatId(c)) === String(id));
  
  // Agregar área seleccionada desde el select
  const addSelectedArea = () => {
    const id = Number(selectedAreaToAdd);
    if (!Number.isFinite(id)) return;
    setFormData(prev => {
      const curr = Array.isArray(prev.areas) ? prev.areas : [];
      if (curr.includes(id)) return prev;
      return { ...prev, areas: [...curr, id] };
    });
    setSelectedAreaToAdd('');
    if (errors?.areas) setErrors(prev => ({ ...prev, areas: '' }));
  };

  // Maneja el cambio de categoría y actualiza el salario base
  const handleCategoriaChange = (id) => {
    const cat = findCategoriaById(id);
    setFormData(prev => ({
      ...prev,
      idCategoria: id,
      categoria: cat ? getCatNombre(cat) : prev.categoria, // opcional: mantener nombre legible
      salary: cat ? getCatBasico(cat) : ''                 // ← actualiza salario base
    }));
    if (errors?.categoria) setErrors(prev => ({ ...prev, categoria: '' }));
  };

  // Maneja el cambio en los campos del formulario
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpia el error del campo si existe
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Valida el formulario antes de enviarlo
  const validateForm = () => {
    const newErrors = {};

    const legajoStr = String(formData.legajo ?? '').trim();

    if (!legajoStr) {
      newErrors.legajo = 'El legajo es requerido';
    } else if (!/^\d+$/.test(legajoStr)) {
      newErrors.legajo = 'El legajo debe ser un número entero';
    } else if (Number(legajoStr) <= 0) {
      newErrors.legajo = 'El legajo debe ser un número mayor a cero';
    }

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es requerido';
    }

    if (!formData.cuil.trim()) {
      newErrors.cuil = 'El CUIL es requerido';
    }

    if (!formData.categoria.trim()) {
      newErrors.categoria = 'Debe asignar una categoría al empleado';
    }

    if (!formData.gremio.trim()) {
      newErrors.gremio = 'Debe asignar un gremio al empleado';
    }

    if (!Array.isArray(formData.areas) || formData.areas.length === 0) {
      newErrors.areas = 'Debe asignar por lo menos un área al empleado';
    }

    if (!formData.inicioActividad.trim()) {
      newErrors.inicioActividad = 'La fecha de ingreso de actividad es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Maneja el envío del formulario para crear un nuevo empleado
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newEmployee = {
        id: Date.now(), // Temporal ID generation
        ...formData,
        salary: Number(formData.salary)
      };

      onSave && onSave(newEmployee);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        birthDate: '',
        dni: '',
        position: '',
        department: '',
        hireDate: new Date().toISOString().split('T')[0],
        status: 'Activo',
        manager: '',
        salary: '',
        convenio: '',
        category: '',
        bank: '',
        cuil: ''
      });
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Error creating employee:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Maneja el cierre del modal y resetea el formulario
  const handleClose = () => {
    setFormData({
      legajo: '',
      nombre: '',
      apellido: '',
      domicilio: '',
       areas: [],
      inicioActividad: new Date().toISOString().split('T')[0],
      estado: 'Activo',
      gremio: '',
      categoria: '',
      banco: '',
      cuil: ''
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Agregar Nuevo Empleado"
      size="large"
      className="new-employee-modal"
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
              <label className="form-label">Nombre *</label>
              <input
                type="text"
                className={`form-input ${errors.nombre ? 'error' : ''}`}
                value={formData.nombre}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
                placeholder="Ingrese el nombre"
              />
              {errors.nombre && <span className="error-message">{errors.nombre}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Apellido *</label>
              <input
                type="text"
                className={`form-input ${errors.apellido ? 'error' : ''}`}
                value={formData.apellido}
                onChange={(e) => handleInputChange('apellido', e.target.value)}
                placeholder="Ingrese el apellido"
              />
              {errors.apellido && <span className="error-message">{errors.apellido}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Legajo *</label>
              <input
                type="text"
                className={`form-input ${errors.legajo ? 'error' : ''}`}
                value={formData.legajo}
                onChange={(e) => handleInputChange('legajo', e.target.value)}
                placeholder="Ingrese el legajo"
              />
              {errors.legajo && <span className="error-message">{errors.legajo}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Domicilio</label>
              <input
                type="text"
                className="form-input"
                value={formData.domicilio}
                onChange={(e) => handleInputChange('domicilio', e.target.value)}
                placeholder="Ingrese domicilio"
              />
            </div>

            <div className="form-group">
              <label className="form-label">CUIL *</label>
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
        <div className={'form-section'}>
          <h3 className={'section-title'}>
            <Building className={'title-icon'} />
            Información Laboral
          </h3>
          <div className={'form-grid'}>
            <div className={'form-group'}>
              <label className={'form-label'}>Categoría</label>
              <select
                className={'form-select'}
                value={formData.idCategoria ?? ''}
                onChange={(e) => handleCategoriaChange(Number(e.target.value))}
              >
                <option value="">Seleccionar categoría</option>
                {categorias.map((c) => {
                  const id = getCatId(c);
                  const label = getCatNombre(c);
                  return (
                    <option key={id} value={id}>
                      {label}
                    </option>
                  );
                })}
              </select>
              {/* Aviso si el nombre del empleado no matcheó con el catálogo */}
              {categoriaNoEncontrada && formData.categoria && (
                <small className="hint">
                  No se encontró la categoría “{formData.categoria}” en el catálogo. Elegí una de la lista.
                </small>
              )}
            </div>

            <div className={'form-group'}>
              <label className={'form-label'}>Salario Básico *</label>
              <input
                type="number"
                className={`${'form-input'} ${errors.salary ? 'error' : ''}`}
                value={formData.salary ?? ''} 
                placeholder="—"
                min="0"
                step="1"
                disabled
                readOnly
                title="Este valor se establece por la categoría seleccionada"
              />
              {errors.salary && <span className="error-message">{errors.salary}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Gremio *</label>
              <select
                className="form-select"
                value={formData.gremio}
                onChange={(e) => handleInputChange('gremio', e.target.value)}
              >
                <option value="Convenio General">Convenio General</option>
                <option value="LUZ_Y_FUERZA">Luz y fuerza</option>
                <option value="UOCCRA">UOCRA</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Banco</label>
              <select
                className="form-select"
                value={formData.banco}
                onChange={(e) => handleInputChange('banco', e.target.value)}
              >
                <option value="Banco Nación">Banco Nación</option>
                <option value="Banco Provincia">Banco Provincia</option>
                <option value="Banco Santander">Banco Santander</option>
                <option value="Banco Galicia">Banco Galicia</option>
                <option value="BBVA">BBVA</option>
                <option value="Banco Macro">Banco Macro</option>
              </select>
            </div>

            {/* Áreas como chips + desplegable de disponibles */}
            <div className={'form-group'}>
              <label className={'form-label'}>Áreas *</label>

              {/* Chips de áreas asignadas */}
              <div className='area-chips'>
                {(formData.areas || []).map((id, idx) => {
                  const numId = Number(id);
                  const ref = areas.find(a => a.id === numId);
                  const nombre = ref ? ref.nombre : `Área #${numId}`;

                  return (
                    <span key={`${numId}-${idx}`} className="area-chip">
                      {nombre}
                      <button
                        type="button"
                        className="chip-remove"
                        onClick={() => removeArea(numId)}
                        aria-label={`Quitar ${nombre}`}
                        title="Quitar área"
                      >
                        –
                      </button>
                    </span>
                  );
                })}
              </div>

              {/* Desplegable para agregar (solo muestra las disponibles) */}
              <div className="area-actions" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <select
                  className={`form-select ${errors?.areas ? 'error' : ''}`}
                  value={selectedAreaToAdd}
                  onChange={(e) => setSelectedAreaToAdd(e.target.value)}
                >
                  <option value="">Seleccionar área disponible</option>
                  {availableAreas.map((a) => (
                    <option key={a.id} value={String(a.id)}>
                      {a.nombre}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={addSelectedArea}
                  disabled={!selectedAreaToAdd}
                  title="Agregar área seleccionada"
                  style={{ width: 36, height: 36, borderRadius: 8, fontWeight: 700 }}
                >
                  +
                </button>
              </div>

              {/* Mensaje si no quedan disponibles */}
              {availableAreas.length === 0 && (
                <small className="hint">No quedan áreas disponibles para asignar.</small>
              )}

              {errors?.areas && (
                <span className="error-message">{errors.areas}</span>
              )}
            </div>
          </div>
        </div>
      </form>

      <ModalFooter>
        <button 
          type="button" 
          className="btn btn-secondary" 
          onClick={handleClose}
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
          <UserPlus className="h-4 w-4 mr-2" />
          {isLoading ? 'Guardando...' : 'Crear Empleado'}
        </button>
      </ModalFooter>
    </Modal>
  );
}