import { Router } from "express";
import { getProductos, getProductoById, createProducto, updateProducto, deleteProducto, getFechavenci, verificarStock, getNombresLaboratorios } from "../CONTROLLER/producto.controller.js";
import upload from '../MIDDLEWARES/producto.imagen.js';

const router = Router();

router.get('/obtener/productos', getProductos);
router.get('/obtener/productos/:id', getProductoById);
router.post('/registrar/productos', upload.single('imagen'), createProducto);
router.put('/actualizar/productos/:id', upload.single('imagen'), updateProducto);
router.delete('/eliminar/productos/:id', deleteProducto);
router.get('/caducidad/productos', getFechavenci);
router.get('/obtener/laboratorios/nombres', getNombresLaboratorios);

router.get('/verificar/stock', verificarStock)

export default router;

