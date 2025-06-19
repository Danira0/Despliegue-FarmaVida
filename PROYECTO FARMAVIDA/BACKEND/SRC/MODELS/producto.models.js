import db from '../CONFIG/db.js';

export const getProductoById = async (id) => {
  try {
    const [producto] = await db.query(
      `SELECT * FROM producto WHERE ID_PRODUCTO = ?`,
      [id]
    );
    if (producto.length > 0) {
      const [imagenes] = await db.query(
        `SELECT * FROM imagen WHERE ID_Producto = ?`,
        [id]
      );
      producto[0].imagenes = imagenes;
      return producto[0];
    }
    return null;
  } catch (error) {
    console.error("Error al obtener el producto por ID:", error);
    throw error;
  }
};

export const getProductos = async (nombre, tipo) => {
  try {
    let query = `
      SELECT 
        p.ID_PRODUCTO,
        p.nombre,
        p.descripcion,
        p.fecha_entrada,
        p.valor_unitario,
        c.nombre_categoria AS categoria_nombre,
        pr.nombre_presentacion AS presentacion_nombre,
        l.nombre AS laboratorio_nombre,
        es.nombre_estado AS estado_nombre,
        p.stock_minimo,
        p.fecha_actualizacion,
        p.unidades_por_blister,
        p.cantidad_blister,
        p.cantidad_unidades,  
        p.contenido_neto,
        p.cantidad_frascos,
        p.lote,
        p.fecha_vencimiento,
        p.codigo_barras,
        p.IVA,
        i.imagen_producto
      FROM producto p
      JOIN categoria c ON p.CategoriaID_Categoria = c.ID_Categoria
      JOIN presentacion pr ON p.PresentacionID_Presentacion = pr.ID_Presentacion
      JOIN laboratorio l ON p.LaboratorioID_Laboratorio = l.ID_Laboratorio
      JOIN estado es ON p.EstadoID_Estado = es.ID_Estado
      LEFT JOIN imagen i ON p.ID_PRODUCTO = i.ID_Producto
      WHERE 1=1
    `;

    const params = [];

    if (nombre) {
      query += ' AND p.nombre LIKE ?';
      params.push(`%${nombre}%`);
    }

    if (tipo) {
      query += ' AND c.nombre_categoria = ?';
      params.push(tipo);
    }

    const [rows] = await db.query(query, params);
    return rows;
  } catch (error) {
    console.error("Error al obtener productos:", error);
    throw error;
  }
};

export const getNombresLaboratorios = async () => {
  try {
    const [rows] = await db.query(
      'SELECT ID_Laboratorio, nombre FROM laboratorio ORDER BY nombre'
    );
    return rows;
  } catch (error) {
    console.error("Error al obtener nombres de laboratorios:", error);
    throw error;
  }
};

export const getProductoByNombrePresentacion = async (nombre, presentacionId) => {
  const [rows] = await db.query(
    `SELECT * FROM producto WHERE nombre = ? AND PresentacionID_Presentacion = ?`, 
    [nombre, presentacionId]
  );
  return rows.length > 0 ? rows[0] : null;
};

