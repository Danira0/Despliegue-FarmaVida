import db from "../CONFIG/db.js";

export const getMovimientos = async (tipo_movimiento = null) => {
  let query = `
    SELECT 
      m.ID_STOCK,
      p.nombre AS producto,
      pr.nombre_presentacion AS presentacion_nombre,
      u.nombre AS usuario,
      ub.nombre_ubicacion AS ubicacion_nombre,
      m.fecha_hora_movimiento,
      m.cantidad,
      m.cantidad_blister,
      m.unidad_por_blister,
      m.motivo,
      m.tipo_movimiento,
      m.observaciones,
      m.subtotal,
      m.total_venta,
      m.iva_aplicado,
      m.valor_unitario_movimiento,
      m.movimiento_referencia,
      orig.fecha_hora_movimiento AS fecha_movimiento_referencia,
      orig.tipo_movimiento AS tipo_movimiento_referencia
    FROM movimiento m
    JOIN producto p ON m.ProductoID_Producto = p.ID_PRODUCTO
    JOIN presentacion pr ON m.PresentacionID_Presentacion = pr.ID_presentacion
    JOIN usuario u ON m.UsuarioID_Usuario = u.ID_Usuario
    JOIN ubicacion ub ON m.UbicacionID_Ubicacion = ub.ID_Ubicacion
    LEFT JOIN movimiento orig ON m.movimiento_referencia = orig.ID_STOCK
  `;

  if (tipo_movimiento) {
    query += ` WHERE m.tipo_movimiento = ?`;
  }

  query += ` ORDER BY m.fecha_hora_movimiento DESC`;

  const [result] = await db.query(query, tipo_movimiento ? [tipo_movimiento] : []);
  return result;
};

export const getMovimientoById = async (id) => {
  const query = `
    SELECT 
      m.ID_STOCK,
      p.nombre AS producto,
      pr.nombre_presentacion AS presentacion_nombre,
      u.nombre AS usuario,
      ub.nombre_ubicacion AS ubicacion_nombre,
      m.fecha_hora_movimiento,
      m.cantidad,
      m.motivo,
      m.tipo_movimiento,
      m.observaciones,
      m.subtotal,
      m.total_venta,
      m.iva_aplicado,
      m.valor_unitario_movimiento
    FROM movimiento m
    JOIN producto p ON m.ProductoID_Producto = p.ID_PRODUCTO
    JOIN presentacion pr ON m.PresentacionID_Presentacion = pr.ID_presentacion
    JOIN usuario u ON m.UsuarioID_Usuario = u.ID_Usuario
    JOIN ubicacion ub ON m.UbicacionID_Ubicacion = ub.ID_Ubicacion
    WHERE m.ID_STOCK = ?
  `;
  
  try {
    const [movimiento] = await db.query(query, [id]);
    
    if (movimiento.length > 0) {
      const [imagenes] = await db.query(
        `SELECT * FROM imagen WHERE ID_Ubicacion = ?`,
        [id]
      );
      movimiento[0].imagenes = imagenes;
      return movimiento[0];
    }
    return null;
  } catch (error) {
    console.error("Error al obtener el movimiento por ID:", error);
    throw error;
  }
};

export const getEntradas = async () => {
  const query = `
    SELECT 
      p.ID_PRODUCTO,
      p.nombre,
      pr.nombre_presentacion AS presentacion,
      m.cantidad,
      u.nombre AS usuario,
      m.fecha_hora_movimiento AS fecha
    FROM movimiento m
    INNER JOIN producto p ON m.ProductoID_Producto = p.ID_PRODUCTO
    INNER JOIN presentacion pr ON m.PresentacionID_Presentacion = pr.ID_presentacion
    INNER JOIN usuario u ON m.UsuarioID_Usuario = u.ID_Usuario
    WHERE m.tipo_movimiento = 'entrada'
    ORDER BY m.fecha_hora_movimiento DESC
  `;

  try {
    const [entradas] = await db.query(query);
    return entradas;
  } catch (error) {
    console.error('Error en getEntradas:', error);
    throw new Error('Error al obtener las entradas de productos');
  }
};

export const getSalidas = async () => {
  const query = `
    SELECT 
      m.ID_STOCK,
      p.nombre AS 'Nombre del producto',
      pr.nombre_presentacion AS 'Presentación',
      m.cantidad AS 'Cantidad',
      u.nombre AS 'Usuario',
      m.iva_aplicado AS 'IVA',
      m.subtotal AS 'Subtotal',
      m.total_venta AS 'Total Venta',
      m.valor_unitario_movimiento AS 'Valor Unitario',
      m.fecha_hora_movimiento AS 'Fecha y Hora'
    FROM movimiento m
    JOIN producto p ON m.ProductoID_Producto = p.ID_PRODUCTO
    JOIN presentacion pr ON m.PresentacionID_Presentacion = pr.ID_presentacion
    JOIN usuario u ON m.UsuarioID_Usuario = u.ID_Usuario
    WHERE m.tipo_movimiento = 'Salida'
    ORDER BY m.fecha_hora_movimiento DESC
  `;

  try {
    const [salidas] = await db.query(query);
    return salidas;
  } catch (error) {
    console.error('Error en getSalidas:', error);
    throw new Error('Error al obtener las salidas de productos');
  }
};

