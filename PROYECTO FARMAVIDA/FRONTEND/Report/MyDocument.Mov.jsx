import React, { useEffect, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import axios from "axios";
import {
  AllMovementsReport,
  MovementsByDateReport,
  MovementsByProductReport,
  MovementsByUserReport,
  MovementsByTypeReport,
} from "./movimientoReports";

export const MyDocumentMovimientos = ({
  reportType,
  fechaInicio,
  fechaFin,
  productoId,
  usuarioId,
  tipoMovimiento,
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
            endpoint = "http://localhost:4000/api/movimientos";
            break;
          case "fechas":
            endpoint = "http://localhost:4000/api/movimientos/por-fecha";
            params = { fechaInicio, fechaFin };
            break;
          case "porproducto":
            endpoint = `http://localhost:4000/api/movimientos/producto/${productoId}`;
            break;
          case "usuario":
            endpoint = `http://localhost:4000/api/movimientos/usuario/${usuarioId}`;
            break;
          case "tipo":
            endpoint = `http://localhost:4000/api/movimientos/tipo/${tipoMovimiento}`;
            break;
          default:
            endpoint = "http://localhost:4000/api/movimientos";
        }

        const response = await axios.get(endpoint, { params });
        console.log("Datos recibidos del servidor:", response.data);
        // Verificar estructura de respuesta
        if (!response.data || !response.data.success) {
          throw new Error(
            response.data?.message || "No se recibieron datos del servidor"
          );
        }

        // Usar response.data.data que es donde están los movimientos
        const responseData = Array.isArray(response.data.data)
          ? response.data.data
          : [response.data.data];
        console.log("Datos recibidos del servidor:", response.data);

        if (responseData.length === 0) {
          throw new Error(
            "No se encontraron movimientos con los criterios seleccionados"
          );
        }

        setData(responseData);
      } catch (error) {
        console.error(`Error al obtener los datos (${reportType}):`, error);
        setError(
          error.response?.data?.message ||
            error.message ||
            `Error al cargar los datos`
        );
      } finally {
        setLoading(false);
      }
    };

    if (
      (reportType === "fechas" && (!fechaInicio || !fechaFin)) ||
      (reportType === "porproducto" && !productoId) ||
      (reportType === "usuario" && !usuarioId) ||
      (reportType === "tipo" && !tipoMovimiento)
    ) {
      setLoading(false);
      return;
    }

    fetchData();
  }, [
    reportType,
    fechaInicio,
    fechaFin,
    productoId,
    usuarioId,
    tipoMovimiento,
  ]);

  const getReportComponent = () => {
    if (!data) return null;

    const commonProps = {
      data,
      fechaGeneracion: new Date().toLocaleString(),
      filtros: {
        reportType,
        fechaInicio,
        fechaFin,
        productoId,
        usuarioId,
        tipoMovimiento,
      },
    };

    switch (reportType) {
      case "todos":
        return <AllMovementsReport {...commonProps} />;
      case "fechas":
        return <MovementsByDateReport {...commonProps} />;
      case "porproducto":
        return <MovementsByProductReport {...commonProps} />;
      case "usuario":
        return <MovementsByUserReport {...commonProps} />;
      case "tipo":
        return <MovementsByTypeReport {...commonProps} />;
      default:
        return <AllMovementsReport {...commonProps} />;
    }
  };

  const getFileName = () => {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const formatParam = (param) =>
      param ? param.toString().replace(/\s+/g, "_") : "";

    switch (reportType) {
      case "todos":
        return `Informe_General_Movimientos_${dateStr}.pdf`;
      case "fechas":
        return `Movimientos_${formatParam(fechaInicio)}_a_${formatParam(
          fechaFin
        )}_${dateStr}.pdf`;
      case "porproducto":
        return `Movimientos_Producto_${formatParam(productoId)}_${dateStr}.pdf`;
      case "usuario":
        return `Movimientos_Usuario_${formatParam(usuarioId)}_${dateStr}.pdf`;
      case "tipo":
        return `Movimientos_Tipo_${formatParam(tipoMovimiento)}_${dateStr}.pdf`;
      default:
        return `Informe_Movimientos_${dateStr}.pdf`;
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
        El reporte incluirá {data.length} movimiento(s)
      </div>
    </div>
  );
};
