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

// Componente BaseReport mejorado
const BaseReport = ({ title, children, data, fechaInicio, fechaFin, subtitle }) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text>No hay datos disponibles para generar el reporte</Text>
          </View>
        </Page>
      </Document>
    );
  }

  // Calcular totales
  const totalEntradas = data
    .filter(m => m.tipo_movimiento === 'Entrada' || m.tipo_movimiento === 'Devolucion')
    .reduce((sum, m) => sum + (Number(m.cantidad_movimiento) || 0), 0);

  const totalSalidas = data
    .filter(m => m.tipo_movimiento === 'Salida')
    .reduce((sum, m) => sum + (Number(m.cantidad_movimiento) || 0), 0);

  const diferencia = totalEntradas - totalSalidas;

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
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          {(fechaInicio || fechaFin) && (
            <Text style={{ textAlign: 'center', fontSize: 10, marginBottom: 10 }}>
              {fechaInicio && `Desde: ${formatDate(fechaInicio)} `}
              {fechaFin && `Hasta: ${formatDate(fechaFin)}`}
            </Text>
          )}
        </View>

        <View style={styles.summary}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Registros</Text>
            <Text style={styles.summaryValue}>{data.length}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Entradas</Text>
            <Text style={[styles.summaryValue, styles.entradaText]}>{totalEntradas}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Salidas</Text>
            <Text style={[styles.summaryValue, styles.salidaText]}>{totalSalidas}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Diferencia</Text>
            <Text style={[
              styles.summaryValue,
              { color: diferencia >= 0 ? '#27ae60' : '#e74c3c' }
            ]}>{diferencia}</Text>
          </View>
        </View>

        {children}

        <View style={styles.footer}>
          <Text>Sistema de Gestión de Inventarios • {new Date().getFullYear()}</Text>
        </View>
      </Page>
    </Document>
  );
};

// Validación de props para BaseReport
BaseReport.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  data: PropTypes.array.isRequired,
  fechaInicio: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  fechaFin: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  subtitle: PropTypes.string,
};

// Funciones de formato mejoradas
const formatValue = (value) => {
  if (value === null || value === undefined || value === '') return '-';
  if (typeof value === 'number') return value.toString();
  return value;
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).replace(/ de /g, '/');
};

// 1. Reporte de todos los movimientos
export const AllMovementsReport = ({ data }) => {
  return (
    <BaseReport
      title="REPORTE GENERAL DE MOVIMIENTOS"
      data={data}
      subtitle="Todos los movimientos registrados en el sistema"
    >
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <View style={[styles.tableCol, { width: '8%' }]}><Text>ID</Text></View>
          <View style={[styles.tableCol, { width: '14%' }]}><Text>Fecha/Hora</Text></View>
          <View style={[styles.tableCol, { width: '18%' }]}><Text>Producto</Text></View>
          <View style={[styles.tableCol, { width: '8%' }]}><Text>Cantidad</Text></View>
          <View style={[styles.tableCol, { width: '10%' }]}><Text>Tipo</Text></View>
          <View style={[styles.tableCol, { width: '15%' }]}><Text>Usuario</Text></View>
          <View style={[styles.tableCol, { width: '15%' }]}><Text>Ubicación</Text></View>
          <View style={[styles.tableCol, { width: '12%' }]}><Text>Presentación</Text></View>
        </View>

        {data.map((movimiento) => (
          <View key={movimiento.ID_STOCK || movimiento.id || Math.random()} style={styles.tableRow}>
            <View style={[styles.tableCol, { width: '8%' }]}><Text>{formatValue(movimiento.ID_STOCK)}</Text></View>
            <View style={[styles.tableCol, { width: '14%' }]}><Text>{formatDate(movimiento.fecha_hora_movimiento)}</Text></View>
            <View style={[styles.tableCol, { width: '18%' }]}><Text>{formatValue(movimiento.nombre_producto)}</Text></View>
            <View style={[styles.tableCol, { width: '8%' }]}>
              <Text>{formatValue(movimiento.cantidad ?? 0)}</Text>
            </View>
            <View style={[styles.tableCol, { width: '10%' }]}>
              <Text style={movimiento.tipo_movimiento === 'Entrada' ? styles.entradaText : styles.salidaText}>
                {formatValue(movimiento.tipo_movimiento)}
              </Text>
            </View>
            <View style={[styles.tableCol, { width: '15%' }]}>
              <Text>{formatValue(movimiento.nombre_usuario)}</Text>
            </View>
            <View style={[styles.tableCol, { width: '15%' }]}><Text>{formatValue(movimiento.nombre_ubicacion)}</Text></View>
            <View style={[styles.tableCol, { width: '12%' }]}><Text>{formatValue(movimiento.nombre_presentacion)}</Text></View>
          </View>
        ))}
      </View>
    </BaseReport>
  );
};

AllMovementsReport.propTypes = {
  data: PropTypes.array.isRequired,
};

