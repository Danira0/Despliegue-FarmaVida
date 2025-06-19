import {
    getMovimientosModel,
    getMovimientoByIdModel,
    createMovimientoModel,  
    updateMovimientoModel,
    deleteMovimientoModel 
} from "../MODELS/movimiento.models.js";
import db from '../CONFIG/db.js';

import { getProductoById, updateProductoStock } from '../SERVICES/producto.service.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MAX_HORAS_DEVOLUCION = 72; // 3 días para devoluciones
const PRESENTACIONES_UNIDADES = [1, 2];
const PRESENTACIONES_FRASCOS = [3, 4, 5, 6];

export const getDevolucionesPendientes = async (movimientoId) => {
    const query = `
      SELECT 
        m.ID_STOCK as id_movimiento_original,
        m.cantidad as cantidad_original,
        m.fecha_hora_movimiento,
        IFNULL(SUM(ABS(d.cantidad)), 0) as cantidad_devuelta,
        GREATEST(0, m.cantidad - IFNULL(SUM(ABS(d.cantidad)), 0)) as cantidad_pendiente,
        p.nombre as nombre_producto,
        pr.nombre_presentacion,
        m.PresentacionID_Presentacion
      FROM movimiento m
      LEFT JOIN movimiento d ON d.movimiento_referencia = m.ID_STOCK AND d.tipo_movimiento = 'Devolucion'
      JOIN producto p ON m.ProductoID_Producto = p.ID_PRODUCTO
      JOIN presentacion pr ON m.PresentacionID_Presentacion = pr.ID_Presentacion
      WHERE m.ID_STOCK = ? AND m.tipo_movimiento = 'Salida'
      GROUP BY m.ID_STOCK
    `;

    const [result] = await db.query(query, [movimientoId]);
    
    if (result.length === 0) {
      throw new Error("Movimiento de salida no encontrado");
    }
    
    return result[0];
};

export const getMovimientos = async () => {
    return await getMovimientosModel();
};

export const getMovimientoById = async (id) => {
    if (!id) throw new Error("ID es obligatorio");
    const movimiento = await getMovimientoByIdModel(id);
    if (!movimiento) {
      throw new Error("Movimiento no encontrado");
    }
    return movimiento;
};

export const getProductosByPresentacion = async (id) => {
    if (isNaN(id)) {
      throw new Error("El ID de presentación debe ser un número");
    }

    const productos = await productoModel.getProductosByPresentacion(id);
    if (productos.length === 0) {
      throw new Error("No se encontraron productos para esta presentación");
    }
    return productos;
};

export const getPresentaciones = async () => {
    return await presentacionModel.getPresentaciones();
};

export const getUsuarios = async () => {
    return await usuarioModel.getUsuarios();
};

