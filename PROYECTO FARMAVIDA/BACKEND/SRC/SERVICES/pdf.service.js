import PDFDocument from 'pdfkit';
import fs from 'fs';


// Configuración común para todos los PDFs
const PDF_CONFIG = {
  titleFontSize: 20,
  headerFontSize: 12,
  bodyFontSize: 10,
  margin: 50,
  rowHeight: 25,
  headerColor: '#2c3e50',
  oddRowColor: '#f8f9fa',
  evenRowColor: '#ffffff',
  lineColor: '#dddddd',
  pagePadding: 20
};


const drawTableHeader = (doc, headers, columnPositions, y) => {
  doc.save();
  doc.fontSize(PDF_CONFIG.headerFontSize)
     .fillColor(PDF_CONFIG.headerColor)
     .font('Helvetica-Bold');
  
  headers.forEach((header, index) => {
    doc.text(header, columnPositions[index], y, {
      width: columnPositions[index+1] ? columnPositions[index+1] - columnPositions[index] - 10 : 100,
      align: 'left'
    });
  });
  
  
  doc.moveTo(PDF_CONFIG.margin, y + 20)
     .lineTo(doc.page.width - PDF_CONFIG.margin, y + 20)
     .lineWidth(1)
     .stroke(PDF_CONFIG.lineColor);
  
  doc.restore();
};

const drawTableRow = (doc, data, columnPositions, y, rowColor) => {
  doc.save();
  
  doc.rect(PDF_CONFIG.margin, y - 5, doc.page.width - PDF_CONFIG.margin * 2, PDF_CONFIG.rowHeight)
     .fill(rowColor);
  
  // Contenido de la fila
  doc.fontSize(PDF_CONFIG.bodyFontSize)
     .fillColor('#000000')
     .font('Helvetica');
  
  data.forEach((item, index) => {
    doc.text(item?.toString() || 'N/A', columnPositions[index], y, {
      width: columnPositions[index+1] ? columnPositions[index+1] - columnPositions[index] - 10 : 100,
      ellipsis: true,
      align: 'left'
    });
  });
  
  doc.restore();
};

// Generador de PDF para Productos (versión actualizada)
const generateProductosPdf = (productos) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: PDF_CONFIG.margin, size: 'A4' });
      const buffers = [];
      
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      
      // Título del documento
      doc.fontSize(PDF_CONFIG.titleFontSize)
         .font('Helvetica-Bold')
         .text('Reporte de Productos', { align: 'center' })
         .moveDown(1.5);
      
      const headers = ['ID', 'Nombre', 'Presentación', 'Lote', 'Vencimiento',  'Valor'];
      const columnPositions = [40, 80, 180, 280, 350, 440, 550];
      
      let y = 150; 
      
      drawTableHeader(doc, headers, columnPositions, y);
      y += PDF_CONFIG.rowHeight + 5;
      
      const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        const date = new Date(dateStr);
        return date.toLocaleDateString('es-ES');
      };
      
      // Dibujar filas de datos
      productos.forEach((producto, index) => {
        const rowColor = index % 2 === 0 ? PDF_CONFIG.oddRowColor : PDF_CONFIG.evenRowColor;
        
        drawTableRow(doc, [
          producto.ID_PRODUCTO,
          producto.nombre,
          producto.nombre_presentacion || 'N/A', 
          producto.lote || 'N/A',
          formatDate(producto.fecha_vencimiento),
          `$${producto.valor_unitario}`
        ], columnPositions, y, rowColor);
        
        y += PDF_CONFIG.rowHeight;
        
        // Nueva página si se llega al final
        if (y > doc.page.height - PDF_CONFIG.pagePadding) {
          doc.addPage();
          y = PDF_CONFIG.margin + PDF_CONFIG.rowHeight;
          drawTableHeader(doc, headers, columnPositions, y);
          y += PDF_CONFIG.rowHeight + 5;
        }
      });
      
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