export const createProducto = async (producto) => {
  const {
    nombre,
    descripcion,
    fecha_entrada,            
    fecha_actualizacion,
    valor_unitario,
    CategoriaID_Categoria,
    LaboratorioID_Laboratorio,
    PresentacionID_Presentacion,
    EstadoID_Estado,
    stock_minimo,
    unidades_por_blister,
    cantidad_blister,
    contenido_neto,
    cantidad_frascos,
    lote,
    fecha_vencimiento,
    IVA,
    codigo_barras,
  } = producto;

  const cantidad_unidades = unidades_por_blister ? unidades_por_blister * cantidad_blister : null;

  const query = `
    INSERT INTO producto (
      nombre, descripcion, fecha_entrada, fecha_actualizacion, valor_unitario, 
      CategoriaID_Categoria, LaboratorioID_Laboratorio, PresentacionID_Presentacion, EstadoID_Estado, stock_minimo, 
      unidades_por_blister, cantidad_blister, cantidad_unidades, 
      contenido_neto, cantidad_frascos, codigo_barras, lote, IVA, fecha_vencimiento
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const [result] = await db.execute(query, [
    nombre,
    descripcion,
    fecha_entrada,
    fecha_actualizacion,
    valor_unitario,
    CategoriaID_Categoria,
    LaboratorioID_Laboratorio,
    PresentacionID_Presentacion,
    EstadoID_Estado,
    stock_minimo,
    unidades_por_blister || null,
    cantidad_blister || null,
    cantidad_unidades || null,
    contenido_neto || null,
    cantidad_frascos || null,
    codigo_barras || null,
    lote,
    IVA,
    fecha_vencimiento,
  ]);

  return result.insertId;
};

export const updateProducto = async (id, producto) => {
  try {
    const camposActualizar = {};
    
    if (producto.nombre !== undefined) camposActualizar.nombre = producto.nombre;
    if (producto.descripcion !== undefined) camposActualizar.descripcion = producto.descripcion;
    if (producto.fecha_entrada !== undefined) camposActualizar.fecha_entrada = producto.fecha_entrada;
    if (producto.valor_unitario !== undefined) camposActualizar.valor_unitario = producto.valor_unitario;
    if (producto.CategoriaID_Categoria !== undefined) camposActualizar.CategoriaID_Categoria = producto.CategoriaID_Categoria;
    if (producto.LaboratorioID_Laboratorio !== undefined) camposActualizar.LaboratorioID_Laboratorio = producto.LaboratorioID_Laboratorio;
    if (producto.PresentacionID_Presentacion !== undefined) camposActualizar.PresentacionID_Presentacion = producto.PresentacionID_Presentacion;
    if (producto.EstadoID_Estado !== undefined) camposActualizar.EstadoID_Estado = producto.EstadoID_Estado;
    if (producto.stock_minimo !== undefined) camposActualizar.stock_minimo = producto.stock_minimo;
    camposActualizar.fecha_actualizacion = producto.fecha_actualizacion || new Date();
    
    if (producto.unidades_por_blister !== undefined) camposActualizar.unidades_por_blister = producto.unidades_por_blister ?? null;
    if (producto.cantidad_blister !== undefined) camposActualizar.cantidad_blister = producto.cantidad_blister ?? null;
    
    if (producto.cantidad_unidades !== undefined) {
      camposActualizar.cantidad_unidades = producto.cantidad_unidades;
    }
    
    if (producto.cantidad_frascos !== undefined) {
      camposActualizar.cantidad_frascos = producto.cantidad_frascos;
    }
    
    if (producto.contenido_neto !== undefined) camposActualizar.contenido_neto = producto.contenido_neto ?? null;
    if (producto.lote !== undefined) camposActualizar.lote = producto.lote;
    if (producto.IVA !== undefined) camposActualizar.IVA = producto.IVA ?? null;
    if (producto.fecha_vencimiento !== undefined) camposActualizar.fecha_vencimiento = producto.fecha_vencimiento;
    if (producto.codigo_barras !== undefined) camposActualizar.codigo_barras = producto.codigo_barras ?? null;

    if (Object.keys(camposActualizar).length === 0) {
      return 0;
    }

    const setClauses = [];
    const values = [];
    
    for (const [key, value] of Object.entries(camposActualizar)) {
      setClauses.push(`${key} = ?`);
      values.push(value);
    }
    
    values.push(id); 

    const query = `UPDATE producto SET ${setClauses.join(', ')} WHERE ID_PRODUCTO = ?`;
    
    const [result] = await db.execute(query, values);
    
    return result.affectedRows;
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    throw error;
  }
};

export const eliminarImagenesDeProducto = async (idProducto) => {
  try {
    const [result] = await db.execute(
      "DELETE FROM imagen WHERE ID_Producto = ?",
      [idProducto]
    );
    return result.affectedRows;
  } catch (error) {
    console.error("Error al eliminar las imágenes del producto:", error);
    throw error;
  }
};

export const verificarDatosRelacionados = async (idProducto) => {
  try {
    const [movimientos] = await db.query(
      `SELECT COUNT(*) as count FROM movimiento WHERE ProductoID_Producto = ?`,
      [idProducto]
    );
    
    const [producto] = await db.query(
      `SELECT cantidad_unidades, cantidad_frascos FROM producto WHERE ID_PRODUCTO = ?`,
      [idProducto]
    );
    
    const tieneMovimientos = movimientos[0].count > 0;
    const tieneInventario = (producto[0]?.cantidad_unidades > 10 || producto[0]?.cantidad_frascos > 5);
    return tieneMovimientos || tieneInventario;
  } catch (error) {
    console.error("Error al verificar datos relacionados:", error);
    return true;
  }
};

export const deleteProducto = async (id) => {
  try {
    const puedeEliminar = !(await verificarDatosRelacionados(id));
    
    if (!puedeEliminar) {
      throw new Error("El producto tiene datos importantes y no puede ser eliminado");
    }

    await eliminarImagenesDeProducto(id);
    
    await db.execute("DELETE FROM movimiento WHERE ProductoID_Producto = ?", [id]);
    const [result] = await db.execute("DELETE FROM producto WHERE ID_PRODUCTO = ?", [id]);
    
    return result.affectedRows;
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    throw error;
  }
};

export const getProductosProximosAVencer = async () => {
  try {
    const [result] = await db.query(
      `SELECT 
        p.ID_PRODUCTO,
        p.nombre,
        p.fecha_vencimiento
      FROM producto p
      WHERE p.fecha_vencimiento BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)`
    );
    return result;
  } catch (error) {
    console.error("Error al obtener productos próximos a vencer:", error);
    throw error;
  }
};

export const getProductosBajoStock = async () => {
  const [productos] = await db.query(`
    SELECT 
      p.ID_PRODUCTO,
      p.nombre,
      p.stock_minimo,
      p.PresentacionID_Presentacion,
      p.cantidad_unidades,
      p.cantidad_frascos,
      CASE 
        WHEN p.PresentacionID_Presentacion IN (1, 2) THEN 
          -- Para tabletas y cápsulas (presentaciones 1 y 2)
          COALESCE(p.cantidad_unidades, 0)
        WHEN p.PresentacionID_Presentacion IN (3, 4, 5, 6) THEN 
          -- Para jarabe, gotas, crema e inyectable (presentaciones 3, 4, 5, 6)
          COALESCE(p.cantidad_frascos, 0)
        ELSE 
          0
      END AS stock_actual
    FROM 
      producto p
    WHERE
      p.stock_minimo > 0  -- Solo productos con stock mínimo definido
  `);
  
  return productos.filter(producto => {
    // Solo considerar productos con stock actual calculado y menor al mínimo
    return producto.stock_actual !== null && 
           producto.stock_actual < producto.stock_minimo;
  });
};