// 2. Reporte de movimientos por fecha
export const MovementsByDateReport = ({ data, fechaInicio, fechaFin }) => {
  return (
    <BaseReport
      title="MOVIMIENTOS POR RANGO DE FECHAS"
      data={data}
      fechaInicio={fechaInicio}
      fechaFin={fechaFin}
      subtitle="Movimientos registrados en el período seleccionado"
    >
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <View style={[styles.tableCol, { width: '12%' }]}><Text>ID</Text></View>
          <View style={[styles.tableCol, { width: '15%' }]}><Text>Fecha/Hora</Text></View>
          <View style={[styles.tableCol, { width: '20%' }]}><Text>Producto</Text></View>
          <View style={[styles.tableCol, { width: '8%' }]}><Text>Cantidad</Text></View>
          <View style={[styles.tableCol, { width: '10%' }]}><Text>Tipo</Text></View>
          <View style={[styles.tableCol, { width: '15%' }]}><Text>Usuario</Text></View>
          <View style={[styles.tableCol, { width: '20%' }]}><Text>Detalle</Text></View>
        </View>

        {data.map((movimiento) => (
          <View key={movimiento.ID_STOCK || movimiento.id || Math.random()} style={styles.tableRow}>
            <View style={[styles.tableCol, { width: '12%' }]}><Text>{formatValue(movimiento.ID_STOCK)}</Text></View>
            <View style={[styles.tableCol, { width: '15%' }]}><Text>{formatDate(movimiento.fecha_hora_movimiento)}</Text></View>
            <View style={[styles.tableCol, { width: '20%' }]}><Text>{formatValue(movimiento.nombre_producto)}</Text></View>
            <View style={[styles.tableCol, { width: '8%' }]}><Text>{formatValue(movimiento.cantidad_movimiento)}</Text></View>
            <View style={[styles.tableCol, { width: '10%' }]}>
              <Text style={movimiento.tipo_movimiento === 'Entrada' ? styles.entradaText : styles.salidaText}>
                {formatValue(movimiento.tipo_movimiento)}
              </Text>
            </View>
            <View style={[styles.tableCol, { width: '15%' }]}>
              <Text>{formatValue(movimiento.nombre_usuario)} {formatValue(movimiento.apellido)}</Text>
            </View>
            <View style={[styles.tableCol, { width: '20%' }]}>
              <Text>{formatValue(movimiento.detalle_movimiento) || 'Sin detalles'}</Text>
            </View>
          </View>
        ))}
      </View>
    </BaseReport>
  );
};

MovementsByDateReport.propTypes = {
  data: PropTypes.array.isRequired,
  fechaInicio: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  fechaFin: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
};

// 3. Reporte de movimientos por producto
export const MovementsByProductReport = ({ data = [], productoId, subtitle }) => {
  const productName =
    (Array.isArray(data) && data.length > 0 && data[0].nombre_producto) ||
    "Producto no especificado";

  return (
    <BaseReport
      title="MOVIMIENTOS POR PRODUCTO"
      data={data}
      subtitle={subtitle || `Producto: ${productName}`}
    >
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <View style={[styles.tableCol, { width: '15%' }]}><Text>Fecha/Hora</Text></View>
          <View style={[styles.tableCol, { width: '15%' }]}><Text>Tipo</Text></View>
          <View style={[styles.tableCol, { width: '12%' }]}><Text>Cantidad</Text></View>
          <View style={[styles.tableCol, { width: '18%' }]}><Text>Presentación</Text></View>
          <View style={[styles.tableCol, { width: '20%' }]}><Text>Usuario</Text></View>
          <View style={[styles.tableCol, { width: '20%' }]}><Text>Ubicación</Text></View>
        </View>

        {data.map((movimiento) => (
          <View key={movimiento.ID_STOCK || movimiento.id || Math.random()} style={styles.tableRow}>
            <View style={[styles.tableCol, { width: '15%' }]}><Text>{formatDate(movimiento.fecha_hora_movimiento)}</Text></View>
            <View style={[styles.tableCol, { width: '15%' }]}>
              <Text style={movimiento.tipo_movimiento === 'Entrada' ? styles.entradaText : styles.salidaText}>
                {formatValue(movimiento.tipo_movimiento)}
              </Text>
            </View>
            <View style={[styles.tableCol, { width: '12%' }]}>
              <Text>{formatValue(movimiento.cantidad ?? 0)}</Text>
            </View>
            <View style={[styles.tableCol, { width: '18%' }]}><Text>{formatValue(movimiento.nombre_presentacion)}</Text></View>
            <View style={[styles.tableCol, { width: '20%' }]}>
              <Text>{formatValue(movimiento.nombre_usuario)} </Text>
            </View>
            <View style={[styles.tableCol, { width: '20%' }]}><Text>{formatValue(movimiento.nombre_ubicacion)}</Text></View>
          </View>
        ))}
      </View>
    </BaseReport>
  );
};

MovementsByProductReport.propTypes = {
  data: PropTypes.array,
  productoId: PropTypes.any,
  subtitle: PropTypes.string,
};

