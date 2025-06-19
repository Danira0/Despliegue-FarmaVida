import db from '../CONFIG/db.js';
import * as productoModel from '../MODELS/producto.models.js';
import path from 'path';
import fs from 'fs';
import nodemailer from 'nodemailer';

const EMAIL_USER = process.env.EMAIL_USER || "daniracyber@gmail.com";
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || "qtgw kigb jcsw lpzo";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});

export const getNombresLaboratorios = async () => {
  return await productoModel.getNombresLaboratorios();
};

export const getProductos = async (nombre, tipo) => {
  return await productoModel.getProductos(nombre, tipo);
};

export const getProductoById = async (id) => {
  return await productoModel.getProductoById(id);
};

export const createProducto = async (producto, imagen) => {
  const camposRequeridos = [
    "nombre",
    "valor_unitario",
    "fecha_entrada",
    "CategoriaID_Categoria",
    "LaboratorioID_Laboratorio",
    "PresentacionID_Presentacion",
    "EstadoID_Estado",
    "stock_minimo",
    "lote",
    "fecha_vencimiento"
  ];

  const camposFaltantes = camposRequeridos.filter(campo => !producto[campo]);

  if (camposFaltantes.length > 0) {
    const error = new Error("Todos los campos obligatorios deben estar presentes");
    error.status = 400;
    error.details = { camposFaltantes };
    throw error;
  }

  const productoExistente = await productoModel.getProductoByNombrePresentacion(
    producto.nombre,
    producto.PresentacionID_Presentacion
  );
  
  if (productoExistente) {
    const error = new Error("Este producto ya existe en la base de datos con la misma presentación.");
    error.status = 400;
    throw error;
  }

  const fechaVencimiento = new Date(producto.fecha_vencimiento);
  const fechaActual = new Date();

  if (fechaVencimiento < fechaActual) {
    const error = new Error("La fecha de vencimiento no puede ser anterior a la fecha actual");
    error.status = 400;
    throw error;
  }

  producto.fecha_actualizacion = new Date();
  const idProducto = await productoModel.createProducto(producto);
  
  if (imagen) {
    const imagenPath = path.relative(path.join(process.cwd(), 'public'), imagen.path);
    
    await db.execute(
      'INSERT INTO imagen (imagen_producto, ID_Producto) VALUES (?, ?)',
      [imagenPath, idProducto]
    );
  }

  return {
    message: "Producto creado correctamente",
    id: idProducto,
    imagen: imagen ? imagen.filename : null,
  };
};

export const updateProducto = async (id, producto, imagen) => {
  const productoExistente = await productoModel.getProductoById(id);
  if (!productoExistente) {
    const error = new Error("Producto no encontrado");
    error.status = 404;
    throw error;
  }

  const camposRequeridos = [
    "nombre",
    "descripcion",
    "valor_unitario",
    "fecha_entrada",
    "CategoriaID_Categoria",
    "LaboratorioID_Laboratorio",
    "PresentacionID_Presentacion",
    "EstadoID_Estado",
    "stock_minimo",
    "lote",
    "fecha_vencimiento",
  ];

  if (producto.PresentacionID_Presentacion !== 1 && producto.PresentacionID_Presentacion !== 2) {
    camposRequeridos.push("cantidad_unidades");
  }

  if (producto.PresentacionID_Presentacion === 3 || producto.PresentacionID_Presentacion === 4 || producto.PresentacionID_Presentacion === 5) {
    camposRequeridos.push("cantidad_frascos");
  }

  const camposFaltantes = camposRequeridos.filter(
    campo => producto[campo] === undefined || producto[campo] === null || producto[campo] === ''
  );

  if (camposFaltantes.length > 0) {
    const error = new Error("Todos los campos obligatorios deben estar presentes");
    error.status = 400;
    error.details = { camposFaltantes };
    throw error;
  }

  const fechaVencimiento = new Date(producto.fecha_vencimiento);
  const fechaActual = new Date();
  if (fechaVencimiento < fechaActual) {
    const error = new Error("La fecha de vencimiento no puede ser anterior a la fecha actual");
    error.status = 400;
    throw error;
  }

  if (imagen) {
    const imagenPath = path.relative(path.join(process.cwd(), 'public'), imagen.path);
    
    const [existingImage] = await db.query(
      'SELECT * FROM imagen WHERE ID_Producto = ?', 
      [id]
    );

    if (existingImage.length > 0) {
      try {
        const oldImagePath = path.join(process.cwd(), 'public', existingImage[0].imagen_producto);
        fs.unlinkSync(oldImagePath);
      } catch (err) {
        console.error('Error al eliminar imagen anterior:', err);
      }

      await db.execute(
        'UPDATE imagen SET imagen_producto = ? WHERE ID_Producto = ?',
        [imagenPath, id]
      );
    } else {
      await db.execute(
        'INSERT INTO imagen (imagen_producto, ID_Producto) VALUES (?, ?)',
        [imagenPath, id]
      );
    }
  }

  const cleanProducto = {
    ...producto,
    fecha_actualizacion: new Date()
  };

  const affectedRows = await productoModel.updateProducto(id, cleanProducto);
  if (affectedRows === 0) {
    const error = new Error("No se pudo actualizar el producto");
    error.status = 400;
    throw error;
  }

  return {
    message: "Producto actualizado correctamente",
    imagen: imagen ? imagen.filename : null
  };
};

