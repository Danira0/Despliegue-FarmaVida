import * as informeModel from '../MODELS/informes.models.js';

const getProductos = async () => {
    try {
      return await informeModel.getProductos();
    } catch (error) {
      throw new Error(`Error en getProductos: ${error.message}`);
    }
  };
  
  const getProductosPorVencer = async (diasLimite) => {
    try {
      return await informeModel.getProductosPorVencer(diasLimite);
    } catch (error) {
      throw new Error(`Error en getProductosPorVencer: ${error.message}`);
    }
  };
  
  const getProductosEnStock = async () => {
    try {
      return await informeModel.getProductosEnStock();
    } catch (error) {
      throw new Error(`Error en getProductosEnStock: ${error.message}`);
    }
  };
  
  
  const getProductosPorFechaIngreso = async (fechaInicio, fechaFin) => {
    try {
      return await informeModel.getProductosPorFechaIngreso(fechaInicio, fechaFin);
    } catch (error) {
      throw new Error(`Error en getProductosPorFechaIngreso: ${error.message}`);
    }
  };
  
  // Servicios para informes de movimientos
  const getMovimientos = async () => {
    try {
      return await informeModel.getMovimientos();
    } catch (error) {
      throw new Error(`Error en getMovimientos: ${error.message}`);
    }
  };
  
const getMovimientosPorUsuario = async (usuarioId) => {
    try {
      const result = await informeModel.getMovimientosPorUsuario(usuarioId);
      return result.map(item => ({
        ...item,
        cantidad_movimiento: item.cantidad, 
        nombre_completo_usuario: `${item.nombre || ''} ${item.apellido || ''}`.trim()
      }));
    } catch (error) {
      console.error(`Error en getMovimientosPorUsuario para usuario ${usuarioId}:`, error);
      throw new Error(`Error al obtener movimientos del usuario: ${error.message}`);
    }
};
  
  const getMovimientosPorFecha = async (fechaInicio, fechaFin) => {
    try {
      return await informeModel.getMovimientosPorFecha(fechaInicio, fechaFin);
    } catch (error) {
      throw new Error(`Error en getMovimientosPorFecha: ${error.message}`);
    }
  };
  
  const getMovimientosPorProducto = async (productoId) => {
    try {
      return await informeModel.getMovimientosPorProducto(productoId);
    } catch (error) {
      throw new Error(`Error en getMovimientosPorProducto: ${error.message}`);
    }
  };
  
  const getMovimientosPorTipo = async (tipo) => {
    try {
      return await informeModel.getMovimientosPorTipo(tipo);
    } catch (error) {
      throw new Error(`Error en getMovimientosPorTipo: ${error.message}`);
    }
  };
  
  // Servicios para informes de laboratorios
  const getLaboratorios = async () => {
    try {
      return await informeModel.getLaboratorios();
    } catch (error) {
      throw new Error(`Error en getLaboratorios: ${error.message}`);
    }
  };
  
  const getLaboratorioPorId = async (laboratorioId) => {
    try {
      return await informeModel.getLaboratorioPorId(laboratorioId);
    } catch (error) {
      throw new Error(`Error en getLaboratorioPorId: ${error.message}`);
    }
  };
  
 const getProductosPorLaboratorio = async (laboratorioId) => {
  if (!laboratorioId || isNaN(laboratorioId)) {
    throw new Error('ID de laboratorio inválido');
  }
  
  const productos = await informeModel.getProductosPorLaboratorio(laboratorioId);
  
  if (!productos || productos.length === 0) {
    throw new Error('No se encontraron productos para este laboratorio');
  }
  
  return productos;
};
  
  // Servicios para informes de usuarios
  const getUsuarios = async () => {
    try {
      return await informeModel.getUsuarios();
    } catch (error) {
      throw new Error(`Error en getUsuarios: ${error.message}`);
    }
  };
  
  const getUsuarioPorId = async (usuarioId) => {
    try {
      return await informeModel.getUsuarioPorId(usuarioId);
    } catch (error) {
      throw new Error(`Error en getUsuarioPorId: ${error.message}`);
    }
  };
  
  const getUsuariosPorRol = async (rolId) => {
    try {
      return await informeModel.getUsuariosPorRol(rolId);
    } catch (error) {
      throw new Error(`Error en getUsuariosPorRol: ${error.message}`);
    }
  };

  export {
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
    getUsuariosPorRol
  };
  
  