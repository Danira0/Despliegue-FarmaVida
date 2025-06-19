import React from "react";
import PropTypes from "prop-types";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import logo from "../public/Assets/logo.png";

// Estilos mejorados para todos los reportes
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  section: {
    marginBottom: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    borderBottomStyle: 'solid',
    paddingBottom: 10,
  },
  logo: {
    width: 150,
    height: 40,
  },
  title: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 15,
    color: '#7f8c8d',
  },
  table: {
    width: '100%',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 4,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    alignItems: 'center',
    minHeight: 30,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#34495e',
    color: '#ffffff',
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: '#2c3e50',
  },
  tableCol: {
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: '#eeeeee',
  },
  footer: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#cccccc',
    fontSize: 8,
    textAlign: 'center',
    color: '#95a5a6',
  },
  entradaText: {
    color: '#27ae60',
    fontWeight: 'bold',
  },
  salidaText: {
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#eaeaea',
  },
  summaryItem: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 9,
    color: '#7f8c8d',
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  warningText: {
    color: '#e67e22',
    fontWeight: 'bold',
  },
  successText: {
    color: '#27ae60',
    fontWeight: 'bold',
  },
});

const BaseReport = ({ title, children, data }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Image style={styles.logo} src={logo} />
            <Text>Generado: {new Date().toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.title}>{title}</Text>
            <Text>No hay datos disponibles para generar el reporte</Text>
          </View>
        </Page>
      </Document>
    );
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image style={styles.logo} src={logo} />
          <Text>Generado: {new Date().toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>{title}</Text>
        </View>

        {children}

        <View style={styles.footer}>
          <Text>Total registros: {data.length} | Generado por: Sistema de Inventario</Text>
        </View>
      </Page>
    </Document>
  );
};

BaseReport.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  children: PropTypes.node,
};

// Función para formatear valores
const formatValue = (value) => {
  if (value === null || value === undefined || value === '') return 'N/A';
  if (typeof value === 'number') return value.toLocaleString();
  return value.toString();
};

// Formatear fechas
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES');
};

// 1. Reporte de todos los productos
export const AllProductsReport = ({ data }) => (
  <BaseReport title="INFORME GENERAL DE PRODUCTOS" data={data}>
    <View style={styles.table}>
      <View style={[styles.tableRow, styles.tableHeader]}>
        <View style={[styles.tableCol, { width: '12%' }]}><Text>Código</Text></View>
        <View style={[styles.tableCol, { width: '30%' }]}><Text>Nombre</Text></View>
        <View style={[styles.tableCol, { width: '18%' }]}><Text>Precio</Text></View>
        <View style={[styles.tableCol, { width: '18%' }]}><Text>Categoría</Text></View>
        <View style={[styles.tableCol, { width: '15%' }]}><Text>Laboratorio</Text></View>
        <View style={[styles.tableCol, { width: '20%' }]}><Text>Lote</Text></View>
      </View>
      {(Array.isArray(data) ? data : []).map((producto) => (
        <View key={producto.ID_PRODUCTO || producto.lote || producto.nombre} style={styles.tableRow}>
          <View style={[styles.tableCol, { width: '12%' }]}><Text>{formatValue(producto.ID_PRODUCTO)}</Text></View>
          <View style={[styles.tableCol, { width: '30%' }]}><Text>{formatValue(producto.nombre)}</Text></View>
          <View style={[styles.tableCol, { width: '18%' }]}><Text>$ {formatValue(producto.valor_unitario)}</Text></View>
          <View style={[styles.tableCol, { width: '18%' }]}><Text>{formatValue(producto.nombre_categoria)}</Text></View>
          <View style={[styles.tableCol, { width: '15%' }]}><Text>{formatValue(producto.nombre_laboratorio)}</Text></View>
          <View style={[styles.tableCol, { width: '20%' }]}><Text>{formatValue(producto.lote)}</Text></View>
        </View>
      ))}
    </View>
  </BaseReport>
);

AllProductsReport.propTypes = {
  data: PropTypes.array.isRequired,
};

// 2. Reporte de productos por vencer
export const ExpiringProductsReport = ({ data }) => (
  <BaseReport title="PRODUCTOS POR VENCER" data={data}>
    <View style={styles.table}>
      <View style={[styles.tableRow, styles.tableHeader]}>
        <View style={[styles.tableCol, { width: '15%' }]}><Text>Código</Text></View>
        <View style={[styles.tableCol, { width: '25%' }]}><Text>Nombre</Text></View>
        <View style={[styles.tableCol, { width: '15%' }]}><Text>Laboratorio</Text></View>
        <View style={[styles.tableCol, { width: '15%' }]}><Text>Lote</Text></View>
        <View style={[styles.tableCol, { width: '15%' }]}><Text>Fecha Venc.</Text></View>
        <View style={[styles.tableCol, { width: '15%' }]}><Text>Días Restantes</Text></View>
      </View>
      {(Array.isArray(data) ? data : []).map((producto) => (
        <View key={producto.ID_PRODUCTO || producto.lote || producto.nombre} style={styles.tableRow}>
          <View style={[styles.tableCol, { width: '15%' }]}><Text>{formatValue(producto.ID_PRODUCTO)}</Text></View>
          <View style={[styles.tableCol, { width: '25%' }]}><Text>{formatValue(producto.nombre)}</Text></View>
          <View style={[styles.tableCol, { width: '15%' }]}><Text>{formatValue(producto.nombre_laboratorio)}</Text></View>
          <View style={[styles.tableCol, { width: '15%' }]}><Text>{formatValue(producto.lote)}</Text></View>
          <View style={[styles.tableCol, { width: '15%' }]}><Text>{formatDate(producto.fecha_vencimiento)}</Text></View>
          <View style={[styles.tableCol, { width: '15%' }]}>
            <Text style={producto.dias_para_vencer <= 30 ? styles.warningText : {}}>
              {formatValue(producto.dias_para_vencer)}
            </Text>
          </View>
        </View>
      ))}
    </View>
  </BaseReport>
);

