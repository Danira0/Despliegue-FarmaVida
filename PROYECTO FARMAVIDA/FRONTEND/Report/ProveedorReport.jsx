import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import logo from "../public/Assets/logo.png";

// Estilos mejorados para los reportes
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
});

// Función de formateo segura
const formatValue = (value) => {
  if (value === null || value === undefined || value === '') return 'N/A';
  if (typeof value === 'number') return value.toLocaleString();
  return value.toString();
};

// Componente base para reportes
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

// Reporte general de proveedores
export const LaboratoriosReport = ({ data }) => (
  <BaseReport title="INFORME GENERAL DE PROVEEDORES" data={data}>
    <View style={styles.table}>
      <View style={[styles.tableRow, styles.tableHeader]}>
        <View style={[styles.tableCol, { width: '15%' }]}><Text>ID</Text></View>
        <View style={[styles.tableCol, { width: '15%' }]}><Text>Nombre</Text></View>
        <View style={[styles.tableCol, { width: '20%' }]}><Text>Dirección</Text></View>
        <View style={[styles.tableCol, { width: '20%' }]}><Text>Ciudad</Text></View>
        <View style={[styles.tableCol, { width: '15%' }]}><Text>Teléfono</Text></View>
        <View style={[styles.tableCol, { width: '20%' }]}><Text>Email</Text></View>
      </View>
      {(Array.isArray(data) ? data : []).map((proveedor) => (
        <View key={proveedor.ID_Laboratorio || proveedor.nombre || proveedor.correo_electronico} style={styles.tableRow}>
          <View style={[styles.tableCol, { width: '15%' }]}>
            <Text>{formatValue(proveedor.ID_Laboratorio)}</Text>
          </View>
          <View style={[styles.tableCol, { width: '15%' }]}>
            <Text>{formatValue(proveedor.nombre)}</Text>
          </View>
          <View style={[styles.tableCol, { width: '20%' }]}>
            <Text>{formatValue(proveedor.direccion)}</Text>
          </View>
          <View style={[styles.tableCol, { width: '20%' }]}>
            <Text>{formatValue(proveedor.ciudad)}</Text>
          </View>
          <View style={[styles.tableCol, { width: '15%' }]}>
            <Text>{formatValue(proveedor.telefono)}</Text>
          </View>
          <View style={[styles.tableCol, { width: '20%' }]}>
            <Text>{formatValue(proveedor.correo_electronico)}</Text>
          </View>
        </View>
      ))}
    </View>
  </BaseReport>
);

// Reporte de detalle de un laboratorio específico
export const LaboratorioDetalleReport = ({ data }) => {
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
            <Text style={styles.title}>INFORME DETALLADO DEL PROVEEDOR</Text>
            <Text>No hay datos disponibles para el proveedor seleccionado</Text>
          </View>
        </Page>
      </Document>
    );
  }

  const laboratorio = data[0];

  return (
    <BaseReport title="INFORME DETALLADO DEL PROVEEDOR" data={data}>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <View style={[styles.tableCol, { width: '30%' }]}><Text>Campo</Text></View>
          <View style={[styles.tableCol, { width: '70%' }]}><Text>Valor</Text></View>
        </View>

        <View style={styles.tableRow}>
          <View style={[styles.tableCol, { width: '30%' }]}><Text>ID</Text></View>
          <View style={[styles.tableCol, { width: '70%' }]}><Text>{formatValue(laboratorio.ID_Laboratorio)}</Text></View>
        </View>
        <View style={styles.tableRow}>
          <View style={[styles.tableCol, { width: '30%' }]}><Text>Nombre</Text></View>
          <View style={[styles.tableCol, { width: '70%' }]}><Text>{formatValue(laboratorio.nombre)}</Text></View>
        </View>
        <View style={styles.tableRow}>
          <View style={[styles.tableCol, { width: '30%' }]}><Text>Correo Electrónico</Text></View>
          <View style={[styles.tableCol, { width: '70%' }]}><Text>{formatValue(laboratorio.correo_electronico)}</Text></View>
        </View>
        <View style={styles.tableRow}>
          <View style={[styles.tableCol, { width: '30%' }]}><Text>Teléfono</Text></View>
          <View style={[styles.tableCol, { width: '70%' }]}><Text>{formatValue(laboratorio.telefono)}</Text></View>
        </View>
        <View style={styles.tableRow}>
          <View style={[styles.tableCol, { width: '30%' }]}><Text>Dirección</Text></View>
          <View style={[styles.tableCol, { width: '70%' }]}><Text>{formatValue(laboratorio.direccion)}</Text></View>
        </View>
        <View style={styles.tableRow}>
          <View style={[styles.tableCol, { width: '30%' }]}><Text>Ciudad</Text></View>
          <View style={[styles.tableCol, { width: '70%' }]}><Text>{formatValue(laboratorio.ciudad)}</Text></View>
        </View>
      </View>
    </BaseReport>
  );
};