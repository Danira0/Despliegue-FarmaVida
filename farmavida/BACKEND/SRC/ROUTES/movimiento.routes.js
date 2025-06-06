import { Router } from 'express';
import { getMovimiento, getMovimientoById, getPresentaciones, getUsuarios, getProductos, getProductosByPresentacion,  createMovimiento, updateMovimiento, deleteMovimiento, getPendientesDevolucion, updateDevolucion, getEntradas, getSalidas } from '../CONTROLLER/movimiento.controller.js';

const router = Router();

router.get('/obtener/movimientos', getMovimiento);
router.get('/obtener/movimiento/:id', getMovimientoById);
router.get ('/obtener/usuarios', getUsuarios);
router.get('/obtener/presentaciones', getPresentaciones);
router.get('/obtener/productos', getProductos);
router.get('/obtener/productos/presentacion/:id', getProductosByPresentacion);
router.get('/obtener/entradas', getEntradas);
router.get('/obtener/salidas', getSalidas);

router.post('/registrar/movimiento', createMovimiento);
router.put('/actualizar/movimiento/:id',  updateMovimiento);
router.delete('/eliminar/movimiento/:id', deleteMovimiento);

router.get('/movimientos/devoluciones/pendientes', getPendientesDevolucion);
router.put('/movimientos/devoluciones/:id', updateDevolucion);


export default router;