export const updateProductoStock = async (id, cantidad_unidades, cantidad_frascos, cantidad_blister) => {
  const updateData = {
    fecha_actualizacion: new Date()
  };

  // Solo actualizar los campos que no son null/undefined
  if (cantidad_unidades !== undefined) {
    updateData.cantidad_unidades = cantidad_unidades;
  }
  
  if (cantidad_frascos !== undefined) {
    updateData.cantidad_frascos = cantidad_frascos;
  }

  if (cantidad_blister !== undefined) {
    updateData.cantidad_blister = cantidad_blister;
  }

  const query = `
    UPDATE producto 
    SET 
      ${updateData.cantidad_unidades !== undefined ? 'cantidad_unidades = ?, ' : ''}
      ${updateData.cantidad_frascos !== undefined ? 'cantidad_frascos = ?, ' : ''}
      ${updateData.cantidad_blister !== undefined ? 'cantidad_blister = ?, ' : ''}
      fecha_actualizacion = ?
    WHERE ID_PRODUCTO = ?
  `;

  const params = [];
  if (updateData.cantidad_unidades !== undefined) params.push(updateData.cantidad_unidades);
  if (updateData.cantidad_frascos !== undefined) params.push(updateData.cantidad_frascos);
  if (updateData.cantidad_blister !== undefined) params.push(updateData.cantidad_blister);
  params.push(updateData.fecha_actualizacion, id);

  const [result] = await db.execute(query, params);
  
  if (result.affectedRows === 0) {
    const error = new Error("No se pudo actualizar el stock del producto");
    error.status = 400;
    throw error;
  }
  
  return { 
    success: true, 
    affectedRows: result.affectedRows 
  };
};


export const deleteProducto = async (id) => {
  if (!id) {
    const error = new Error("El ID es obligatorio");
    error.status = 400;
    throw error;
  }

  const tieneDatosRelacionados = await productoModel.verificarDatosRelacionados(id);
  if (tieneDatosRelacionados) {
    const error = new Error("No se puede eliminar el producto porque tiene datos relacionados");
    error.status = 400;
    error.details = "Este producto cuenta con información primordial asociada que no puede ser eliminada";
    throw error;
  }

  const [imagen] = await db.query(
    'SELECT imagen_producto FROM imagen WHERE ID_Producto = ?',
    [id]
  );

  if (imagen.length > 0) {
    try {
      const imagenPath = path.join(process.cwd(), 'public', imagen[0].imagen_producto);
      fs.unlinkSync(imagenPath);
    } catch (err) {
      console.error('Error al eliminar archivo de imagen:', err);
    }
  }

  await productoModel.eliminarImagenesDeProducto(id);

  const affectedRows = await productoModel.deleteProducto(id);
  if (affectedRows === 0) {
    const error = new Error("Producto no encontrado");
    error.status = 404;
    throw error;
  }

  return { message: "Producto eliminado exitosamente" };
};


const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const sendEmailAlert = (productos) => {
  const htmlContent = `
    <h2>Alerta: Medicamentos próximos a vencer</h2>
    <p>Los siguientes medicamentos están próximos a vencer en 7 días hábiles:</p>
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr style="background-color: #23539E; color: white;">
          <th style="border: 1px solid #ddd; padding: 8px;">ID Producto</th>
          <th style="border: 1px solid #ddd; padding: 8px;">Nombre</th>
          <th style="border: 1px solid #ddd; padding: 8px;">Fecha de Vencimiento</th>
        </tr>
      </thead>
      <tbody>
        ${productos
          .map(
            (producto) => `
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${producto.ID_PRODUCTO}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${producto.nombre}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${formatDate(producto.fecha_vencimiento)}</td>
              </tr>
            `
          )
          .join("")}
      </tbody>
    </table>
  `;

  const mailOptions = {
    from: EMAIL_USER,
    to: EMAIL_USER,
    subject: "Alerta: Medicamentos próximos a vencer",
    html: htmlContent,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error enviando el correo:", error);
    } else {
      console.log("Correo enviado:", info.response);
    }
  });
};

export const checkCaducidad = async () => {
  try {
    const result = await productoModel.getProductosProximosAVencer();
    
    if (result.length > 0) {
      console.warn("Medicamentos próximos a vencer encontrados:", result);
      sendEmailAlert(result);
      return {
        message: "Verificación de medicamentos próximos a vencer completada",
        expiringMedicines: result,
      };
    } else {
      console.log("No hay medicamentos próximos a vencer");
      return {
        message: "No hay medicamentos próximos a vencer",
        expiringMedicines: [],
      };
    }
  } catch (error) {
    console.error("Error al verificar la fecha de vencimiento:", error);
    throw error;
  }
};

