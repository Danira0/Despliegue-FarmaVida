import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { PDFDownloadLink } from "@react-pdf/renderer";
import api from "../src/Componentes/API/api.js";
import {
  AllProductsReport,
  ExpiringProductsReport,
  StockProductsReport,
  ProductsByDateReport
} from "./ProductReports";

// VALIDACIÓN DE PROPS CON PropTypes
export const MyDocumentProductos = ({
  reportType,
  fechaInicio,
  fechaFin,
  diasVencer
}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        let endpoint = "";
        let params = {};

           switch (reportType) {
          case "todos":
            endpoint = "/productos";
            break;
          case "vencer":
            endpoint = "/productos/por-vencer";
            params = { dias: diasVencer || 90 };
            break;
          case "fecha-ingreso":
            endpoint = "/productos/por-fecha-ingreso";
            params = { fechaInicio, fechaFin };
            break;
          case "stock":
            endpoint = "/productos/en-stock";
            break;
          default:
            endpoint = "/productos";
        }    

        const response = await api.get(endpoint, { params });
          if (!response?.data?.success) {
          throw new Error(
            response?.data?.message || "No se recibieron datos del servidor"
          );
        }

        const responseData = Array.isArray(response.data.data)
          ? response.data.data
          : [response.data.data];

        if (responseData.length === 0) {
          throw new Error("No se encontraron productos con los criterios seleccionados");
        }
        setData(responseData);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Error al obtener los datos (${reportType}):`, error);
        setError(error.response?.data?.message || error.message || `Error al cargar los datos`);
      } finally {
        setLoading(false);
      }
    };

    // Validación de parámetros requeridos
    if (reportType === "fecha-ingreso" && (!fechaInicio || !fechaFin)) {
      setError("Debe proporcionar fecha de inicio y fecha de fin");
      setLoading(false);
      return;
    }

    fetchData();
  }, [reportType, fechaInicio, fechaFin, diasVencer]);

  const getReportComponent = () => {
    if (!data) return null;

    const commonProps = {
      data,
      fechaGeneracion: new Date().toLocaleString(),
      filtros: {
        reportType,
        fechaInicio,
        fechaFin,
        diasVencer
      }
    };

    switch (reportType) {
      case "todos":
        return <AllProductsReport {...commonProps} />;
      case "fecha-ingreso":
        return <ProductsByDateReport {...commonProps} />;
      case "vencer":
        return <ExpiringProductsReport {...commonProps} />;
      case "stock":
        return <StockProductsReport {...commonProps} />;
      default:
        return <AllProductsReport {...commonProps} />;
    }
  };

  const getFileName = () => {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const formatParam = (param) =>
      param ? param.toString().replace(/\s+/g, "_") : "";

    switch (reportType) {
      case "todos":
        return `Informe_General_Productos_${dateStr}.pdf`;
      case "fecha-ingreso":
        return `Productos_${formatParam(fechaInicio)}_a_${formatParam(
          fechaFin
        )}_${dateStr}.pdf`;
      case "vencer":
        return `Productos_Caducidad_${diasVencer || 90}dias_${dateStr}.pdf`;
      case "stock":
        return `Productos_Stock_${dateStr}.pdf`;
      default:
        return `Informe_Productos_${dateStr}.pdf`;
    }
  };

 if (loading) {
  return (
    <div className="alert alert-info text-center" role="alert">
      <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
      Cargando datos para el reporte...
    </div>
  );
}

 if (error) {
  return (
    <div className="alert alert-danger text-center" role="alert">
      <span className="me-2" role="img" aria-label="error">❗</span>
      {error}
    </div>
  );
}

if (!data || data.length === 0) {
  return (
    <div className="alert alert-warning text-center" role="alert">
      <span className="me-2" role="img" aria-label="info">ℹ️</span>
      No hay datos disponibles para mostrar con los criterios seleccionados
    </div>
  );
}

   return (
  <div className="text-center">
    <PDFDownloadLink
      document={getReportComponent()}
      fileName={getFileName()}
      className="btn btn-primary btn-lg"
      aria-label="Descargar reporte en PDF"
    >
      {({ loading: pdfLoading }) => (
        pdfLoading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
            Generando PDF...
          </>
        ) : (
          <>
            <span className="me-2" role="img" aria-label="pdf">📄</span>
            Descargar Reporte en PDF
          </>
        )
      )}
    </PDFDownloadLink>

    <div className="mt-3 small text-muted">
      <span className="me-1" role="img" aria-label="database">🗄️</span>
      El reporte incluirá {data.length} producto(s)
    </div>
  </div>
  );
};

MyDocumentProductos.propTypes = {
  reportType: PropTypes.string.isRequired,
  fechaInicio: PropTypes.string,
  fechaFin: PropTypes.string,
  diasVencer: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};