export const createDevolucion = async (movimientoId, { motivo, observaciones, cantidad }) => {
    const [movimientoData] = await db.query(`
      SELECT m.*, p.*, pr.nombre_presentacion,
        (SELECT IFNULL(SUM(d.cantidad), 0) 
         FROM movimiento d 
         WHERE d.movimiento_referencia = m.ID_STOCK 
         AND d.tipo_movimiento = 'Devolucion') as cantidad_devuelta,
        TIMESTAMPDIFF(HOUR, m.fecha_hora_movimiento, NOW()) as horas_transcurridas_db
      FROM movimiento m
      JOIN producto p ON m.ProductoID_Producto = p.ID_PRODUCTO
      JOIN presentacion pr ON m.PresentacionID_Presentacion = pr.ID_Presentacion
      WHERE m.ID_STOCK = ? AND m.tipo_movimiento = 'Salida'
    `, [movimientoId]);
    
    if (movimientoData.length === 0) {
      throw new Error("Movimiento de salida no encontrado");
    }
    
    const movimientoOriginal = movimientoData[0];    
    const cantidadDisponibleDevolver = movimientoOriginal.cantidad - movimientoOriginal.cantidad_devuelta;
    const cantidadDevolucion = cantidad || cantidadDisponibleDevolver;

    if (cantidadDevolucion <= 0) {
      throw new Error("No hay cantidad disponible para devolver");
    }
    
    if (cantidadDevolucion > cantidadDisponibleDevolver) {
      throw new Error(`La cantidad a devolver (${cantidadDevolucion}) excede la disponible (${cantidadDisponibleDevolver})`);
    }
    
    const fecha_hora_movimiento = new Date().toISOString().slice(0, 19).replace("T", " ");
    let mensaje = "";
    const productoActual = await getProductoById(movimientoOriginal.ProductoID_Producto);
    
    if ([1, 2].includes(movimientoOriginal.PresentacionID_Presentacion)) {
      productoActual.cantidad_unidades += cantidadDevolucion;
      mensaje = `Se han devuelto ${cantidadDevolucion} unidades de ${productoActual.nombre}.`;
    } else {
      productoActual.cantidad_frascos += cantidadDevolucion;
      mensaje = `Se han devuelto ${cantidadDevolucion} frascos/tubos de ${productoActual.nombre}.`;
    }
    
    const nuevoMovimiento = {
      ProductoID_Producto: movimientoOriginal.ProductoID_Producto,
      PresentacionID_Presentacion: movimientoOriginal.PresentacionID_Presentacion,
      UsuarioID_Usuario: movimientoOriginal.UsuarioID_Usuario,
      UbicacionID_Ubicacion: movimientoOriginal.UbicacionID_Ubicacion,
      fecha_hora_movimiento,
      cantidad: cantidadDevolucion,
      tipo_movimiento: "Devolucion",
      motivo: motivo || "Devolución de producto",
      observaciones: observaciones || `Devolución del movimiento ${movimientoId} (${cantidadDevolucion} de ${movimientoOriginal.cantidad})`,
      iva_aplicado: movimientoOriginal.iva_aplicado,
      subtotal: movimientoOriginal.subtotal,
      total_venta: movimientoOriginal.total_venta,
      valor_unitario_movimiento: movimientoOriginal.valor_unitario_movimiento,
      movimiento_referencia: movimientoId  
    };
    
    const idMovimiento = await createMovimientoModel(nuevoMovimiento);
    await updateProductoStock({
      id: movimientoOriginal.ProductoID_Producto,
      cantidad_unidades: productoActual.cantidad_unidades,
      cantidad_frascos: productoActual.cantidad_frascos
    });
    
    // horasTranscurridas y tiempo_restante deben calcularse aquí si las necesitas
    // let horasTranscurridas = movimientoData[0].horas_transcurridas_db;
    
    return {
      message: "Devolución realizada correctamente",
      id: idMovimiento,
      mensaje: mensaje,
      cantidad_devuelta: cantidadDevolucion,
      cantidad_disponible_restante: cantidadDisponibleDevolver - cantidadDevolucion
      // horasTranscurridas: horasTranscurridas?.toFixed(2),
      // tiempo_restante: (MAX_HORAS_DEVOLUCION - horasTranscurridas)?.toFixed(2) + " horas restantes"
    };
};

