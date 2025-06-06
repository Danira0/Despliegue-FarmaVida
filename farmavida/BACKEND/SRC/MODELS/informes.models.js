import db from '../CONFIG/db.js';

export const getProductos = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT p.*, c.nombre_categoria, l.nombre as nombre_laboratorio,
      pr.nombre_presentacion, e.nombre_estado,
      (
        SELECT SUM(CASE 
          WHEN m.tipo_movimiento = 'Entrada' THEN m.cantidad 
          WHEN m.tipo_movimiento = 'Salida' THEN -m.cantidad 
          WHEN m.tipo_movimiento = 'Ajuste' THEN m.cantidad 
          WHEN m.tipo_movimiento = 'Devolucion' THEN m.cantidad 
          WHEN m.tipo_movimiento = 'Descarte' THEN -m.cantidad
          ELSE 0 
        END) 
        FROM movimiento m 
        WHERE m.ProductoID_Producto = p.ID_PRODUCTO
      ) AS stock_actual
      FROM producto p
      LEFT JOIN categoria c ON p.CategoriaID_Categoria = c.ID_Categoria
      LEFT JOIN laboratorio l ON p.LaboratorioID_Laboratorio = l.ID_Laboratorio
      LEFT JOIN presentacion pr ON p.PresentacionID_Presentacion = pr.ID_Presentacion
      LEFT JOIN estado e ON p.EstadoID_Estado = e.ID_ESTADO
    `;
    db.query(query, (err, result) => err ? reject(err) : resolve(result));
  });
};
  
  export const getProductosPorVencer = (diasLimite = 90) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT p.*, c.nombre_categoria, l.nombre as nombre_laboratorio, pr.nombre_presentacion, e.nombre_estado,
        DATEDIFF(p.fecha_vencimiento, CURRENT_DATE()) as dias_para_vencer
        FROM producto p 
        LEFT JOIN categoria c ON p.CategoriaID_Categoria = c.ID_Categoria 
        LEFT JOIN laboratorio l ON p.LaboratorioID_Laboratorio = l.ID_Laboratorio 
        LEFT JOIN presentacion pr ON p.PresentacionID_Presentacion = pr.ID_Presentacion 
        LEFT JOIN estado e ON p.EstadoID_Estado = e.ID_ESTADO
        WHERE DATEDIFF(p.fecha_vencimiento, CURRENT_DATE()) <= ?
        ORDER BY p.fecha_vencimiento ASC
      `;
      db.query(query, [diasLimite], (err, result) => err ? reject(err) : resolve(result));
    });
  };
  
  export const getProductosEnStock = () => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          p.*, 
          c.nombre_categoria, 
          l.nombre as nombre_laboratorio, 
          pr.nombre_presentacion, 
          pr.ID_Presentacion as id_presentacion,
          e.nombre_estado,
          CASE 
            WHEN pr.ID_Presentacion IN (1, 2) THEN p.cantidad_unidades
            WHEN pr.ID_Presentacion IN (3, 4, 5, 6) THEN p.cantidad_frascos
            ELSE 0
          END AS stock_actual,
          p.stock_minimo
        FROM producto p 
        LEFT JOIN categoria c ON p.CategoriaID_Categoria = c.ID_Categoria 
        LEFT JOIN laboratorio l ON p.LaboratorioID_Laboratorio = l.ID_Laboratorio 
        LEFT JOIN presentacion pr ON p.PresentacionID_Presentacion = pr.ID_Presentacion 
        LEFT JOIN estado e ON p.EstadoID_Estado = e.ID_ESTADO
        WHERE (pr.ID_Presentacion IN (1, 2) AND p.cantidad_unidades > 0)
           OR (pr.ID_Presentacion IN (3, 4, 5, 6) AND p.cantidad_frascos > 0)
        ORDER BY p.nombre ASC
      `;
      db.query(query, (err, result) => err ? reject(err) : resolve(result));
    });
  };
  
  export const getProductosPorFechaIngreso = (fechaInicio, fechaFin) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          p.*, 
          c.nombre_categoria, 
          l.nombre as nombre_laboratorio, 
          pr.nombre_presentacion, 
          e.nombre_estado
        FROM producto p 
        LEFT JOIN categoria c ON p.CategoriaID_Categoria = c.ID_Categoria 
        LEFT JOIN laboratorio l ON p.LaboratorioID_Laboratorio = l.ID_Laboratorio 
        LEFT JOIN presentacion pr ON p.PresentacionID_Presentacion = pr.ID_Presentacion 
        LEFT JOIN estado e ON p.EstadoID_Estado = e.ID_ESTADO
        WHERE p.fecha_entrada BETWEEN ? AND ?
        ORDER BY p.fecha_entrada DESC
      `;
      db.query(query, [fechaInicio, fechaFin], (err, result) => err ? reject(err) : resolve(result));
    });
  };
  
  // Informes de movimientos
  export const getMovimientos = () => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT m.*, p.nombre as nombre_producto, pr.nombre_presentacion, 
        u.nombre_usuario, ub.nombre_ubicacion
        FROM movimiento m
        LEFT JOIN producto p ON m.ProductoID_Producto = p.ID_PRODUCTO
        LEFT JOIN presentacion pr ON m.PresentacionID_Presentacion = pr.ID_Presentacion
        LEFT JOIN usuario u ON m.UsuarioID_Usuario = u.ID_Usuario
        LEFT JOIN ubicacion ub ON m.UbicacionID_Ubicacion = ub.ID_Ubicacion
        ORDER BY m.fecha_hora_movimiento DESC
      `;
      db.query(query, (err, result) => err ? reject(err) : resolve(result));
    });
  };
  
  export const getMovimientosPorUsuario = (usuarioId) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          m.ID_STOCK,
          m.fecha_hora_movimiento,
          m.cantidad,
          m.tipo_movimiento,
          m.observaciones as detalle_movimiento,
          p.lote,
          p.nombre as nombre_producto,
          pr.nombre_presentacion,
          u.nombre_usuario,
          u.apellido as apellido_usuario,
          ub.nombre_ubicacion,
          p.codigo_barras
        FROM movimiento m
        LEFT JOIN producto p ON m.ProductoID_Producto = p.ID_PRODUCTO
        LEFT JOIN presentacion pr ON m.PresentacionID_Presentacion = pr.ID_Presentacion
        LEFT JOIN usuario u ON m.UsuarioID_Usuario = u.ID_Usuario
        LEFT JOIN ubicacion ub ON m.UbicacionID_Ubicacion = ub.ID_Ubicacion
        WHERE m.UsuarioID_Usuario = ?
        ORDER BY m.fecha_hora_movimiento DESC
      `;
      
      db.query(query, [usuarioId], (err, result) => {
        if (err) {
          console.error('Error en la consulta de movimientos por usuario:', err);
          reject(new Error('Error al consultar la base de datos'));
        } else {
          resolve(result);
        }
      });
    });
};

  export const getMovimientosPorFecha = (fechaInicio, fechaFin) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          m.ID_STOCK,
          m.fecha_hora_movimiento,
          m.cantidad AS cantidad_movimiento,
          m.tipo_movimiento,
          m.motivo,
          m.observaciones AS detalle_movimiento,
          p.nombre AS nombre_producto, 
          pr.nombre_presentacion, 
          u.nombre_usuario, 
          u.apellido,
          ub.nombre_ubicacion
        FROM movimiento m
        LEFT JOIN producto p ON m.ProductoID_Producto = p.ID_PRODUCTO
        LEFT JOIN presentacion pr ON m.PresentacionID_Presentacion = pr.ID_Presentacion
        LEFT JOIN usuario u ON m.UsuarioID_Usuario = u.ID_Usuario
        LEFT JOIN ubicacion ub ON m.UbicacionID_Ubicacion = ub.ID_Ubicacion
        WHERE DATE(m.fecha_hora_movimiento) BETWEEN ? AND ?
        ORDER BY m.fecha_hora_movimiento DESC
      `;
      db.query(query, [fechaInicio, fechaFin], (err, result) => err ? reject(err) : resolve(result));
    });
  };
  
  export const getMovimientosPorProducto = (productoId) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT m.*, p.nombre as nombre_producto, pr.nombre_presentacion, 
        u.nombre_usuario, ub.nombre_ubicacion
        FROM movimiento m
        LEFT JOIN producto p ON m.ProductoID_Producto = p.ID_PRODUCTO
        LEFT JOIN presentacion pr ON m.PresentacionID_Presentacion = pr.ID_Presentacion
        LEFT JOIN usuario u ON m.UsuarioID_Usuario = u.ID_Usuario
        LEFT JOIN ubicacion ub ON m.UbicacionID_Ubicacion = ub.ID_Ubicacion
        WHERE m.ProductoID_Producto = ?
        ORDER BY m.fecha_hora_movimiento DESC
      `;
      db.query(query, [productoId], (err, result) => err ? reject(err) : resolve(result));
    });
  };
  
  export const getMovimientosPorTipo = (tipo) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT m.*, p.nombre as nombre_producto, pr.nombre_presentacion, 
        u.nombre_usuario, ub.nombre_ubicacion
        FROM movimiento m
        LEFT JOIN producto p ON m.ProductoID_Producto = p.ID_PRODUCTO
        LEFT JOIN presentacion pr ON m.PresentacionID_Presentacion = pr.ID_Presentacion
        LEFT JOIN usuario u ON m.UsuarioID_Usuario = u.ID_Usuario
        LEFT JOIN ubicacion ub ON m.UbicacionID_Ubicacion = ub.ID_Ubicacion
        WHERE m.tipo_movimiento = ?
        ORDER BY m.fecha_hora_movimiento DESC
      `;
      db.query(query, [tipo], (err, result) => err ? reject(err) : resolve(result));
    });
  };
  
  // Informes de laboratorios
  export const getLaboratorios = () => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM laboratorio', (err, result) => err ? reject(err) : resolve(result));
    });
  };
  
  export const getLaboratorioPorId = (laboratorioId) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM laboratorio WHERE ID_Laboratorio = ?', [laboratorioId], (err, result) => {
        if (err) reject(err);
        else resolve(result[0]);
      });
    });
  };
  
// En informe.model.js
export const getProductosPorLaboratorio = (laboratorioId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        p.ID_PRODUCTO,
        p.nombre,
        p.valor_unitario,
        p.stock,
        c.nombre_categoria, 
        pr.nombre_presentacion, 
        e.nombre_estado, 
        l.nombre as nombre_laboratorio,
        l.ID_Laboratorio as LaboratorioID_Laboratorio
      FROM producto p 
      INNER JOIN laboratorio l ON p.LaboratorioID_Laboratorio = l.ID_Laboratorio
      LEFT JOIN categoria c ON p.CategoriaID_Categoria = c.ID_Categoria 
      LEFT JOIN presentacion pr ON p.PresentacionID_Presentacion = pr.ID_Presentacion 
      LEFT JOIN estado e ON p.EstadoID_Estado = e.ID_ESTADO
      WHERE p.LaboratorioID_Laboratorio = ?
      ORDER BY p.nombre ASC
    `;
    
    db.query(query, [laboratorioId], (err, result) => {
      if (err) {
        console.error('Error en getProductosPorLaboratorio:', err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};
  
  // Informes de usuarios
export const getUsuarios = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        u.ID_Usuario,
        u.nombre,
        u.apellido,
        u.correo AS email,
        r.descripcion AS rol_descripcion
      FROM usuario u
      LEFT JOIN rol r ON u.ROLID_ROL = r.ID_ROL
    `;
    db.query(query, (err, result) => err ? reject(err) : resolve(result));
  });
};
  
  export const getUsuarioPorId = (usuarioId) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM usuario WHERE ID_Usuario = ?', [usuarioId], (err, result) => {
        if (err) reject(err);
        else resolve(result[0]);
      });
    });
  };

  export const getUsuariosPorRol = (rolId) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          u.ID_Usuario,
          u.nombre,
          u.apellido,
          u.correo,
          u.nombre_usuario,
          u.fecha_registro,
          r.descripcion as rol_descripcion,
          COUNT(m.ID_STOCK) as total_movimientos
        FROM usuario u
        LEFT JOIN rol r ON u.ROLID_ROL = r.ID_ROL
        LEFT JOIN movimiento m ON u.ID_Usuario = m.UsuarioID_Usuario
        WHERE u.ROLID_ROL = ?
        GROUP BY u.ID_Usuario
        ORDER BY u.nombre ASC
      `;
      db.query(query, [rolId], (err, result) => err ? reject(err) : resolve(result));
    });
  };
  