ExpiringProductsReport.propTypes = {
  data: PropTypes.array.isRequired,
};

// 3. Reporte de productos en stock
export const StockProductsReport = ({ data }) => (
  <BaseReport title="INFORME DE STOCK DE PRODUCTOS" data={data}>
    <View style={styles.table}>
      <View style={[styles.tableRow, styles.tableHeader]}>
        <View style={[styles.tableCol, { width: '18%' }]}><Text>Código</Text></View>
        <View style={[styles.tableCol, { width: '25%' }]}><Text>Nombre</Text></View>
        <View style={[styles.tableCol, { width: '15%' }]}><Text>Presentación</Text></View>
        <View style={[styles.tableCol, { width: '15%' }]}><Text>Stock Actual</Text></View>
        <View style={[styles.tableCol, { width: '15%' }]}><Text>Stock Mínimo</Text></View>
        <View style={[styles.tableCol, { width: '15%' }]}><Text>Diferencia</Text></View>
        <View style={[styles.tableCol, { width: '20%' }]}><Text>Estado</Text></View>
      </View>
      {(Array.isArray(data) ? data : []).map((producto) => {
        const diferencia = (producto.stock_actual ?? 0) - (producto.stock_minimo ?? 0);
        const estado = diferencia >= 0 ? 'SUFICIENTE' : 'INSUFICIENTE';
        return (
          <View key={producto.ID_PRODUCTO || producto.lote || producto.nombre} style={styles.tableRow}>
            <View style={[styles.tableCol, { width: '18%' }]}><Text>{formatValue(producto.ID_PRODUCTO)}</Text></View>
            <View style={[styles.tableCol, { width: '25%' }]}><Text>{formatValue(producto.nombre)}</Text></View>
            <View style={[styles.tableCol, { width: '15%' }]}><Text>{formatValue(producto.nombre_presentacion)}</Text></View>
            <View style={[styles.tableCol, { width: '15%' }]}><Text>{formatValue(producto.stock_actual)}</Text></View>
            <View style={[styles.tableCol, { width: '15%' }]}><Text>{formatValue(producto.stock_minimo)}</Text></View>
            <View style={[styles.tableCol, { width: '15%' }]}><Text>{formatValue(diferencia)}</Text></View>
            <View style={[styles.tableCol, { width: '20%' }]}>
              <Text style={diferencia >= 0 ? styles.successText : styles.warningText}>
                {estado}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  </BaseReport>
);

StockProductsReport.propTypes = {
  data: PropTypes.array.isRequired,
};

export const ProductsByDateReport = ({ data, fechaInicio, fechaFin }) => (
  <BaseReport 
    title={`PRODUCTOS POR FECHA DE INGRESO (${fechaInicio || 'sin inicio'} - ${fechaFin || 'sin fin'})`} 
    data={data}
  >
    <View style={styles.table}>
      <View style={[styles.tableRow, styles.tableHeader]}>
        <View style={[styles.tableCol, { width: '10%' }]}><Text>Código</Text></View>
        <View style={[styles.tableCol, { width: '25%' }]}><Text>Nombre</Text></View>
        <View style={[styles.tableCol, { width: '15%' }]}><Text>Fecha Ingreso</Text></View>
        <View style={[styles.tableCol, { width: '15%' }]}><Text>Lote</Text></View>
        <View style={[styles.tableCol, { width: '15%' }]}><Text>Laboratorio</Text></View>
        <View style={[styles.tableCol, { width: '20%' }]}><Text>Responsable</Text></View>
      </View>
      {(Array.isArray(data) ? data : []).map((producto) => (
        <View key={producto.ID_PRODUCTO || producto.lote || producto.nombre} style={styles.tableRow}>
          <View style={[styles.tableCol, { width: '10%' }]}><Text>{formatValue(producto.ID_PRODUCTO)}</Text></View>
          <View style={[styles.tableCol, { width: '25%' }]}><Text>{formatValue(producto.nombre)}</Text></View>
          <View style={[styles.tableCol, { width: '15%' }]}><Text>{formatDate(producto.fecha_entrada)}</Text></View>
          <View style={[styles.tableCol, { width: '15%' }]}><Text>{formatValue(producto.lote)}</Text></View>
          <View style={[styles.tableCol, { width: '15%' }]}>
            <Text>{formatValue(producto.nombre_laboratorio || 'Laboratorio no especificado')}</Text>
          </View>
          <View style={[styles.tableCol, { width: '20%' }]}>
            <Text>{formatValue(producto.nombre_responsable || 'Usuario no registrado')}</Text>
          </View>
        </View>
      ))}
    </View>
  </BaseReport>
);

ProductsByDateReport.propTypes = {
  data: PropTypes.array.isRequired,
  fechaInicio: PropTypes.string,
  fechaFin: PropTypes.string,
};