// Generador de PDF para Movimientos (versión mejorada)
const generateMovimientosPdf = (movimientos) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: PDF_CONFIG.margin, size: 'A4' });
      const buffers = [];
      
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      
      // Título
      doc.fontSize(PDF_CONFIG.titleFontSize)
         .font('Helvetica-Bold')
         .text('Reporte de Movimientos', { align: 'center' })
         .moveDown(1.5);
      
      // Configuración de la tabla
      const headers = ['Fecha', 'Producto', 'Tipo', 'Cantidad', 'Valor U', 'Subtotal', 'Valor total', 'Usuario'];
      const columnPositions = [40, 100, 180, 250, 320, 390, 470, 550]; 
      
      let y = 150;
      drawTableHeader(doc, headers, columnPositions, y);
      y += PDF_CONFIG.rowHeight + 5;
      
      // Función para formatear valores monetarios
      const formatCurrency = (value) => {
        if (value === null || value === undefined) return 'N/A';
        return `$${parseFloat(value).toFixed(2)}`;
      };
      
      // Filas de datos
      movimientos.forEach((movimiento, index) => {
        const rowColor = index % 2 === 0 ? PDF_CONFIG.oddRowColor : PDF_CONFIG.evenRowColor;
        
        const fecha = movimiento.fecha_hora_movimiento 
          ? new Date(movimiento.fecha_hora_movimiento).toLocaleString() 
          : 'N/A';
        
        drawTableRow(doc, [
          fecha.substring(0, 16),
          movimiento.nombre_producto || 'N/A',
          movimiento.tipo_movimiento || 'N/A',
          movimiento.cantidad || 'N/A',
          formatCurrency(movimiento.valor_unitario_movimiento),
          formatCurrency(movimiento.subtotal),
          formatCurrency(movimiento.total_venta),
          movimiento.nombre_usuario || 'N/A'
        ], columnPositions, y, rowColor);
        
        y += PDF_CONFIG.rowHeight;
        
        if (y > doc.page.height - PDF_CONFIG.pagePadding) {
          doc.addPage();
          y = PDF_CONFIG.margin + PDF_CONFIG.rowHeight;
          drawTableHeader(doc, headers, columnPositions, y);
          y += PDF_CONFIG.rowHeight + 5;
        }
      });
      
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

// Generador de PDF para Laboratorios
const generateLaboratoriosPdf = (laboratorios) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: PDF_CONFIG.margin, size: 'A4' });
      const buffers = [];
      
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      
      // Título
      doc.fontSize(PDF_CONFIG.titleFontSize)
         .font('Helvetica-Bold')
         .text('Reporte de Laboratorios', { align: 'center' })
         .moveDown(1.5);
      
      // Configuración de la tabla
      const headers = ['ID', 'Nombre', 'Dirección', 'ciudad', 'Teléfono', 'Email', 'pagina web'];
      const columnPositions = [50, 100, 160, 280, 350, 420, 500];
      
      let y = 150;
      drawTableHeader(doc, headers, columnPositions, y);
      y += PDF_CONFIG.rowHeight + 5;
      
      // Filas de datos
      laboratorios.forEach((laboratorio, index) => {
        const rowColor = index % 2 === 0 ? PDF_CONFIG.oddRowColor : PDF_CONFIG.evenRowColor;
        
        drawTableRow(doc, [
          laboratorio.ID_Laboratorio,
          laboratorio.nombre,
          laboratorio.direccion,
          laboratorio.ciudad,
          laboratorio.telefono,
          laboratorio.correo_electronico,
          laboratorio.pagina_web
        ], columnPositions, y, rowColor);
        
        y += PDF_CONFIG.rowHeight;
        
        if (y > doc.page.height - PDF_CONFIG.pagePadding) {
          doc.addPage();
          y = PDF_CONFIG.margin + PDF_CONFIG.rowHeight;
          drawTableHeader(doc, headers, columnPositions, y);
          y += PDF_CONFIG.rowHeight + 5;
        }
      });
      
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

// Generador de PDF para Usuarios
const generateUsuariosPdf = (usuarios) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ 
        margin: PDF_CONFIG.margin, 
        size: 'A4',
        font: 'Helvetica',
        lang: 'es'
      });
      
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      
      // Título del documento
      doc.fontSize(PDF_CONFIG.titleFontSize)
         .font('Helvetica-Bold')
         .text('Reporte de Usuarios', { align: 'center' })
         .moveDown(1.5);
      
      // Configuración de la tabla ajustada
      const headers = ['ID', 'Nombre', 'Apellido', 'Email', 'Rol'];
      const columnPositions = [50, 100, 180, 280, 430, 550]; 
      
      let y = 150; // Posición vertical inicial
      
      // Dibujar encabezado de la tabla
      drawTableHeader(doc, headers, columnPositions, y);
      y += PDF_CONFIG.rowHeight + 5;
      
      // Dibujar filas de datos con manejo de campos faltantes
      usuarios.forEach((usuario, index) => {
        const rowColor = index % 2 === 0 ? PDF_CONFIG.oddRowColor : PDF_CONFIG.evenRowColor;
        
        drawTableRow(doc, [
          usuario.ID_Usuario?.toString() || 'N/A',
          usuario.nombre || 'N/A',
          usuario.apellido || 'N/A',
          usuario.email || usuario.correo || 'N/A', // Maneja ambos nombres de campo
          usuario.rol_descripcion || 'N/A'
        ], columnPositions, y, rowColor);
        
        y += PDF_CONFIG.rowHeight;
        
        // Nueva página si se llega al final
        if (y > doc.page.height - PDF_CONFIG.pagePadding) {
          doc.addPage();
          y = PDF_CONFIG.margin + PDF_CONFIG.rowHeight;
          drawTableHeader(doc, headers, columnPositions, y);
          y += PDF_CONFIG.rowHeight + 5;
        }
      });
      
      doc.end();
    } catch (error) {
      console.error('Error generando PDF de usuarios:', error);
      reject(error);
    }
  });
};

export {
  generateProductosPdf,
  generateMovimientosPdf,
  generateLaboratoriosPdf,
  generateUsuariosPdf
};