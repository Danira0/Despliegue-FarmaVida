import React, { useEffect, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import api from "./../src/Componentes/API/api.js";
import {
  AllProductsReport,
  ExpiringProductsReport,
  StockProductsReport,
  ProductsByDateReport
} from "./ProductReports";

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
        
        if (!response.data || !response.data.success) {
          throw new Error(response.data?.message || "No se recibieron datos del servidor");
        }
        
        const responseData = Array.isArray(response.data.data) ? 
          response.data.data : 
          [response.data.data];
        
        if (responseData.length === 0) {
          throw new Error("No se encontraron productos con los criterios seleccionados");
        }
        setData(responseData);
      } catch (error) {
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
      },
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
      <div className="alert alert-info text-center">
        <i className="fas fa-spinner fa-spin me-2"></i>
        Cargando datos para el reporte...
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center">
        <i className="fas fa-exclamation-circle me-2"></i>
        {error}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="alert alert-warning text-center">
        <i className="fas fa-info-circle me-2"></i>
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
      >
        {({ loading }) =>
          loading ? (
            <>
              <i className="fas fa-spinner fa-spin me-2"></i>
              Generando PDF...
            </>
          ) : (
            <>
              <i className="fas fa-file-pdf me-2"></i>
              Descargar Reporte en PDF
            </>
          )
        }
      </PDFDownloadLink>

      <div className="mt-3 small text-muted">
        <i className="fas fa-database me-1"></i>
        El reporte incluirá {data.length} producto(s)
      </div>
    </div>
  );
};