export const createMovimiento = async (movimiento) => {
    const presentacionesValidas = [
        ...(PRESENTACIONES_UNIDADES || []),
        ...(PRESENTACIONES_FRASCOS || [])
    ];

    if (!presentacionesValidas.includes(movimiento.PresentacionID_Presentacion)) {
        throw new Error("Presentación no válida");
    }

    const camposRequeridos = [
        "ProductoID_Producto",
        "PresentacionID_Presentacion",
        "UsuarioID_Usuario",
        "UbicacionID_Ubicacion",
        "cantidad",
        "tipo_movimiento",
        "motivo",
        "observaciones",
    ];

    // ...lógica para crear el movimiento...
};

    if (movimiento.tipo_movimiento === "Salida") {
      camposRequeridos.push("valor_unitario_movimiento");
    }

    const camposFaltantes = camposRequeridos.filter(
      campo => movimiento[campo] === undefined || movimiento[campo] === null || movimiento[campo] === ""
    );

    if (camposFaltantes.length > 0) {
      throw new Error(`Faltan campos requeridos: ${camposFaltantes.join(", ")}`);
    }

    // Verificar movimientos existentes
    const [existingMovements] = await db.query(
      `SELECT * FROM movimiento 
       WHERE ProductoID_Producto = ? AND PresentacionID_Presentacion = ?`,
      [movimiento.ProductoID_Producto, movimiento.PresentacionID_Presentacion]
    );

    if (existingMovements.length > 0) {
      throw new Error("Este producto con esta presentación ya está registrado");
    }

    // Procesar imagen si existe
    if (imagen) {
      const imagenPath = path.relative(
        path.join(__dirname, "../public"),
        imagen.path
      );

      await db.execute(
        "INSERT INTO imagen (imagen_producto, ID_Ubicacion) VALUES (?, ?)",
        [imagenPath, movimiento.UbicacionID_Ubicacion]
      );
    }

    // Obtener producto y validar
    const [productoData] = await db.query(`
      SELECT p.*, e.nombre_estado 
      FROM producto p
      LEFT JOIN estado e ON p.EstadoID_Estado = e.ID_ESTADO
      WHERE p.ID_PRODUCTO = ?
    `, [movimiento.ProductoID_Producto]);
    
    if (!productoData || productoData.length === 0) {
      throw new Error("Producto no encontrado");
    }

    const producto = productoData[0];

    if (movimiento.tipo_movimiento === "Salida" && (producto.nombre_estado === "Inactivo" || producto.EstadoID_Estado === 2)) {
      throw new Error("No se puede realizar salida de un producto inactivo");
    }

    if (movimiento.tipo_movimiento === "Salida") {
      if (!producto.fecha_vencimiento) {
        throw new Error("El producto no tiene fecha de vencimiento definida");
      }
      
      const fechaActual = new Date();
      const fechaVencimiento = new Date(producto.fecha_vencimiento);
      
      fechaActual.setHours(0, 0, 0, 0);
      fechaVencimiento.setHours(0, 0, 0, 0);
      
      if (fechaVencimiento <= fechaActual) {
        throw new Error(`No se puede realizar salida de un producto vencido (fecha de vencimiento: ${producto.fecha_vencimiento})`);
      }
    }

    if (PRESENTACIONES_UNIDADES.includes(movimiento.PresentacionID_Presentacion)) {
      producto.unidades_por_blister = producto.unidades_por_blister || 1;
      if (producto.unidades_por_blister <= 0) {
        throw new Error("El número de unidades por blister debe ser mayor a cero");
      }
    }

    // Crear movimiento
    const fecha_hora_movimiento = new Date().toISOString().slice(0, 19).replace("T", " ");
    let cantidadUnidades = movimiento.cantidad;
    let mensaje = "";

    if (movimiento.tipo_movimiento === "Entrada") {
      if (PRESENTACIONES_UNIDADES.includes(movimiento.PresentacionID_Presentacion)) {
        cantidadUnidades = movimiento.cantidad * producto.unidades_por_blister;
        mensaje = `Se han repuesto ${movimiento.cantidad} blisters de ${producto.nombre}, equivalentes a ${cantidadUnidades} unidades.`;
        producto.cantidad_unidades = (producto.cantidad_unidades || 0) + cantidadUnidades;
      } else if (PRESENTACIONES_FRASCOS.includes(movimiento.PresentacionID_Presentacion)) {
        mensaje = `Se han repuesto ${movimiento.cantidad} frascos/tubos de ${producto.nombre}.`;
        producto.cantidad_frascos = (producto.cantidad_frascos || 0) + movimiento.cantidad;
        cantidadUnidades = movimiento.cantidad;
      }

      const nuevoMovimiento = {
        ProductoID_Producto: movimiento.ProductoID_Producto,
        PresentacionID_Presentacion: movimiento.PresentacionID_Presentacion,
        UsuarioID_Usuario: movimiento.UsuarioID_Usuario,
        UbicacionID_Ubicacion: movimiento.UbicacionID_Ubicacion,
        fecha_hora_movimiento,
        cantidad: cantidadUnidades,
        tipo_movimiento: movimiento.tipo_movimiento,
        motivo: movimiento.motivo,
        observaciones: movimiento.observaciones,
        iva_aplicado: null,
        subtotal: null,
        total_venta: null,
        valor_unitario_movimiento: null,
      };

      const idMovimiento = await createMovimientoModel(nuevoMovimiento);
      await updateProductoStock(
        movimiento.ProductoID_Producto,
        producto.cantidad_unidades,
        producto.cantidad_frascos
      );

      return {
        message: "Movimiento creado correctamente",
        id: idMovimiento,
        mensaje: mensaje,
      };
    } else if (movimiento.tipo_movimiento === "Salida") {
      if (PRESENTACIONES_UNIDADES.includes(movimiento.PresentacionID_Presentacion)) {
        if ((producto.cantidad_unidades || 0) < cantidadUnidades) {
          throw new Error("No hay suficiente stock para realizar la salida");
        }
        producto.cantidad_unidades -= cantidadUnidades;
        mensaje = `Se han vendido ${cantidadUnidades} unidades de ${producto.nombre}.`;
      } else if (PRESENTACIONES_FRASCOS.includes(movimiento.PresentacionID_Presentacion)) {
        if ((producto.cantidad_frascos || 0) < movimiento.cantidad) {
          throw new Error("No hay suficiente stock para realizar la salida");
        }
        producto.cantidad_frascos -= movimiento.cantidad;
        mensaje = `Se han vendido ${movimiento.cantidad} frascos/tubos de ${producto.nombre}.`;
      }

      const subtotal = cantidadUnidades * movimiento.valor_unitario_movimiento;
      const iva_aplicado = subtotal * 0.19;
      const total_venta = subtotal + iva_aplicado;

      const nuevoMovimiento = {
        ProductoID_Producto: movimiento.ProductoID_Producto,
        PresentacionID_Presentacion: movimiento.PresentacionID_Presentacion,
        UsuarioID_Usuario: movimiento.UsuarioID_Usuario,
        UbicacionID_Ubicacion: movimiento.UbicacionID_Ubicacion,
        fecha_hora_movimiento,
        cantidad: cantidadUnidades,
        tipo_movimiento: movimiento.tipo_movimiento,
        motivo: movimiento.motivo,
        observaciones: movimiento.observaciones,
        iva_aplicado,
        subtotal,
        total_venta,
        valor_unitario_movimiento: movimiento.valor_unitario_movimiento,
      };

      const idMovimiento = await createMovimientoModel(nuevoMovimiento);
      await updateProductoStock({
        id: movimiento.ProductoID_Producto,
        cantidad_unidades: producto.cantidad_unidades,
        cantidad_frascos: producto.cantidad_frascos,
      });

      return {
        message: "Movimiento creado correctamente",
        id: idMovimiento,
        mensaje: mensaje,
        imagen: imagen ? imagen.filename : null,
      };
    } else {
      throw new Error("Tipo de movimiento no válido");
    }