export const scheduleCaducidadCheck = (cron) => {
  cron.schedule("0 10 * * *", () => {
    console.log("Verificando fecha de vencimiento de productos...");
    checkCaducidad();
  });
};

const enviarAlertaStockMinimo = async (productosBajoStock) => {
  const estiloTabla = `
    <style>
      .tabla-alerta {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
        font-family: Arial, sans-serif;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      }
      .tabla-alerta thead {
        background-color: #23539E;
        color: white;
      }
      .tabla-alerta th {
        padding: 12px 15px;
        text-align: left;
        font-weight: 600;
        text-transform: uppercase;
        font-size: 14px;
      }
      .tabla-alerta td {
        padding: 10px 15px;
        border-bottom: 1px solid #e0e0e0;
      }
      .tabla-alerta tr:nth-child(even) {
        background-color: #f8f9fa;
      }
      .tabla-alerta tr:hover {
        background-color: #f1f5fd;
      }
      .stock-critico {
        color: #d32f2f;
        font-weight: bold;
      }
      .contenedor {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
        font-family: Arial, sans-serif;
        color: #333;
      }
      .titulo {
        color: #23539E;
        border-bottom: 2px solid #23539E;
        padding-bottom: 10px;
        margin-bottom: 20px;
      }
      .boton {
        display: inline-block;
        background-color: #23539E;
        color: white;
        padding: 10px 20px;
        text-decoration: none;
        border-radius: 4px;
        margin-top: 20px;
      }
    </style>
  `;

  const filasProductos = productosBajoStock.map(producto => `
    <tr>
      <td>${producto.ID_PRODUCTO}</td>
      <td>${producto.nombre} (${producto.tipoPresentacion})</td>
      <td>${producto.stock_minimo} ${producto.unidadMedida}</td>
      <td class="stock-critico">${producto.stock_actual} ${producto.unidadMedida}</td>
      <td>${producto.stock_minimo - producto.stock_actual} ${producto.unidadMedida}</td>
    </tr>
  `).join('');

  const htmlContent = `
    <html>
      <head>${estiloTabla}</head>
      <body>
        <div class="contenedor">
          <h2 class="titulo">Alerta de Stock Mínimo</h2>
          <p>Los siguientes productos han alcanzado su stock mínimo y requieren atención inmediata:</p>
          
          <table class="tabla-alerta">
            <thead>
              <tr>
                <th>ID</th>
                <th>Producto (Presentación)</th>
                <th>Stock Mínimo</th>
                <th>Stock Actual</th>
                <th>Faltante</th>
              </tr>
            </thead>
            <tbody>
              ${filasProductos}
            </tbody>
          </table>
          
          <p>Por favor, tome las medidas necesarias para reponer el stock de estos productos.</p>
          <p>Fecha de generación: ${new Date().toLocaleDateString()}</p>
        </div>
      </body>
    </html>
  `;

  const mailOptions = {
    from: EMAIL_USER,
    to: 'daniracyber@gmail.com',
    subject: `[URGENTE] Alerta: ${productosBajoStock.length} productos con stock mínimo`,
    html: htmlContent
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Alerta enviada por correo para ${productosBajoStock.length} productos con stock bajo.`);
  } catch (error) {
    console.error(`Error al enviar la alerta por correo: ${error.message}`);
    throw error;
  }
};

export const verificarStockYEnviarAlerta = async () => {
  const productosBajoStock = await productoModel.getProductosBajoStock();
  
  if (productosBajoStock.length > 0) {
    // Agregar información de presentación a los productos
    const productosConInfo = productosBajoStock.map(producto => {
      let tipoPresentacion = '';
      let unidadMedida = '';
      
      if (producto.PresentacionID_Presentacion === 1) {
        tipoPresentacion = 'Cápsulas';
        unidadMedida = 'unidades';
      } else if (producto.PresentacionID_Presentacion === 2) {
        tipoPresentacion = 'Tabletas';
        unidadMedida = 'unidades';
      } else if (producto.PresentacionID_Presentacion === 3) {
        tipoPresentacion = 'Jarabe';
        unidadMedida = 'frascos';
      } else if (producto.PresentacionID_Presentacion === 4) {
        tipoPresentacion = 'Gotas';
        unidadMedida = 'frascos';
      } else if (producto.PresentacionID_Presentacion === 5) {
        tipoPresentacion = 'Crema';
        unidadMedida = 'frascos';
      } else if (producto.PresentacionID_Presentacion === 6) {
        tipoPresentacion = 'Inyectable';
        unidadMedida = 'frascos';
      }
      
      return {
        ...producto,
        tipoPresentacion,
        unidadMedida
      };
    });

    await enviarAlertaStockMinimo(productosConInfo);
  }

  return { productosBajoStock };
};