import * as informeService from '../SERVICES/informes.service.js';
import * as pdfService from '../SERVICES/pdf.service.js';


export const getProductos = async (req, res) => {
  try {
    const productos = await informeService.getProductos();
    res.status(200).json({
      success: true,
      data: productos,
      message: 'Productos obtenidos con éxito',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Error al obtener productos'
    });
  }
};

export const getProductosPorVencer = async (req, res) => {
  try {
    const { dias = 90 } = req.query;
    const diasLimite = parseInt(dias);
    const productos = await informeService.getProductosPorVencer(diasLimite);
    res.status(200).json({
      success: true,
      data: productos,
      message: `Productos por vencer en ${diasLimite} días obtenidos con éxito`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Error al obtener productos por vencer'
    });
  }
};

export const getProductosEnStock = async (req, res) => {
  try {
    const productos = await informeService.getProductosEnStock();
    res.status(200).json({
      success: true,
      data: productos,
      message: 'Productos en stock obtenidos con éxito'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Error al obtener productos en stock'
    });
  }
};

export const getProductosPorFechaIngreso = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;

    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({
        success: false,
        message: 'Debe proporcionar fechaInicio y fechaFin en formato YYYY-MM-DD'
      });
    }

    const productos = await informeService.getProductosPorFechaIngreso(fechaInicio, fechaFin);
    res.status(200).json({
      success: true,
      data: productos,
      message: 'Productos por fecha de ingreso obtenidos con éxito'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Error al obtener productos por fecha de ingreso'
    });
  }
};

// Controladores para informes de movimientos
export const getMovimientos = async (req, res) => {
  try {
    const movimientos = await informeService.getMovimientos();
    res.status(200).json({
      success: true,
      message: 'Movimientos obtenidos con éxito',
      data: movimientos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Error al obtener movimientos'
    });
  }
};


export const getMovimientosPorUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params;

    // Validación mejorada del ID de usuario
    if (!usuarioId || isNaN(usuarioId)) {
      return res.status(400).json({
        success: false,
        message: 'Debe proporcionar un ID de usuario válido',
        error: 'ID_USUARIO_INVALIDO'
      });
    }

    const movimientos = await informeService.getMovimientosPorUsuario(parseInt(usuarioId));
    
    // Respuesta mejorada para casos sin resultados
    if (!movimientos || movimientos.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        metadata: {
          total: 0,
          entradas: 0,
          salidas: 0,
          diferencia: 0,
          usuario: 'No encontrado'
        },
        message: 'No se encontraron movimientos para este usuario'
      });
    }

    // Cálculo de estadísticas
    const totalEntradas = movimientos
      .filter(m => m.tipo_movimiento === 'Entrada' || m.tipo_movimiento === 'Devolucion')
      .reduce((sum, m) => sum + (Number(m.cantidad) || 0), 0);

    const totalSalidas = movimientos
      .filter(m => m.tipo_movimiento === 'Salida')
      .reduce((sum, m) => sum + (Number(m.cantidad) || 0), 0);

    const diferencia = totalEntradas - totalSalidas;

    // Respuesta exitosa con metadatos
    res.status(200).json({
      success: true,
      data: movimientos,
      metadata: {
        total: movimientos.length,
        entradas: totalEntradas,
        salidas: totalSalidas,
        diferencia: diferencia,
        usuario: movimientos[0]?.nombre_usuario || 'Desconocido',
        apellido: movimientos[0]?.apellido_usuario || '',
        primerMovimiento: movimientos[movimientos.length - 1]?.fecha_hora_movimiento,
        ultimoMovimiento: movimientos[0]?.fecha_hora_movimiento
      },
      message: 'Movimientos por usuario obtenidos con éxito'
    });
  } catch (error) {
    console.error('Error en getMovimientosPorUsuario:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      code: 'ERROR_CONSULTA_MOVIMIENTOS',
      message: 'Error al obtener movimientos por usuario'
    });
  }
};

export const getMovimientosPorFecha = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;

    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({
        success: false,
        message: 'Debe proporcionar fechaInicio y fechaFin en formato YYYY-MM-DD'
      });
    }

    const movimientos = await informeService.getMovimientosPorFecha(fechaInicio, fechaFin);
    res.status(200).json({
      success: true,
      data: movimientos,
      message: 'Movimientos por fecha obtenidos con éxito'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Error al obtener movimientos por fecha'
    });
  }
};

export const getMovimientosPorProducto = async (req, res) => {
  try {
    const { productoId } = req.params;

    if (!productoId) {
      return res.status(400).json({
        success: false,
        message: 'Debe proporcionar un ID de producto'
      });
    }

    const movimientos = await informeService.getMovimientosPorProducto(productoId);
    res.status(200).json({
      success: true,
      data: movimientos,
      message: 'Movimientos por producto obtenidos con éxito'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Error al obtener movimientos por producto'
    });
  }
};

