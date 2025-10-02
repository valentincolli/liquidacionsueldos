import { useState, useEffect } from 'react';
import { Modal, ModalFooter } from '../Modal/Modal';
import { User, Building, DollarSign, Save, X } from 'lucide-react';
import * as api from "../../services/empleadosAPI";

export function EmployeeEditModal({ isOpen, onClose, employee, onSave }) {
  // ---------- Estado del formulario ----------
  const [formData, setFormData] = useState({
    legajo: '',
    nombre: '',
    apellido: '',
    domicilio: '',
    areas: [],
    status: 'Activo',
    gremio: 'Convenio General',
    categoria: '',
    idCategoria: '',
    bank: 'Banco Nación',
    inicioActividad: '',
    cuil: '',
    cbu: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [areas, setAreas] = useState([]);
  const [selectedAreaToAdd, setSelectedAreaToAdd] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [categoriaNoEncontrada, setCategoriaNoEncontrada] = useState(false);

  // ---------- Catálogo de áreas ----------
  useEffect(() => {
    const loadAreas = async () => {
      try {
        const data = await api.getAreas(); // hace el fetch con axios
        setAreas(data); // guarda las áreas en el estado
      } catch (err) {
        console.error("Error loading areas:", err);
      }
    };
    loadAreas();
  }, []);

  // ---------- Catálogo de categorías ----------
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

  // ---------- Manejo de categoría y salario básico ----------
  useEffect(() => {
    if (!categorias.length) return;

    // preferimos el id si ya está (por ej. usuario seleccionó algo)
    if (formData.idCategoria) {
      const cat = findCategoriaById(formData.idCategoria);
      if (cat) {
        const basico = getCatBasico(cat);
        setFormData(prev => (prev.salary === basico ? prev : { ...prev, salary: basico, categoria: getCatNombre(cat) }));
        setCategoriaNoEncontrada(false);
      }
      return;
    }

    // si no hay id, intentamos matchear por nombre que vino en employee
    const name = formData.categoria || employee?.categoria || employee?.nombreCategoria;
    if (!name) return;

    const match = findCategoriaByName(name);
    if (match) {
      setFormData(prev => ({
        ...prev,
        idCategoria: getCatId(match),
        categoria: getCatNombre(match),
        salary: getCatBasico(match),
      }));
      setCategoriaNoEncontrada(false);
    } else {
      setCategoriaNoEncontrada(true);
    }
  }, [categorias, formData.idCategoria, formData.categoria, employee?.categoria]);


  const getCatId = (c) => c?.id ?? c?.idCategoria ?? c?.categoriaId;
  const getCatNombre = (c) => c?.nombre ?? c?.descripcion ?? c?.categoria ?? `Categoría ${getCatId(c)}`;
  const getCatBasico = (c) => c?.salarioBasico ?? c?.basico ?? c?.sueldoBasico ?? c?.monto ?? c?.salario ?? 0;

  const findCategoriaById = (id) => categorias.find(c => String(getCatId(c)) === String(id));

  // Normaliza strings para comparar sin importar mayúsculas, tildes, espacios, etc.
  const normalize = (s) =>
  (s || '')
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

  const sameName = (a, b) => normalize(a) === normalize(b);

  const findCategoriaByName = (name) => 
    categorias.find(c => sameName(getCatNombre(c), name));

  const handleCategoriaChange = (id) => {
    const cat = findCategoriaById(id);
    setFormData(prev => ({
      ...prev,
      idCategoria: id,
      categoria: cat ? getCatNombre(cat) : prev.categoria, // opcional, por si guardás el nombre
      salary: cat ? getCatBasico(cat) : prev.salary, // actualiza el salario base al cambiar categoría
    }));
    if (errors?.categoria) setErrors(prev => ({ ...prev, categoria: '' }));
  };

  // ---------- Precarga de datos al editar ----------
  useEffect(() => {
    if (employee) {
      setFormData(prev => ({
        ...prev,
        legajo: employee.legajo ?? '',
        nombre: employee.nombre || '',
        apellido: employee.apellido || '',
        domicilio: employee.domicilio || '',
        status: employee.estado || 'Activo',
        gremio: employee.gremio || 'Convenio General',
        categoria: employee.categoria || 'A1',
        idCategoria: '',
        bank: employee.banco || 'Banco Nación',
        inicioActividad: employee.inicioActividad || '',
        cuil: employee.cuil || '',
        salary: employee.salary ?? '',
        cbu: employee.cbu || '',
        areas: Array.isArray(employee.idAreas) ? employee.idAreas : [],
      }));
      setErrors({});
    }
  }, [employee]);

  // ---------- Helpers generales ----------
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors && errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.areas || formData.areas.length === 0) {
      newErrors.areas = 'Elegí al menos un área';
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
      // Simula llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedEmployee = {
        ...employee,
        ...formData,
        // salary: Number(formData.salary),
        areas: formData.areas // <--- enviar array de IDs (antes: departments)
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

  // ---------- Áreas: chips + desplegable de disponibles ----------
  const removeArea = (id) => {
    setFormData(prev => ({ ...prev, areas: (prev.areas || []).filter(v => v !== id) }));
    if (errors && errors.areas) setErrors(prev => ({ ...prev, areas: '' }));
  };

  const addSelectedArea = () => {
    const id = Number(selectedAreaToAdd);
    if (!id) return;
    setFormData(prev => {
      const current = prev.areas || [];
      if (current.includes(id)) return prev; // ya está
      return { ...prev, areas: [...current, id] };
    });
    setSelectedAreaToAdd('');
    if (errors && errors.areas) setErrors(prev => ({ ...prev, areas: '' }));
  };

  const availableAreas = areas.filter(a => !(formData.areas || []).includes(a.id));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Editar Empleado - ${employee.nombre} ${employee.apellido}`}
      size="large"
      className={'employee-edit-modal'}
    >

      <form onSubmit={handleSubmit} className={"employee-form"}>
        {/* Información Personal */}
        <div className={'form-section'}>
          <h3 className={'section-title'}>
            <User className={'title-icon'} />
            Información Personal
          </h3>
          <div className={'form-grid'}>
            <div className={'form-group'}>
              <label className={'form-label'}>Nombre Completo *</label>
              <input
                type="text"
                className={`${'form-input'} ${errors.nombre ? 'error' : ''}`}
                value={`${formData.nombre} ${formData.apellido}`}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
                placeholder="Ingrese el nombre completo"
              />
              {errors.nombre && <span className={'error-message'}>{errors.nombre}</span>}
            </div>

            <div className={'form-group'}>
              <label className={'form-label'}>Dirección</label>
              <input
                type="text"
                className={'form-input'}
                value={formData.domicilio}
                onChange={(e) => handleInputChange('domicilio', e.target.value)}
                placeholder="Dirección completa"
              />
            </div>

            <div className={'form-group'}>
              <label className={'form-label'}>CUIL</label>
              <input
                type="text"
                className={'form-input'}
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
            {/* Áreas como chips + desplegable de disponibles */}
            <div className={'form-group'}>
              <label className={'form-label'}>Áreas *</label>

              {/* Chips de áreas asignadas */}
              <div className='area-chips'>
                {(formData.areas || []).map((id, idx) => {
                  const ref = areas.find(a => a.id === id);
                  const nombre = ref
                    ? ref.nombre
                    : (employee?.nombreAreas?.[idx] ?? `Área #${id}`); // fallback si aún no cargó el catálogo
                  return (
                    <span key={`${id}-${idx}`} className="area-chip">
                      {nombre}
                      <button
                        type="button"
                        className="chip-remove"
                        onClick={() => removeArea(id)}
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
              <div className='area-actions'>
                <select
                  className={`form-select ${errors && errors.areas ? 'error' : ''}`}
                  value={selectedAreaToAdd}
                  onChange={(e) => setSelectedAreaToAdd(e.target.value)}
                >
                  <option value="">Seleccionar área disponible</option>
                  {availableAreas.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.nombre}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  className="btn-plus"
                  onClick={addSelectedArea}
                  disabled={!selectedAreaToAdd}
                  title="Agregar área seleccionada"
                >
                  +
                </button>
              </div>

              {/* Mensaje cuando no quedan disponibles */}
              {availableAreas.length === 0 && (
                <small className="hint">Este empleado ya tiene todas las áreas asignadas.</small>
              )}

              {errors && errors.areas && (
                <span className={'error-message'}>{errors.areas}</span>
              )}
            </div>

            <div className={'form-group'}>
              <label className={'form-label'}>Estado</label>
              <select
                className={'form-select'}
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>

          </div>
        </div>

        {/* Información Salarial */}
        <div className={'form-section'}>
          <h3 className={'section-title'}>
            <DollarSign className={'title-icon'} />
            Información Salarial
          </h3>
          <div className={'form-grid'}>
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

            <div className={'form-group'}>
              <label className={'form-label'}>Gremio</label>
              <select
                className={'form-select'}
                value={formData.gremio}
                onChange={(e) => handleInputChange('gremio', e.target.value)}
              >
                <option value="Convenio General">Convenio General</option>
              </select>
            </div>

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
              <label className={'form-label'}>Banco</label>
              <select
                className={'form-select'}
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
          </div>
        </div>
      </form>

      <ModalFooter>
        <button 
          type="button" 
          className={`${'btn'} ${'btn-cancel'}`}
          onClick={onClose}
          disabled={isLoading}
        >
          <X className={'close-icon'} />
          Cancelar
        </button>
        <button 
          type="submit" 
          className={`${'btn'} ${'btn-primary'}`}
          onClick={handleSubmit}
          disabled={isLoading}
        >
          <Save className={'save-icon'} />
          {isLoading ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </ModalFooter>
    </Modal>
  );
}
