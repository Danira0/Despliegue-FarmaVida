import { Router } from "express";
import { 
  register, approve, deny, checkUserApproval, login, logout, getUsers, getUser, 
  update, remove, requestPasswordReset, verifyResetCode, resetPassword, 
  getAdmi, createAdmi, updateAdmi, deleteAdmi, getEmpleados, createEmple, 
  updateEmple, deleteEmple, 
} from '../CONTROLLER/auth.controller.js';
import { authRequired, isAdmin, isEmployee, isAdminOrEmployee } from '../MIDDLEWARES/validar.token.js';
import { uploadProfileImage } from '../MIDDLEWARES/user.images.js';

const router = Router();

// Rutas públicas
router.post('/auth/register', register);
router.get('/auth/approve', approve);
router.get('/auth/deny', deny);
router.get('/auth/check-approval', checkUserApproval);
router.post('/auth/login', login);
router.post('/auth/logout', logout);
router.post('/auth/request-password-reset', requestPasswordReset);
router.post('/auth/verify-reset-code', verifyResetCode);
router.post('/auth/reset-password', resetPassword);

// Rutas protegidas para usuarios autenticados
router.get('/users', authRequired, getUsers);
router.get('/users/:id', authRequired, getUser);
router.put('/users/:id', authRequired, update);
router.delete('/users/:id', authRequired, remove);

/* Gestion de Administrador - Solo accesible para admins */
router.get('/obtener/administrador', authRequired, isAdmin, getAdmi);
router.post('/registrar/administrador', authRequired, uploadProfileImage, isAdmin, createAdmi);
router.put('/actualizar/administrador/:id', authRequired, isAdmin, updateAdmi);
router.delete('/eliminar/administrador/:id', authRequired, uploadProfileImage, isAdmin, deleteAdmi);

/* Gestion de Empleado - Accesible para admins y empleados */
router.get('/obtener/empleado', authRequired, isAdmin, getEmpleados);
router.post('/registrar/empleado', authRequired, isAdmin, uploadProfileImage, createEmple);
router.put('/actualizar/empleado/:id', authRequired, isAdmin, uploadProfileImage, updateEmple);
router.delete('/eliminar/empleado/:id', authRequired, isAdmin, deleteEmple);


export default router;