export const updateMovimiento = async (id, movimiento) => {
    if (!id) throw new Error('ID es obligatorio');

    const presentacionesValidas = [
        ...(PRESENTACIONES_UNIDADES || []),
        ...(PRESENTACIONES_FRASCOS || [])
    ];

    if (!presentacionesValidas.includes(movimiento.PresentacionID_Presentacion)) {
        throw new Error("Presentación no válida");
    }

    const movimientoActual = await getMovimientoByIdModel(id);
    if (!movimientoActual) {
      throw new Error("Movimiento no encontrado");
    }

    // Obtener producto relacionado
    const [productoData] = await db.query(`
      SELECT p.*, e.nombre_estado 
      FROM producto p
      LEFT JOIN estado e ON p.EstadoID_Estado = e.ID_ESTADO
      WHERE p.ID_PRODUCTO = ?
    `, [movimiento.ProductoID_Producto]);
    
    if (!productoData || productoData.length === 0) {
      throw new Error("Producto no encontrado");
    }

    const producto = productoData[0];

    if (PRESENTACIONES_UNIDADES.includes(movimiento.PresentacionID_Presentacion) && 
        (!producto.unidades_por_blister || producto.unidades_por_blister <= 0)) {
      throw new Error("El producto no tiene definido el número de unidades por blister");
    }

    // Revertir movimiento anterior
    if (movimientoActual.tipo_movimiento === "Entrada") {
      if (PRESENTACIONES_UNIDADES.includes(movimientoActual.PresentacionID_Presentacion)) {
        producto.cantidad_unidades = (producto.cantidad_unidades || 0) - movimientoActual.cantidad;
      } else if (PRESENTACIONES_FRASCOS.includes(movimientoActual.PresentacionID_Presentacion)) {
        producto.cantidad_frascos = (producto.cantidad_frascos || 0) - movimientoActual.cantidad;
      }
    } else if (movimientoActual.tipo_movimiento === "Salida") {
      if (PRESENTACIONES_UNIDADES.includes(movimientoActual.PresentacionID_Presentacion)) {
        producto.cantidad_unidades = (producto.cantidad_unidades || 0) + movimientoActual.cantidad;
      } else if (PRESENTACIONES_FRASCOS.includes(movimientoActual.PresentacionID_Presentacion)) {
        producto.cantidad_frascos = (producto.cantidad_frascos || 0) + movimientoActual.cantidad;
      }
    }

    // Procesar imagen si existe
    if (imagen) {
      const imagenPath = path.relative(
        path.join(__dirname, "../public"),
        imagen.path
      );

      await db.execute(
        "UPDATE imagen SET imagen_producto = ? WHERE ID_Ubicacion = ?",
        [imagenPath, movimiento.UbicacionID_Ubicacion]
      );
    }

    // Crear nuevo movimiento
    let cantidadUnidades = movimiento.cantidad;
    let mensaje = "";
    const fechaActual = new Date().toISOString().slice(0, 19).replace("T", " ");
    let movimientoActualizado = {
      ProductoID_Producto: movimiento.ProductoID_Producto,
      PresentacionID_Presentacion: movimiento.PresentacionID_Presentacion,
      UsuarioID_Usuario: movimiento.UsuarioID_Usuario,
      UbicacionID_Ubicacion: movimiento.UbicacionID_Ubicacion,
      fecha_hora_movimiento: fechaActual,
      tipo_movimiento: movimiento.tipo_movimiento,
      motivo: movimiento.motivo,
      observaciones: movimiento.observaciones,
      iva_aplicado: null,
      subtotal: null,
      total_venta: null,
      valor_unitario_movimiento: null
    };

    if (movimiento.tipo_movimiento === "Entrada") {
      if (PRESENTACIONES_UNIDADES.includes(movimiento.PresentacionID_Presentacion)) {
        cantidadUnidades = movimiento.cantidad * producto.unidades_por_blister;
        producto.cantidad_unidades = (producto.cantidad_unidades || 0) + cantidadUnidades;
        mensaje = `Se han repuesto ${movimiento.cantidad} blisters de ${producto.nombre}, equivalentes a ${cantidadUnidades} unidades.`;
      } else {
        producto.cantidad_frascos = (producto.cantidad_frascos || 0) + movimiento.cantidad;
        cantidadUnidades = movimiento.cantidad;
        mensaje = `Se han repuesto ${movimiento.cantidad} frascos/tubos de ${producto.nombre}.`;
      }

      movimientoActualizado.cantidad = cantidadUnidades;
    } else if (movimiento.tipo_movimiento === "Salida") {
      if (PRESENTACIONES_UNIDADES.includes(movimiento.PresentacionID_Presentacion)) {
        if ((producto.cantidad_unidades || 0) < cantidadUnidades) {
          throw new Error("No hay suficiente stock para realizar la salida");
        }
        producto.cantidad_unidades -= cantidadUnidades;
        mensaje = `Se han vendido ${cantidadUnidades} unidades de ${producto.nombre}.`;
      } else {
        if ((producto.cantidad_frascos || 0) < movimiento.cantidad) {
          throw new Error("No hay suficiente stock para realizar la salida");
        }
        cantidadUnidades = movimiento.cantidad;
        producto.cantidad_frascos -= movimiento.cantidad;
        mensaje = `Se han vendido ${movimiento.cantidad} frascos/tubos de ${producto.nombre}.`;
      }

      const subtotal = cantidadUnidades * movimiento.valor_unitario_movimiento;
      const iva_aplicado = subtotal * 0.19;
      const total_venta = subtotal + iva_aplicado;

      movimientoActualizado.cantidad = cantidadUnidades;
      movimientoActualizado.iva_aplicado = iva_aplicado;
      movimientoActualizado.subtotal = subtotal;
      movimientoActualizado.total_venta = total_venta;
      movimientoActualizado.valor_unitario_movimiento = movimiento.valor_unitario_movimiento;
    }

    const affectedRows = await updateMovimientoModel(id, movimientoActualizado);
    if (affectedRows === 0) {
      throw new Error("Movimiento no encontrado o no se pudo actualizar");
    }

    // Actualizar el stock del producto
    await updateProductoStock(
      movimiento.ProductoID_Producto,
      PRESENTACIONES_UNIDADES.includes(movimiento.PresentacionID_Presentacion) 
        ? producto.cantidad_unidades 
        : undefined,
      PRESENTACIONES_FRASCOS.includes(movimiento.PresentacionID_Presentacion) 
        ? producto.cantidad_frascos 
        : undefined
    );

    return {
      message: "Movimiento actualizado exitosamente",
      mensaje: mensaje
    };
};

export const deleteMovimiento = async (id) => {
    if (!id) throw new Error("ID es obligatorio");

    const [movimiento] = await db.query(
      `SELECT ProductoID_Producto, PresentacionID_Presentacion 
       FROM movimiento WHERE ID_STOCK = ?`,
      [id]
    );

    if (movimiento.length > 0) {
      const { ProductoID_Producto, PresentacionID_Presentacion } = movimiento[0];
      const [count] = await db.query(
        `SELECT COUNT(*) as count FROM movimiento 
         WHERE ProductoID_Producto = ? AND PresentacionID_Presentacion = ?`,
        [ProductoID_Producto, PresentacionID_Presentacion]
      );

      if (count[0].count === 1) {
        throw new Error("No se puede eliminar el único movimiento de este producto con esta presentación");
      }
    }

    await deleteMovimientoModel(id);
};