export const getMovimientosPorTipo = async (req, res) => {
  try {
    const { tipo } = req.params;
    const tiposValidos = ['Entrada', 'Salida', 'Ajuste', 'Devolucion', 'Descarte'];

    if (!tipo || !tiposValidos.includes(tipo)) {
      return res.status(400).json({
        success: false,
        message: 'Debe proporcionar un tipo válido: Entrada, Salida, Ajuste, Devolucion o Descarte'
      });
    }

    const movimientos = await informeService.getMovimientosPorTipo(tipo);
    res.status(200).json({
      success: true,
      data: movimientos,
      message: `Movimientos de tipo ${tipo} obtenidos con éxito`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Error al obtener movimientos por tipo'
    });
  }
};

// Controladores para informes de laboratorios
export const getLaboratorios = async (req, res) => {
  try {
    const laboratorios = await informeService.getLaboratorios();
    res.status(200).json({
      success: true,
      message: 'Laboratorios obtenidos con éxito',
      data: laboratorios 
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Error al obtener laboratorios'
    });
  }
};

export const getLaboratorioPorId = async (req, res) => {
  try {
    const { laboratorioId } = req.params;

    if (!laboratorioId) {
      return res.status(400).json({
        success: false,
        message: 'Debe proporcionar un ID de laboratorio'
      });
    }

    const laboratorio = await informeService.getLaboratorioPorId(laboratorioId);

    if (!laboratorio) {
      return res.status(404).json({
        success: false,
        message: 'Laboratorio no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: laboratorio,
      message: 'Laboratorio obtenido con éxito'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Error al obtener laboratorio'
    });
  }
};

export const getProductosPorLaboratorio = async (req, res) => {
  try {
    const { laboratorioId } = req.params;

    if (!laboratorioId || isNaN(laboratorioId)) {
      return res.status(400).json({
        success: false,
        message: 'Debe proporcionar un ID de laboratorio válido'
      });
    }

    const productos = await informeService.getProductosPorLaboratorio(laboratorioId);
    
    if (!productos || productos.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No se encontraron productos para este laboratorio'
      });
    }

    res.status(200).json({
      success: true,
      data: productos,
      message: 'Productos por laboratorio obtenidos con éxito'
    });
  } catch (error) {
    console.error('Error en getProductosPorLaboratorio:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Error al obtener productos por laboratorio'
    });
  }
};

// Controladores para informes de usuarios
export const getUsuarios = async (req, res) => {
  try {
    const usuarios = await informeService.getUsuarios();
    res.status(200).json({
      success: true,
      message: 'Usuarios obtenidos con éxito',
      data: usuarios 
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Error al obtener usuarios'
    });
  }
};

export const getUsuarioPorId = async (req, res) => {
  try {
    const { usuarioId } = req.params;

    if (!usuarioId) {
      return res.status(400).json({
        success: false,
        message: 'Debe proporcionar un ID de usuario'
      });
    }

    const usuario = await informeService.getUsuarioPorId(usuarioId);

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: usuario,
      message: 'Usuario obtenido con éxito'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Error al obtener usuario'
    });
  }
};

export const getUsuariosPorRol = async (req, res) => {
  try {
    const { rolId } = req.params;

    if (!rolId) {
      return res.status(400).json({
        success: false,
        message: 'Debe proporcionar un ID de rol'
      });
    }

    const usuarios = await informeService.getUsuariosPorRol(rolId);
    res.status(200).json({
      success: true,
      data: usuarios,
      message: 'Usuarios por rol obtenidos con éxito'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Error al obtener usuarios por rol'
    });
  }
};

// Generación de informes Android

export const generateProductosPdf = async (req, res) => {
  try {
    const productos = await informeService.getProductos();
    const pdfBuffer = await pdfService.generateProductosPdf(productos);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=productos.pdf');
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Error al generar PDF de productos'
    });
  }
};

export const generateMovimientosPdf = async (req, res) => {
  try {
    const movimientos = await informeService.getMovimientos();
    const pdfBuffer = await pdfService.generateMovimientosPdf(movimientos);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=movimientos.pdf');
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Error al generar PDF de movimientos'
    });
  }
};

export const generateLaboratoriosPdf = async (req, res) => {
  try {
    const laboratorios = await informeService.getLaboratorios();
    const pdfBuffer = await pdfService.generateLaboratoriosPdf(laboratorios);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=laboratorios.pdf');
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Error al generar PDF de laboratorios'
    });
  }
};

export const generateUsuariosPdf = async (req, res) => {
  try {
    const usuarios = await informeService.getUsuarios();
    const pdfBuffer = await pdfService.generateUsuariosPdf(usuarios);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=usuarios.pdf');
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Error al generar PDF de usuarios'
    });
  }
};
