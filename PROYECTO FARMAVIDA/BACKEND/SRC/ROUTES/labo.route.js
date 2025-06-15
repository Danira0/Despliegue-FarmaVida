import { Router } from 'express';
import { 
    getProveedores, 
    createProveedor, 
    updateProveedor, 
    deleteProveedor, 
    getProveedorById,
} from '../CONTROLLER/labo.controller.js';
import upload from '../MIDDLEWARES/labo.imagen.js';

const router = Router();

router.get('/obtener/proveedores', getProveedores);
router.get('/obtener/proveedores/:id', getProveedorById);
router.post('/registrar/proveedores', upload.single('imagen'), createProveedor);
router.put('/actualizar/proveedores/:id',upload.single('imagen'), updateProveedor);
router.delete('/eliminar/proveedores/:id', deleteProveedor);

export default router;