export const createMovimiento = async (movimiento) => {
  const {
      ProductoID_Producto,
      PresentacionID_Presentacion,
      UsuarioID_Usuario,
      UbicacionID_Ubicacion,
      cantidad = null,
      cantidad_blister = null,
      unidad_por_blister = null,
      fecha_hora_movimiento,
      tipo_movimiento,
      motivo,
      observaciones,
      iva_aplicado = null,
      subtotal = null,
      total_venta = null,
      valor_unitario_movimiento = null,
      movimiento_referencia = null
  } = movimiento;

  const query = `
    INSERT INTO movimiento (
      ProductoID_Producto,
      PresentacionID_Presentacion,
      UsuarioID_Usuario,
      UbicacionID_Ubicacion,
      cantidad,
      cantidad_blister,
      unidad_por_blister,
      fecha_hora_movimiento,
      tipo_movimiento,
      motivo,
      observaciones,
      iva_aplicado,
      subtotal,
      total_venta,
      valor_unitario_movimiento,
      movimiento_referencia
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const [result] = await db.execute(query, [
    ProductoID_Producto,
    PresentacionID_Presentacion,
    UsuarioID_Usuario,
    UbicacionID_Ubicacion,
    cantidad,
    cantidad_blister,
    unidad_por_blister,
    fecha_hora_movimiento,
    tipo_movimiento,
    motivo,
    observaciones,
    iva_aplicado,
    subtotal,
    total_venta,
    valor_unitario_movimiento,
    movimiento_referencia
  ]);

  return result.insertId;
};

export const updateMovimiento = async (id, movimiento) => {
  // Validar que el ID no sea undefined o null
  if (!id) {
    throw new Error("ID de movimiento es requerido");
  }

  // Preparar los parámetros asegurando que no haya undefined
  const params = {
    ProductoID_Producto: movimiento.ProductoID_Producto ?? null,
    PresentacionID_Presentacion: movimiento.PresentacionID_Presentacion ?? null,
    UsuarioID_Usuario: movimiento.UsuarioID_Usuario ?? null,
    UbicacionID_Ubicacion: movimiento.UbicacionID_Ubicacion ?? null,
    cantidad: movimiento.cantidad ?? null,
    unidad_por_blister: movimiento.unidad_por_blister ?? null,
    cantidad_blister: movimiento.cantidad_blister ?? null,
    fecha_hora_movimiento: movimiento.fecha_hora_movimiento ?? new Date().toISOString().slice(0, 19).replace('T', ' '),
    tipo_movimiento: movimiento.tipo_movimiento ?? null,
    motivo: movimiento.motivo ?? null,
    observaciones: movimiento.observaciones ?? null,
    iva_aplicado: movimiento.iva_aplicado ?? null,
    subtotal: movimiento.subtotal ?? null,
    total_venta: movimiento.total_venta ?? null,
    valor_unitario_movimiento: movimiento.valor_unitario_movimiento ?? null
  };

  const query = `
    UPDATE movimiento
    SET
      ProductoID_Producto = ?,
      PresentacionID_Presentacion = ?,
      UsuarioID_Usuario = ?,
      UbicacionID_Ubicacion = ?,
      cantidad = ?,
      unidad_por_blister = ?,
      cantidad_blister = ?,
      fecha_hora_movimiento = ?,
      tipo_movimiento = ?,
      motivo = ?,
      observaciones = ?,
      iva_aplicado = ?,
      subtotal = ?,
      total_venta = ?,
      valor_unitario_movimiento = ?
    WHERE ID_STOCK = ?
  `;

  try {
    const [result] = await db.execute(query, [
      params.ProductoID_Producto,
      params.PresentacionID_Presentacion,
      params.UsuarioID_Usuario,
      params.UbicacionID_Ubicacion,
      params.cantidad,
      params.unidad_por_blister,
      params.cantidad_blister,
      params.fecha_hora_movimiento,
      params.tipo_movimiento,
      params.motivo,
      params.observaciones,
      params.iva_aplicado,
      params.subtotal,
      params.total_venta,
      params.valor_unitario_movimiento,
      id
    ]);

    if (result.affectedRows === 0) {
      throw new Error("No se encontró el movimiento o no se realizaron cambios");
    }

    return result.affectedRows;
  } catch (error) {
    console.error("Error en updateMovimiento:", error);
    throw error; // Re-lanzar el error para manejarlo en el controlador
  }
};

export const deleteMovimiento = async (id) => {
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

  // Si no es único, proceder con la eliminación
  const query = `DELETE FROM movimiento WHERE ID_STOCK = ?`;
  const [result] = await db.execute(query, [id]);
  return result.affectedRows;
};