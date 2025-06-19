import { updateProductoStock } from "../SERVICES/producto.service.js";
import {
  getMovimientos as getMovimientoModel,
  getMovimientoById as getMovimientoByIdModel,
  createMovimiento as createMovimientoModel,
  updateMovimiento as updateMovimientoModel,
  deleteMovimiento as deleteMovimientoModel,
} from "../MODELS/movimiento.models.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { config } from "process";
import db from "../CONFIG/db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PRESENTACIONES_UNIDADES = [1, 2]; 
const PRESENTACIONES_FRASCOS = [3, 4, 5, 6]; 

export const getPendientesDevolucion = async (req, res) => {
  try {
    const [pendientes] = await db.query(`
      SELECT 
        m.ID_STOCK,
        m.fecha_hora_movimiento,
        m.cantidad AS cantidad_original,
        m.valor_unitario_movimiento,
        p.ID_PRODUCTO,
        p.nombre AS nombre_producto,
        pr.ID_Presentacion,
        pr.nombre_presentacion,
        u.nombre AS nombre_usuario,
        u.apellido AS apellido_usuario,
        CASE 
          WHEN pr.ID_Presentacion IN (1, 2) THEN p.cantidad_unidades
          WHEN pr.ID_Presentacion IN (3, 4, 5, 6) THEN p.cantidad_frascos
        END AS stock_actual,
        COALESCE((
          SELECT SUM(d.cantidad) 
          FROM movimiento d 
          WHERE d.movimiento_referencia = m.ID_STOCK 
          AND d.tipo_movimiento = 'Devolucion'
        ), 0) AS cantidad_devuelta,
        (m.cantidad - COALESCE((
          SELECT SUM(d.cantidad) 
          FROM movimiento d 
          WHERE d.movimiento_referencia = m.ID_STOCK 
          AND d.tipo_movimiento = 'Devolucion'
        ), 0)) AS cantidad_pendiente
      FROM movimiento m
      JOIN producto p ON m.ProductoID_Producto = p.ID_PRODUCTO
      JOIN presentacion pr ON m.PresentacionID_Presentacion = pr.ID_Presentacion
      JOIN usuario u ON m.UsuarioID_Usuario = u.ID_Usuario
      WHERE m.tipo_movimiento = 'Salida'
      AND (m.cantidad - COALESCE((
        SELECT SUM(d.cantidad) 
        FROM movimiento d 
        WHERE d.movimiento_referencia = m.ID_STOCK 
        AND d.tipo_movimiento = 'Devolucion'
      ), 0)) > 0
      ORDER BY m.fecha_hora_movimiento DESC
    `);
    
    res.json(pendientes);
  } catch (error) {
    console.error("Error al obtener pendientes de devolución:", error);
    res.status(500).json({
      error: error.message
    });
  }
};

export const getPresentaciones = async (req, res) => {
    try {
        const [result] = await db.query(`
            SELECT ID_Presentacion, nombre_presentacion 
            FROM presentacion
            ORDER BY nombre_presentacion
            `);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error al obtener las presentaciones", error);
        res.status(500).json({
            message: "Error al obtener las presentaciones",
            error: error.message,
        });
    }
}

export const getMovimiento = async (req, res) => {
  try {
    const movimientos = await getMovimientoModel();
    res.status(200).json(movimientos);
  } catch (error) {
    console.error("Error al obtener los movimientos", error);
    res.status(500).json({
      message: "Error al obtener los movimientos",
      error: error.message,
    });
  }
};

export const getUsuarios = async (req, res) => {
  try {
      const [result] = await db.query(`
          SELECT usuario.*, rol.descripcion AS rol, imagen.imagen_producto
          FROM usuario
          JOIN rol ON usuario.ROLID_ROL = rol.ID_ROL
          LEFT JOIN imagen ON usuario.ID_Usuario = imagen.ID_Usuario
      `);
      res.status(200).json(result);
  } catch (error) {
      console.error("Error al obtener los usuarios", error);
      res.status(500).json({
          message: "Error al obtener los usuarios",
          error: error.message,
      });
  }
}

