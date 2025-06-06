import React, { useEffect, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import api from "./../src/Componentes/API/api.js";
import {
  AllProductsReport,
  ExpiringProductsReport,
  StockProductsReport,
  ProductsByDateReport
} from "./ProductReports";

export const MyDocument = ({ reportType, fechaInicio, fechaFin }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let endpoint = "";
        switch (reportType) {
          case "todos":
            endpoint = "/productos/todos";
            break;
          case "vencer":
            endpoint = "/productos/vencer";
            break;
          case "stock":
            endpoint = "/productos/stock";
            break;
          case "fecha-ingreso":
            endpoint = `/productos/fecha-ingreso?fechaInicio=${fechaInicio || ""}&fechaFin=${fechaFin || ""}`;
            break;
          default:
            endpoint = "/productos/todos";
        }

        const response = await api.get(endpoint);
        
        if (!response.data) {
          throw new Error("No se recibieron datos del servidor");
        }
        
        console.log(`Datos recibidos para ${reportType}:`, response.data);
        setData(response.data);
      } catch (error) {
        console.error(`Error al obtener los datos (${reportType}):`, error);
        setError(`Error al cargar los datos: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [reportType, fechaInicio, fechaFin]);

  const getReportComponent = () => {
    if (!data) return null;
    
    switch (reportType) {
      case "todos":
        return <AllProductsReport data={data} />;
      case "vencer":
        return <ExpiringProductsReport data={data} />;
      case "stock":
        return <StockProductsReport data={data} />;
      case "fecha-ingreso":
        return <ProductsByDateReport 
                 data={data} 
                 fechaInicio={fechaInicio} 
                 fechaFin={fechaFin} 
               />;
      default:
        return <AllProductsReport data={data} />;
    }
  };

  const getFileName = () => {
    const dateStr = new Date().toISOString().slice(0, 10);
    switch (reportType) {
      case "todos":
        return `Informe_General_Productos_${dateStr}.pdf`;
      case "vencer":
        return `Productos_Por_Vencer_${dateStr}.pdf`;
      case "stock":
        return `Stock_Productos_${dateStr}.pdf`;
      case "fecha-ingreso":
        return `Productos_Fecha_Ingreso_${fechaInicio || ''}_${fechaFin || ''}_${dateStr}.pdf`;
      default:
        return `Informe_Productos_${dateStr}.pdf`;
    }
  };

  if (loading) {
    return <div style={{ padding: '10px', color: '#666', textAlign: 'center' }}>Cargando datos para el reporte...</div>;
  }

  if (error) {
    return <div style={{ padding: '10px', color: 'red', textAlign: 'center' }}>{error}</div>;
  }

  if (!data || data.length === 0) {
    return <div style={{ padding: '10px', color: 'orange', textAlign: 'center' }}>No hay datos disponibles para mostrar</div>;
  }

  return (
    <PDFDownloadLink
      document={getReportComponent()}
      fileName={getFileName()}
      style={{
        textDecoration: "none",
        padding: "12px 20px",
        color: "#ffffff",
        backgroundColor: "#4a6baf",
        border: "none",
        borderRadius: "4px",
        fontWeight: "bold",
        cursor: "pointer",
        transition: "background-color 0.3s",
        ':hover': {
          backgroundColor: "#3a5699",
        }
      }}
    >
      {({ loading }) => (
        loading ? "Generando PDF..." : "Descargar Reporte en PDF"
      )}
    </PDFDownloadLink>
  );
};