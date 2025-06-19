import { Router } from "express";
import {
  getProductos,
  getProductosPorVencer,
  getProductosEnStock,
  getProductosPorFechaIngreso,
  getMovimientos,
  getMovimientosPorUsuario,
  getMovimientosPorFecha,
  getMovimientosPorProducto,
  getMovimientosPorTipo,
  getLaboratorios,
  getLaboratorioPorId,
  getProductosPorLaboratorio,
  getUsuarios,
  getUsuarioPorId,
  getUsuariosPorRol,
  generateProductosPdf,
  generateMovimientosPdf,
  generateLaboratoriosPdf,
  generateUsuariosPdf,
} from "../CONTROLLER/informes.controller.js";

const router = Router();

router.get("/productos", getProductos);
router.get("/productos/por-vencer", getProductosPorVencer);
router.get("/productos/en-stock", getProductosEnStock);
router.get("/productos/por-fecha-ingreso", getProductosPorFechaIngreso);

// Rutas para informes de movimientos
router.get("/movimientos", getMovimientos);
router.get("/movimientos/usuario/:usuarioId", getMovimientosPorUsuario);
router.get("/movimientos/por-fecha", getMovimientosPorFecha);
router.get("/movimientos/producto/:productoId", getMovimientosPorProducto);
router.get("/movimientos/tipo/:tipo", getMovimientosPorTipo);

// Rutas para informes de laboratorios
router.get("/laboratorios", getLaboratorios);
router.get("/laboratorios/:laboratorioId", getLaboratorioPorId);
router.get(
  "/laboratorios/productos/:laboratorioId",
  getProductosPorLaboratorio
);

// Rutas para informes de usuarios
router.get("/usuarios", getUsuarios);
router.get("/usuarios/:usuarioId", getUsuarioPorId);
router.get("/usuarios/rol/:rolId", getUsuariosPorRol);

// generacion de informes Android
router.get("/pdf/productos", generateProductosPdf);
router.get("/pdf/movimientos", generateMovimientosPdf);
router.get("/pdf/laboratorios", generateLaboratoriosPdf);
router.get("/pdf/usuarios", generateUsuariosPdf);

export default router;