export const getMovimientoById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "ID es obligatorio" });
  }
  try {
    const movimiento = await getMovimientoByIdModel(id);
    if (!movimiento) {
      return res.status(404).json({
        message: "Movimiento no encontrado",
      });
    }
    res.status(200).json(movimiento);
  } catch (error) {
    console.error("Error al obtener el movimiento por el ID:", error);
    res.status(500).json({
      message: "Error al obtener el movimiento por ID",
      error: error.message,
    });
  }
};

export const getProductos = async (req, res) => {
  try {
      const [result] = await db.query(`
          SELECT p.ID_PRODUCTO, p.nombre, p.PresentacionID_Presentacion, 
                 pr.nombre_presentacion, pr.ID_Presentacion
          FROM producto p
          LEFT JOIN presentacion pr ON p.PresentacionID_Presentacion = pr.ID_Presentacion
          ORDER BY p.nombre
      `);
      res.status(200).json(result);
  } catch (error) {
      console.error("Error al obtener los productos", error);
      res.status(500).json({
          message: "Error al obtener los productos",
          error: error.message,
      });
  }
}

// Controlador para obtener productos por presentación
export const getProductosByPresentacion = async (req, res) => {
  try {
      const { id } = req.params;
      if (isNaN(id)) {
          return res.status(400).json({
              message: "El ID de presentación debe ser un número"
          });
      }

      const [result] = await db.query(`
          SELECT p.ID_PRODUCTO, p.nombre, p.PresentacionID_Presentacion, 
                 pr.nombre_presentacion, pr.ID_Presentacion
          FROM producto p
          LEFT JOIN presentacion pr ON p.PresentacionID_Presentacion = pr.ID_Presentacion
          WHERE p.PresentacionID_Presentacion = ?
          ORDER BY p.nombre
      `, [id]);
      
      if (result.length === 0) {
          return res.status(404).json({
              message: "No se encontraron productos para esta presentación"
          });
      }
      
      res.status(200).json(result);
  } catch (error) {
      console.error("Error al obtener los productos por presentación", error);
      res.status(500).json({
          message: "Error al obtener los productos por presentación",
          error: error.message,
      });
  }
}

// Busqueda de filtros 
export const getEntradas = async (req, res) => {
  try {
    const entradas = await getMovimientoModel('Entrada');
    res.status(200).json({
      success: true,
      data: entradas
    });
  } catch (error) {
    console.error("Error al obtener las entradas:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener las entradas",
      error: error.message
    });
  }
};

export const getSalidas = async (req, res) => {
  try {
    const salidas = await getMovimientoModel('Salida');
    res.status(200).json({
      success: true,
      data: salidas
    });
  } catch (error) {
    console.error("Error al obtener las salidas:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener las Salidas",
      error: error.message
    });
  }
};