export const MovementsByUserReport = ({ data = [], usuarioId, subtitle }) => {
  const userName =
    (data[0]?.nombre_completo_usuario ||
      data[0]?.nombre_usuario ||
      "Usuario no especificado");

  return (
    <BaseReport
      title="MOVIMIENTOS POR USUARIO"
      data={data}
      subtitle={subtitle || `Usuario: ${userName}`}
    >
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <View style={[styles.tableCol, { width: '15%' }]}><Text>Fecha/Hora</Text></View>
          <View style={[styles.tableCol, { width: '20%' }]}><Text>Producto</Text></View>
          <View style={[styles.tableCol, { width: '10%' }]}><Text>Cantidad</Text></View>
          <View style={[styles.tableCol, { width: '12%' }]}><Text>Tipo</Text></View>
          <View style={[styles.tableCol, { width: '18%' }]}><Text>Presentación</Text></View>
          <View style={[styles.tableCol, { width: '15%' }]}><Text>Ubicación</Text></View>
          <View style={[styles.tableCol, { width: '10%' }]}><Text>Lote</Text></View>
        </View>

        {data.map((movimiento) => (
          <View key={movimiento.ID_STOCK || movimiento.id || Math.random()} style={styles.tableRow}>
            <View style={[styles.tableCol, { width: '15%' }]}>
              <Text>{formatDate(movimiento.fecha_hora_movimiento)}</Text>
            </View>
            <View style={[styles.tableCol, { width: '20%' }]}>
              <Text>{formatValue(movimiento.nombre_producto)}</Text>
            </View>
            <View style={[styles.tableCol, { width: '10%' },
              movimiento.tipo_movimiento === 'Entrada' ? styles.entradaText : styles.salidaText]}>
              <Text>{formatValue(movimiento.cantidad)}</Text>
            </View>
            <View style={[styles.tableCol, { width: '12%' }]}>
              <Text style={movimiento.tipo_movimiento === 'Entrada' ? styles.entradaText : styles.salidaText}>
                {formatValue(movimiento.tipo_movimiento)}
              </Text>
            </View>
            <View style={[styles.tableCol, { width: '18%' }]}>
              <Text>{formatValue(movimiento.nombre_presentacion)}</Text>
            </View>
            <View style={[styles.tableCol, { width: '15%' }]}>
              <Text>{formatValue(movimiento.nombre_ubicacion)}</Text>
            </View>
            <View style={[styles.tableCol, { width: '10%' }]}>
              <Text>{formatValue(movimiento.lote)}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={[styles.summary, { marginTop: 10 }]}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Usuario</Text>
          <Text style={[styles.summaryValue, { fontSize: 12 }]}>{userName}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Movimientos</Text>
          <Text style={styles.summaryValue}>{data.length}</Text>
        </View>
      </View>
    </BaseReport>
  );
};

MovementsByUserReport.propTypes = {
  data: PropTypes.array,
  usuarioId: PropTypes.any,
  subtitle: PropTypes.string,
};

// 5. Reporte de movimientos por tipo
export const MovementsByTypeReport = ({ data, tipo, subtitle }) => {
  return (
    <BaseReport
      title={`MOVIMIENTOS POR TIPO`}
      data={data}
      subtitle={subtitle || `Tipo: ${tipo || 'Todos'}`}
    >
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <View style={[styles.tableCol, { width: '12%' }]}><Text>ID</Text></View>
          <View style={[styles.tableCol, { width: '15%' }]}><Text>Fecha/Hora</Text></View>
          <View style={[styles.tableCol, { width: '20%' }]}><Text>Producto</Text></View>
          <View style={[styles.tableCol, { width: '15%' }]}><Text>Cantidad</Text></View>
          <View style={[styles.tableCol, { width: '18%' }]}><Text>Usuario</Text></View>
          <View style={[styles.tableCol, { width: '20%' }]}><Text>Presentación</Text></View>
        </View>

        {data.map((movimiento) => (
          <View key={movimiento.ID_STOCK || movimiento.id || Math.random()} style={styles.tableRow}>
            <View style={[styles.tableCol, { width: '12%' }]}><Text>{formatValue(movimiento.ID_STOCK)}</Text></View>
            <View style={[styles.tableCol, { width: '15%' }]}><Text>{formatDate(movimiento.fecha_hora_movimiento)}</Text></View>
            <View style={[styles.tableCol, { width: '20%' }]}><Text>{formatValue(movimiento.nombre_producto)}</Text></View>
            <View style={[styles.tableCol, { width: '15%' }]}><Text>{formatValue(movimiento.cantidad)}</Text></View>
            <View style={[styles.tableCol, { width: '18%' }]}>
              <Text>{formatValue(movimiento.nombre_usuario)} {formatValue(movimiento.apellido)}</Text>
            </View>
            <View style={[styles.tableCol, { width: '20%' }]}><Text>{formatValue(movimiento.nombre_presentacion)}</Text></View>
          </View>
        ))}
      </View>
    </BaseReport>
  );
};

MovementsByTypeReport.propTypes = {
  data: PropTypes.array.isRequired,
  tipo: PropTypes.string,
  subtitle: PropTypes.string,
};