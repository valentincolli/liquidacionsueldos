import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import * as api from '../services/empleadosAPI';
import '../styles/components/_reportes.scss';
import { LoadingSpinner } from '../Components/ui/LoadingSpinner';

export default function Reportes() {
  const navigate = useNavigate();
  const [liquidaciones, setLiquidaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const loadLiquidaciones = useCallback(async () => {
    try {
      setLoading(true);
      // Obtener liquidaciones del mes seleccionado
      const periodo = selectedMonth.replace('-', '');
      const data = await api.getLiquidacionesByPeriodo(periodo);
      
      // Obtener detalles de cada liquidación para extraer conceptos
      const liquidacionesConDetalles = await Promise.all(
        (data || []).map(async (liquidacion) => {
          try {
            const detalle = await api.getDetallePago(liquidacion.id || liquidacion.idPago || liquidacion.idLiquidacion);
            return {
              ...liquidacion,
              detalles: detalle?.conceptos || detalle?.detalles || []
            };
          } catch (error) {
            console.error(`Error al cargar detalles de liquidación ${liquidacion.id}:`, error);
            return {
              ...liquidacion,
              detalles: []
            };
          }
        })
      );
      
      setLiquidaciones(liquidacionesConDetalles);
    } catch (error) {
      console.error('Error al cargar las liquidaciones:', error);
      setLiquidaciones([]);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth]);

  useEffect(() => {
    loadLiquidaciones();
  }, [loadLiquidaciones]);

  // Procesar y agrupar conceptos por nombre
  const conceptosAgrupados = useMemo(() => {
    const conceptosMap = new Map();

      liquidaciones.forEach((liquidacion) => {
      // Obtener detalles de la liquidación si están disponibles
      if (liquidacion.detalles && liquidacion.detalles.length > 0) {
        liquidacion.detalles.forEach((detalle) => {
          // Extraer información del concepto
          const nombre = detalle.nombre || detalle.concepto || detalle.descripcion || 'Sin nombre';
          let monto = 0;
          let tipo = 'BONIFICACION';

          // Determinar el monto y tipo según la estructura del detalle
          if (detalle.total !== undefined) {
            monto = Number(detalle.total);
          } else if (detalle.monto !== undefined) {
            monto = Number(detalle.monto);
          } else if (detalle.montoUnitario !== undefined && detalle.cantidad !== undefined) {
            monto = Number(detalle.montoUnitario) * Number(detalle.cantidad);
          }

          // Determinar si es descuento o bonificación
          if (detalle.tipo) {
            tipo = detalle.tipo.toUpperCase();
          } else if (detalle.isDescuento || monto < 0 || nombre.toLowerCase().includes('descuento')) {
            tipo = 'DESCUENTO';
          } else {
            tipo = 'BONIFICACION';
          }

          // Usar valor absoluto para los totales
          const montoAbsoluto = Math.abs(monto);

          if (montoAbsoluto > 0) {
            if (!conceptosMap.has(nombre)) {
              conceptosMap.set(nombre, {
                nombre,
                tipo,
                total: 0,
                cantidad: 0
              });
            }

            const concepto = conceptosMap.get(nombre);
            concepto.total += montoAbsoluto;
            concepto.cantidad += 1;
          }
        });
      }
    });

    // Si no hay detalles, intentar obtenerlos desde la API
    return Array.from(conceptosMap.values()).sort((a, b) => {
      // Primero bonificaciones, luego descuentos
      if (a.tipo !== b.tipo) {
        return a.tipo === 'BONIFICACION' ? -1 : 1;
      }
      return b.total - a.total;
    });
  }, [liquidaciones]);


  const totalBonificaciones = conceptosAgrupados
    .filter(c => c.tipo === 'BONIFICACION')
    .reduce((sum, c) => sum + c.total, 0);

  const totalDescuentos = conceptosAgrupados
    .filter(c => c.tipo === 'DESCUENTO')
    .reduce((sum, c) => sum + c.total, 0);

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  return (
    <div className="reportes-page">
      <div className="reportes-header">
        <h1 className="page-title">Reportes Mensuales</h1>
        <button 
          className="back-button-icon"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="icon" />
        </button>
      </div>

      <div className="reportes-filters">
        <div className="filter-group">
          <label htmlFor="month-filter">
            <Calendar className="icon" />
            Filtrar por mes:
          </label>
          <input
            id="month-filter"
            type="month"
            value={selectedMonth}
            onChange={handleMonthChange}
            className="month-input"
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Cargando reportes..." size="lg" className="list-loading" />
      ) : (
        <>
          <div className="reportes-summary">
            <div className="summary-card bonificaciones">
              <div className="summary-icon">
                <TrendingUp />
              </div>
              <div className="summary-content">
                <p className="summary-label">Total Bonificaciones</p>
                <p className="summary-value">
                  ${totalBonificaciones.toLocaleString('es-AR', { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })}
                </p>
              </div>
            </div>
            <div className="summary-card descuentos">
              <div className="summary-icon">
                <TrendingDown />
              </div>
              <div className="summary-content">
                <p className="summary-label">Total Descuentos</p>
                <p className="summary-value">
                  ${totalDescuentos.toLocaleString('es-AR', { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })}
                </p>
              </div>
            </div>
            <div className="summary-card neto">
              <div className="summary-icon">
                <DollarSign />
              </div>
              <div className="summary-content">
                <p className="summary-label">Diferencia Neto</p>
                <p className="summary-value">
                  ${(totalBonificaciones - totalDescuentos).toLocaleString('es-AR', { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="reportes-table-container">
            <table className="reportes-table">
              <thead>
                <tr>
                  <th>Concepto</th>
                  <th>Tipo</th>
                  <th>Cantidad</th>
                  <th>Total Mensual</th>
                </tr>
              </thead>
              <tbody>
                {conceptosAgrupados.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="no-data">
                      No hay datos disponibles para el mes seleccionado
                    </td>
                  </tr>
                ) : (
                  conceptosAgrupados.map((concepto, index) => (
                    <tr key={index} className={concepto.tipo.toLowerCase()}>
                      <td className="concepto-nombre">{concepto.nombre}</td>
                      <td>
                        <span className={`tipo-badge ${concepto.tipo.toLowerCase()}`}>
                          {concepto.tipo}
                        </span>
                      </td>
                      <td>{concepto.cantidad}</td>
                      <td className="concepto-total">
                        ${concepto.total.toLocaleString('es-AR', { 
                          minimumFractionDigits: 2, 
                          maximumFractionDigits: 2 
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