export const updateDevolucion = async (req, res) => {
  const { id } = req.params; 
  const { cantidad, motivo, observaciones } = req.body;
  
  if (!id || isNaN(id)) {
    return res.status(400).json({ 
      message: "El ID del movimiento es inválido",
      error: "ID_INVALIDO"
    });
  }

  if (!cantidad || cantidad <= 0) {
    return res.status(400).json({ 
      message: "La cantidad a devolver debe ser mayor a cero",
      error: "CANTIDAD_INVALIDA"
    });
  }

  try {
    // 1. Obtener el movimiento original (salida)
    const [movimientoOriginalData] = await db.query(`
      SELECT m.*, p.*, pr.nombre_presentacion
      FROM movimiento m
      JOIN producto p ON m.ProductoID_Producto = p.ID_PRODUCTO
      JOIN presentacion pr ON m.PresentacionID_Presentacion = pr.ID_Presentacion
      WHERE m.ID_STOCK = ? AND m.tipo_movimiento = 'Salida'
    `, [id]);
    
    if (movimientoOriginalData.length === 0) {
      return res.status(404).json({
        message: `Movimiento de salida con ID ${id} no encontrado. Verifica que el movimiento exista y sea de tipo 'Salida'`,
        error: "MOVIMIENTO_NO_ENCONTRADO",
        id_solicitado: id
      });
    }
    
    // Resto del código permanece igual...
    const movimientoOriginal = movimientoOriginalData[0];
    
    // 2. Calcular cantidad ya devuelta
    const [devolucionesData] = await db.query(`
      SELECT COALESCE(SUM(cantidad), 0) AS total_devuelto
      FROM movimiento
      WHERE movimiento_referencia = ? AND tipo_movimiento = 'Devolucion'
    `, [id]);
    
    const cantidadDevuelta = parseFloat(devolucionesData[0].total_devuelto);
    const cantidadPendiente = movimientoOriginal.cantidad - cantidadDevuelta;
    
    // 3. Validar cantidad
    if (cantidad > cantidadPendiente) {
      return res.status(400).json({
        message: `La cantidad a devolver (${cantidad}) no puede ser mayor a ${cantidadPendiente}`,
        error: "CANTIDAD_EXCEDIDA",
        cantidad_pendiente: cantidadPendiente
      });
    }
    
    // 4. Actualizar stock según presentación
    if (PRESENTACIONES_UNIDADES.includes(movimientoOriginal.PresentacionID_Presentacion)) {
      movimientoOriginal.cantidad_unidades += cantidad;
    } else if (PRESENTACIONES_FRASCOS.includes(movimientoOriginal.PresentacionID_Presentacion)) {
      movimientoOriginal.cantidad_frascos += cantidad;
    }
    
    // 5. Crear registro de devolución
    const fechaHoraMovimiento = new Date().toISOString().slice(0, 19).replace("T", " ");
    
    const nuevoMovimiento = {
      ProductoID_Producto: movimientoOriginal.ProductoID_Producto,
      PresentacionID_Presentacion: movimientoOriginal.PresentacionID_Presentacion,
      UsuarioID_Usuario: movimientoOriginal.UsuarioID_Usuario,
      UbicacionID_Ubicacion: movimientoOriginal.UbicacionID_Ubicacion,
      fecha_hora_movimiento: fechaHoraMovimiento,
      cantidad: cantidad,
      tipo_movimiento: 'Devolucion',
      motivo: motivo || 'Devolucion_producto',
      observaciones: observaciones || '',
      valor_unitario_movimiento: movimientoOriginal.valor_unitario_movimiento,
      subtotal: cantidad * movimientoOriginal.valor_unitario_movimiento,
      total_venta: cantidad * movimientoOriginal.valor_unitario_movimiento * 1.19,
      iva_aplicado: cantidad * movimientoOriginal.valor_unitario_movimiento * 0.19,
      movimiento_referencia: id 
    };
    
    const idMovimiento = await createMovimientoModel(nuevoMovimiento);
    
    // 6. Actualizar stock del producto
    await updateProductoStock(
      movimientoOriginal.ProductoID_Producto,
      movimientoOriginal.cantidad_unidades,
      movimientoOriginal.cantidad_frascos
    );
    
    res.status(201).json({
      message: "Devolución registrada correctamente",
      id: idMovimiento,
      producto: movimientoOriginal.nombre,
      presentacion: movimientoOriginal.nombre_presentacion,
      cantidad_devuelta: cantidad,
      cantidad_pendiente: cantidadPendiente - cantidad,
      stock_actual: PRESENTACIONES_UNIDADES.includes(movimientoOriginal.PresentacionID_Presentacion) 
        ? movimientoOriginal.cantidad_unidades 
        : movimientoOriginal.cantidad_frascos
    });
    
  } catch (error) {
    console.error("Error al registrar la devolución:", error);
    res.status(500).json({
      message: "Error interno al registrar la devolución",
      error: error.message,
      detalles: "Verifica los logs del servidor para más información"
    });
  }
};

