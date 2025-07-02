import {motion} from 'framer-motion';
import styles from './DetallePagoModal.module.scss';

function DetallePagoModal({detalle, onClose}){
    const {
        idPago, periodoPago, fechaPago, total,
        legajoEmpleado, nombreEmpleado, apellidoEmpleado,
        categoriaEmpleado, conceptos
    } = detalle;

    return(
        <motion.div className={styles.overlay} initial={{opacity:0}} animate={{opacity:1}} exit={{ opacity: 0 }}>
            <motion.div className={styles.modal} initial={{scale: 0.9}} animate={{scale: 1}} exit={{ scale: 0.9 }}>
                <h3>Detalle del Pago #{idPago}</h3>

                <p><strong>Empleado:</strong> {legajoEmpleado} - {nombreEmpleado} {apellidoEmpleado}</p>
                <p><strong>Categoria:</strong> {categoriaEmpleado}</p>
                <p><strong>Periodo:</strong> {periodoPago}</p>
                <p><strong>Fecha de pago:</strong> {fechaPago}</p>
                
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Concepto</th>
                            <th>Tipo</th>
                            <th>Unidades</th>
                            <th>Monto Unitario</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {conceptos.map((c, idx) =>(
                            <tr key={idx}>
                                <td>{c.nombre}</td>
                                <td>{c.tipoConcepto}</td>
                                <td>{c.unidades}</td>
                                <td>${Number(c.montoUnitario).toFixed(2)}</td>
                                <td>{c.tipoConcepto === 'DESCUENTO' && '-'}$
                                    {Number(c.total).toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className={styles.total}>
                    <strong>Total Neto: ${Number(total).toFixed(2)}</strong>
                </div>

                <button onClick={onClose} className={styles.closeButton}>Cerrar</button>
            </motion.div>
        </motion.div>
    );
}

export default DetallePagoModal;