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
});

const BaseReport = ({ title, children, data = [], filtros = {} }) => {
  const safeData = Array.isArray(data) ? data : [];

  if (safeData.length === 0) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Image style={styles.logo} src={logo} />
            <Text>
              Generado: {new Date().toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
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
          <Text>
            Generado: {new Date().toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>{title}</Text>
          {filtros && Object.keys(filtros).length > 0 && (
            <Text style={styles.subtitle}>
              Filtros aplicados: {Object.entries(filtros)
                .map(([key, value]) => `${key}: ${value}`)
                .join(" | ")}
            </Text>
          )}
        </View>

        {children}

        <View style={styles.footer}>
          <Text>
            Total registros: {safeData.length} | Generado por: Sistema de Gestión de Usuarios
          </Text>
        </View>
      </Page>
    </Document>
  );
};

BaseReport.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  data: PropTypes.array,
  filtros: PropTypes.object,
};

const formatValue = (value) => {
  if (value === null || value === undefined || value === "") return "N/A";
  if (typeof value === "number") return value !== 0 ? value.toString() : "N/A";
  return value;
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const UsuariosReport = ({ data = [] }) => (
  <BaseReport title="INFORME GENERAL DE USUARIOS" data={data}>
    <View style={styles.table}>
      <View style={[styles.tableRow, styles.tableHeader]}>
        <View style={[styles.tableCol, { width: "15%" }]}><Text>ID</Text></View>
        <View style={[styles.tableCol, { width: "20%" }]}><Text>Nombre</Text></View>
        <View style={[styles.tableCol, { width: "20%" }]}><Text>Apellido</Text></View>
        <View style={[styles.tableCol, { width: "30%" }]}><Text>Correo</Text></View>
        <View style={[styles.tableCol, { width: "20%" }]}><Text>Rol</Text></View>
      </View>

      {data.map((usuario, index) => (
        <View key={usuario?.ID_Usuario || index} style={styles.tableRow}>
          <View style={[styles.tableCol, { width: "15%" }]}><Text>{formatValue(usuario?.ID_Usuario)}</Text></View>
          <View style={[styles.tableCol, { width: "20%" }]}><Text>{formatValue(usuario?.nombre)}</Text></View>
          <View style={[styles.tableCol, { width: "20%" }]}><Text>{formatValue(usuario?.apellido)}</Text></View>
          <View style={[styles.tableCol, { width: "30%" }]}><Text>{formatValue(usuario?.correo ?? usuario?.email)}</Text></View>
          <View style={[styles.tableCol, { width: "20%" }]}><Text>{formatValue(usuario?.rol_descripcion ?? usuario?.rol)}</Text></View>
        </View>
      ))}
    </View>
  </BaseReport>
);

UsuariosReport.propTypes = {
  data: PropTypes.array,
};

export const UserByReport = ({ data = [], filtros = {} }) => {
  const safeData = Array.isArray(data) ? data : [];
  if (safeData.length === 0 || !safeData[0]) {
    return (
      <BaseReport title="INFORME DETALLADO DE USUARIO" data={[]} filtros={filtros}>
        <View style={{ padding: 20 }}>
          <Text style={{ textAlign: 'center', fontSize: 16 }}>
            No se encontró información para el usuario con ID: {filtros?.usuarioId || 'no especificado'}
          </Text>
        </View>
      </BaseReport>
    );
  }
  const user = safeData[0];

  return (
    <BaseReport title="INFORME DETALLADO DE USUARIO" data={safeData} filtros={filtros}>
      <View style={{ marginBottom: 20 }}>
        <View style={styles.summary}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>ID Usuario</Text>
            <Text style={styles.summaryValue}>{formatValue(user?.ID_Usuario)}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Nombre Completo</Text>
            <Text style={styles.summaryValue}>{formatValue(user?.nombre)} {formatValue(user?.apellido)}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Nombre de Usuario</Text>
            <Text style={styles.summaryValue}>{formatValue(user?.nombre_usuario)}</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <View style={[styles.tableCol, { width: "30%" }]}><Text>Campo</Text></View>
            <View style={[styles.tableCol, { width: "70%" }]}><Text>Valor</Text></View>
          </View>
          {[
            { label: 'Correo Electrónico', value: user?.correo ?? user?.email },
            { label: 'Rol', value: user?.rol_descripcion ?? user?.rol ?? 'N/A' },
            { label: 'Fecha de Registro', value: formatDate(user?.fecha_registro) },
            { label: 'ID de Rol', value: user?.ROLID_ROL ?? 'N/A' },
          ].map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={[styles.tableCol, { width: "30%" }]}><Text>{item.label}</Text></View>
              <View style={[styles.tableCol, { width: "70%" }]}><Text>{formatValue(item.value)}</Text></View>
            </View>
          ))}
        </View>
      </View>
    </BaseReport>
  );
};

UserByReport.propTypes = {
  data: PropTypes.array,
  filtros: PropTypes.object,
};

export const UserRolReport = ({ data = [], filtros = {} }) => {
  const safeData = Array.isArray(data) ? data.filter(u => u && typeof u === 'object') : [];
  const rolDescripcion = safeData[0]?.rol_descripcion ?? filtros?.rolDescripcion ?? 'N/A';

  return (
    <BaseReport title={`USUARIOS POR ROL: ${rolDescripcion}`} data={safeData} filtros={filtros}>
      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Usuarios</Text>
          <Text style={styles.summaryValue}>{safeData.length}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>ID Rol</Text>
          <Text style={styles.summaryValue}>{filtros?.rolId ?? 'N/A'}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Descripción Rol</Text>
          <Text style={styles.summaryValue}>{rolDescripcion}</Text>
        </View>
      </View>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <View style={[styles.tableCol, { width: "8%" }]}><Text>ID</Text></View>
          <View style={[styles.tableCol, { width: "15%" }]}><Text>Nombre</Text></View>
          <View style={[styles.tableCol, { width: "15%" }]}><Text>Apellido</Text></View>
          <View style={[styles.tableCol, { width: "20%" }]}><Text>Correo</Text></View>
          <View style={[styles.tableCol, { width: "12%" }]}><Text>Usuario</Text></View>
          <View style={[styles.tableCol, { width: "15%" }]}><Text>Registro</Text></View>
          <View style={[styles.tableCol, { width: "15%" }]}><Text>Movimientos</Text></View>
        </View>
        {safeData.map((user, index) => (
          <View key={user?.ID_Usuario || index} style={styles.tableRow}>
            <View style={[styles.tableCol, { width: "8%" }]}><Text>{formatValue(user?.ID_Usuario)}</Text></View>
            <View style={[styles.tableCol, { width: "15%" }]}><Text>{formatValue(user?.nombre)}</Text></View>
            <View style={[styles.tableCol, { width: "15%" }]}><Text>{formatValue(user?.apellido)}</Text></View>
            <View style={[styles.tableCol, { width: "20%" }]}><Text>{formatValue(user?.correo ?? user?.email)}</Text></View>
            <View style={[styles.tableCol, { width: "12%" }]}><Text>{formatValue(user?.nombre_usuario)}</Text></View>
            <View style={[styles.tableCol, { width: "15%" }]}><Text>{formatDate(user?.fecha_registro)}</Text></View>
            <View style={[styles.tableCol, { width: "15%" }]}>
              <Text style={user?.total_movimientos > 0 ? styles.entradaText : undefined}>
                {formatValue(user?.total_movimientos)}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </BaseReport>
  );
};

UserRolReport.propTypes = {
  data: PropTypes.array,
  filtros: PropTypes.object,
};