export const createMovimiento = async (req, res) => {
  const movimiento = req.body;

  console.log("Datos recibidos para crear movimiento:", movimiento);

  // Validar presentación
  if (![...PRESENTACIONES_UNIDADES, ...PRESENTACIONES_FRASCOS].includes(movimiento.PresentacionID_Presentacion)) {
    return res.status(400).json({ message: "Presentación no válida" });
  }

  try {
    const [existingMovements] = await db.query(
      `SELECT * FROM movimiento 
       WHERE ProductoID_Producto = ? AND PresentacionID_Presentacion = ?`,
      [movimiento.ProductoID_Producto, movimiento.PresentacionID_Presentacion]
    );

    if (existingMovements.length > 0) {
      return res.status(400).json({
        message: "Este producto con esta presentación ya está registrado",
        error: "DUPLICATE_PRODUCT_PRESENTATION"
      });
    }



    // Obtener producto
    const [productoData] = await db.query(`
      SELECT p.*, e.nombre_estado 
      FROM producto p
      LEFT JOIN estado e ON p.EstadoID_Estado = e.ID_ESTADO
      WHERE p.ID_PRODUCTO = ?
    `, [movimiento.ProductoID_Producto]);

    if (!productoData || productoData.length === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    const producto = productoData[0];

    if (movimiento.tipo_movimiento === "Salida" && producto.nombre_estado === 'Inactivo') {
      return res.status(400).json({
        message: "No se puede realizar una salida de un producto inactivo",
        error: "INACTIVE_PRODUCT"
      });
    }

    const fecha_hora_movimiento = new Date().toISOString().slice(0, 19).replace("T", " ");

    // Inicializar objeto de movimiento
    const nuevoMovimiento = {
      ProductoID_Producto: movimiento.ProductoID_Producto,
      PresentacionID_Presentacion: movimiento.PresentacionID_Presentacion,
      UsuarioID_Usuario: movimiento.UsuarioID_Usuario,
      UbicacionID_Ubicacion: movimiento.UbicacionID_Ubicacion,
      fecha_hora_movimiento,
      tipo_movimiento: movimiento.tipo_movimiento,
      motivo: movimiento.motivo,
      observaciones: movimiento.observaciones,
      iva_aplicado: null,
      subtotal: null,
      total_venta: null,
      valor_unitario_movimiento: null
    };

    // Procesar según tipo de movimiento y presentación
    if (movimiento.tipo_movimiento === "Entrada") {
      if (PRESENTACIONES_UNIDADES.includes(movimiento.PresentacionID_Presentacion)) {
        // Cápsulas y tabletas
        const unidadesTotales = movimiento.cantidad_blister * producto.unidades_por_blister;
        nuevoMovimiento.cantidad_blister = movimiento.cantidad_blister;
        nuevoMovimiento.cantidad_unidades = unidadesTotales;
        nuevoMovimiento.cantidad = null;
        
        producto.cantidad_unidades = (producto.cantidad_unidades || 0) + unidadesTotales;
        producto.cantidad_blister = (producto.cantidad_blister || 0) + movimiento.cantidad_blister;
        producto.cantidad_frascos = null;
      } else if (PRESENTACIONES_FRASCOS.includes(movimiento.PresentacionID_Presentacion)) {
        // Jarabe, gotas, inyección
        nuevoMovimiento.cantidad = movimiento.cantidad;
        nuevoMovimiento.cantidad_blister = null;
        nuevoMovimiento.cantidad_unidades = null;
        
        producto.cantidad_frascos = (producto.cantidad_frascos || 0) + movimiento.cantidad;
        producto.cantidad_unidades = null;
        producto.cantidad_blister = null;
      }
    } else if (movimiento.tipo_movimiento === "Salida") {
      if (PRESENTACIONES_UNIDADES.includes(movimiento.PresentacionID_Presentacion)) {
        if ((producto.cantidad_unidades || 0) < movimiento.cantidad_unidades) {
          return res.status(400).json({ message: "No hay suficiente stock para realizar la salida" });
        }

        nuevoMovimiento.cantidad_unidades = movimiento.cantidad_unidades;
        nuevoMovimiento.cantidad = null;
        nuevoMovimiento.cantidad_blister = null;
        
        producto.cantidad_unidades -= movimiento.cantidad_unidades;
        producto.cantidad_frascos = null;
      } else if (PRESENTACIONES_FRASCOS.includes(movimiento.PresentacionID_Presentacion)) {
        if ((producto.cantidad_frascos || 0) < movimiento.cantidad) {
          return res.status(400).json({ message: "No hay suficiente stock para realizar la salida" });
        }

        nuevoMovimiento.cantidad = movimiento.cantidad;
        nuevoMovimiento.cantidad_blister = null;
        nuevoMovimiento.cantidad_unidades = null;

        producto.cantidad_frascos -= movimiento.cantidad;
        producto.cantidad_unidades = null;
      }

      // Cálculo de precios
      const cantidadVenta = PRESENTACIONES_UNIDADES.includes(movimiento.PresentacionID_Presentacion) 
        ? movimiento.cantidad_unidades 
        : movimiento.cantidad;

      nuevoMovimiento.valor_unitario_movimiento = movimiento.valor_unitario_movimiento;
      nuevoMovimiento.subtotal = cantidadVenta * movimiento.valor_unitario_movimiento;
      nuevoMovimiento.iva_aplicado = nuevoMovimiento.subtotal * 0.19;
      nuevoMovimiento.total_venta = nuevoMovimiento.subtotal + nuevoMovimiento.iva_aplicado;
    }

    // Crear movimiento
    const idMovimiento = await createMovimientoModel(nuevoMovimiento);

    // Actualizar producto
    await updateProductoStock(
      producto.ID_PRODUCTO,
      producto.cantidad_unidades,
      producto.cantidad_frascos,
      producto.cantidad_blister
    );

    return res.status(201).json({
      message: "Movimiento creado correctamente",
      id: idMovimiento
    });

  } catch (error) {
    console.error("Error al crear el movimiento:", error);
    return res.status(500).json({
      message: "Error al crear el movimiento",
      error: error.message,
    });
  }
};

export const updateMovimiento = async (req, res) => {
  const { id } = req.params;
  const movimiento = req.body;

  // Definición de tipos de presentación
  const PRESENTACIONES_FRASCOS = [3, 4, 5, 6]; 
  const PRESENTACIONES_UNIDADES = [1, 2];      

  if (!id) {
    return res.status(400).json({ message: "ID es obligatorio" });
  }

  // Validar presentación
  if (![...PRESENTACIONES_UNIDADES, ...PRESENTACIONES_FRASCOS].includes(movimiento.PresentacionID_Presentacion)) {
    return res.status(400).json({ message: "Presentación no válida" });
  }

  try {
    // 1. Obtener movimiento actual
    const movimientoActual = await getMovimientoByIdModel(id);
    if (!movimientoActual) {
      return res.status(404).json({ message: "Movimiento no encontrado" });
    }

    // 2. Obtener producto relacionado
    const [productoData] = await db.query(`
      SELECT p.*, e.nombre_estado 
      FROM producto p
      LEFT JOIN estado e ON p.EstadoID_Estado = e.ID_ESTADO
      WHERE p.ID_PRODUCTO = ?
    `, [movimiento.ProductoID_Producto]);
    
    if (!productoData || productoData.length === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    const producto = productoData[0];

    if (movimiento.tipo_movimiento === "Salida" && producto.nombre_estado === 'Inactivo') {
      return res.status(400).json({
        message: "No se puede actualizar a una salida para un producto inactivo",
        error: "INACTIVE_PRODUCT"
      });
    }

    // 3. Validar campos según presentación
    if (PRESENTACIONES_UNIDADES.includes(movimiento.PresentacionID_Presentacion)) {
      if (movimiento.tipo_movimiento === "Entrada") {
        if (!movimiento.unidad_por_blister || movimiento.unidad_por_blister <= 0) {
          return res.status(400).json({
            message: "Debe especificar el número de unidades por blister para entradas",
          });
        }
        if (!movimiento.cantidad_blister || movimiento.cantidad_blister <= 0) {
          return res.status(400).json({
            message: "Debe especificar la cantidad de blisters para entradas",
          });
        }
      } else if (movimiento.tipo_movimiento === "Salida") {
        if (!movimiento.cantidad_blister || movimiento.cantidad_blister <= 0) {
          return res.status(400).json({
            message: "Debe especificar la cantidad de unidades a retirar",
          });
        }
      }
    } else if (PRESENTACIONES_FRASCOS.includes(movimiento.PresentacionID_Presentacion)) {
      if (!movimiento.cantidad || movimiento.cantidad <= 0) {
        return res.status(400).json({
          message: "Debe especificar la cantidad de frascos",
        });
      }
    }

    // 4. Revertir el movimiento actual antes de aplicar los nuevos cambios
    if (movimientoActual.tipo_movimiento === "Entrada") {
      if (PRESENTACIONES_UNIDADES.includes(movimientoActual.PresentacionID_Presentacion)) {
        // Revertir la entrada anterior de unidades
        if (movimientoActual.unidad_por_blister && movimientoActual.cantidad_blister) {
          const unidadesTotalesAnteriores = movimientoActual.unidad_por_blister * movimientoActual.cantidad_blister;
          producto.cantidad_unidades = (producto.cantidad_unidades || 0) - unidadesTotalesAnteriores;
        }
      } else if (PRESENTACIONES_FRASCOS.includes(movimientoActual.PresentacionID_Presentacion)) {
        producto.cantidad_frascos = (producto.cantidad_frascos || 0) - movimientoActual.cantidad;
      }
    } else if (movimientoActual.tipo_movimiento === "Salida") {
      if (PRESENTACIONES_UNIDADES.includes(movimientoActual.PresentacionID_Presentacion)) {
        // Revertir la salida anterior de unidades
        producto.cantidad_unidades = (producto.cantidad_unidades || 0) + movimientoActual.cantidad_blister;
      } else if (PRESENTACIONES_FRASCOS.includes(movimientoActual.PresentacionID_Presentacion)) {
        producto.cantidad_frascos = (producto.cantidad_frascos || 0) + movimientoActual.cantidad;
      }
    }

    // 5. Preparar el objeto de movimiento actualizado
    let movimientoActualizado = {
      ProductoID_Producto: movimiento.ProductoID_Producto,
      PresentacionID_Presentacion: movimiento.PresentacionID_Presentacion,
      UsuarioID_Usuario: movimiento.UsuarioID_Usuario,
      UbicacionID_Ubicacion: movimiento.UbicacionID_Ubicacion,
      fecha_hora_movimiento: movimiento.fecha_hora_movimiento || new Date().toISOString().slice(0, 19).replace("T", " "),
      tipo_movimiento: movimiento.tipo_movimiento,
      motivo: movimiento.motivo,
      observaciones: movimiento.observaciones,
      iva_aplicado: null,
      subtotal: null,
      total_venta: null,
      valor_unitario_movimiento: null,
      unidad_por_blister: null,
      cantidad_blister: null,
      cantidad: null
    };

    let mensaje = "";

    // 6. Procesar según el tipo de movimiento
    if (movimiento.tipo_movimiento === "Entrada") {
      if (PRESENTACIONES_UNIDADES.includes(movimiento.PresentacionID_Presentacion)) {
        // Procesar entrada de unidades (tabletas/cápsulas)
        const unidadesPorBlister = movimiento.unidad_por_blister;
        const unidadesTotales = movimiento.cantidad_blister * unidadesPorBlister;
        
        // Actualizar stock de unidades
        producto.cantidad_unidades = (producto.cantidad_unidades || 0) + unidadesTotales;
        
        // Actualizar campos del movimiento
        movimientoActualizado.unidad_por_blister = unidadesPorBlister;
        movimientoActualizado.cantidad_blister = movimiento.cantidad_blister;
        movimientoActualizado.cantidad = unidadesTotales;
        
        mensaje = `Se han repuesto ${movimiento.cantidad_blister} blisters de ${producto.nombre} (${unidadesPorBlister} unidades cada uno), equivalentes a ${unidadesTotales} unidades.`;
      } else {
        // Procesar entrada de frascos (jarabes, cremas, etc.)
        producto.cantidad_frascos = (producto.cantidad_frascos || 0) + movimiento.cantidad;
        movimientoActualizado.cantidad = movimiento.cantidad;
        mensaje = `Se han repuesto ${movimiento.cantidad} frascos/tubos de ${producto.nombre}.`;
      }
    } else if (movimiento.tipo_movimiento === "Salida") {
      if (PRESENTACIONES_UNIDADES.includes(movimiento.PresentacionID_Presentacion)) {
        // Validar stock suficiente para unidades
        const unidadesRequeridas = movimiento.cantidad_blister;
        
        if ((producto.cantidad_unidades || 0) < unidadesRequeridas) {
          return res.status(400).json({
            message: `No hay suficiente stock para realizar la salida. Stock actual: ${producto.cantidad_unidades || 0}, requerido: ${unidadesRequeridas}`,
          });
        }
        
        producto.cantidad_unidades -= unidadesRequeridas;
        movimientoActualizado.cantidad_blister = movimiento.cantidad_blister;
        movimientoActualizado.cantidad = unidadesRequeridas;
        
        mensaje = `Se han retirado ${movimiento.cantidad_blister} unidades de ${producto.nombre}.`;
      } else {
        // Validar stock suficiente para frascos
        if ((producto.cantidad_frascos || 0) < movimiento.cantidad) {
          return res.status(400).json({
            message: `No hay suficiente stock para realizar la salida. Stock actual: ${producto.cantidad_frascos || 0}, requerido: ${movimiento.cantidad}`,
          });
        }
        producto.cantidad_frascos -= movimiento.cantidad;
        movimientoActualizado.cantidad = movimiento.cantidad;
        mensaje = `Se han retirado ${movimiento.cantidad} frascos/tubos de ${producto.nombre}.`;
      }

      // Cálculos financieros para salidas
      if (movimiento.valor_unitario_movimiento) {
        const subtotal = movimientoActualizado.cantidad * movimiento.valor_unitario_movimiento;
        const iva_aplicado = subtotal * 0.19;
        const total_venta = subtotal + iva_aplicado;

        movimientoActualizado.iva_aplicado = iva_aplicado;
        movimientoActualizado.subtotal = subtotal;
        movimientoActualizado.total_venta = total_venta;
        movimientoActualizado.valor_unitario_movimiento = movimiento.valor_unitario_movimiento;
      }
    }

    // 7. Actualizar el movimiento en la base de datos
    const affectedRows = await updateMovimientoModel(id, movimientoActualizado);
    if (affectedRows === 0) {
      return res.status(404).json({ 
        message: "Movimiento no encontrado o no se pudo actualizar" 
      });
    }

    // 8. Actualizar el stock del producto
    await updateProductoStock(
      producto.ID_PRODUCTO,
      PRESENTACIONES_UNIDADES.includes(movimiento.PresentacionID_Presentacion) 
        ? producto.cantidad_unidades 
        : null,
      PRESENTACIONES_FRASCOS.includes(movimiento.PresentacionID_Presentacion) 
        ? producto.cantidad_frascos 
        : null
    );

    // 9. Retornar respuesta exitosa
    return res.status(200).json({
      message: "Movimiento actualizado exitosamente",
      mensaje: mensaje,
      nuevoStock: {
        frascos: producto.cantidad_frascos,
        unidades: producto.cantidad_unidades
      }
    });

  } catch (error) {
    console.error("Error al actualizar el movimiento:", error);
    return res.status(500).json({
      message: "Error al actualizar el movimiento",
      error: error.message,
    });
  }
};

export const deleteMovimiento = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "ID es obligatorio" });
  }

  try {
    const affectedRows = await deleteMovimientoModel(id);
    if (affectedRows === 0) {
      return res.status(404).json({ message: "Movimiento no encontrado" });
    }
    res.status(200).json({ message: "Movimiento eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar el movimiento:", error);
    if (error.message.includes("No se puede eliminar el único movimiento")) {
      return res.status(400).json({
        message: error.message,
        error: "CANNOT_DELETE_UNIQUE_RECORD"
      });
    }
    res.status(500).json({
      message: "Error al eliminar el movimiento",
      error: error.message,
    });
  }
};