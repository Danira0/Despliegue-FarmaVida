import React, { useEffect, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PropTypes from "prop-types";
import api from "../src/Componentes/API/api.js";
import {
  LaboratoriosReport,
  LaboratorioDetalleReport,
} from "./ProveedorReport.jsx";

export const MyDocumentProveedor = ({
  reportType,
  laboratorioId,
}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const endpoint = "/laboratorios";

        if (reportType === "laboratorio" && !laboratorioId) {
          setLoading(false);
          return;
        }

        const response = await api.get(endpoint);

        if (!response.data || response.data.success === false) {
          throw new Error(
            response.data?.message || "No se recibieron datos válidos del servidor"
          );
        }

        let responseData = response.data.data;

        if (reportType === "laboratorio") {
          // Filtrar por laboratorioId si es necesario
          responseData = responseData.filter(lab => lab.ID_Laboratorio == laboratorioId);
          if (responseData.length === 0) {
            throw new Error(`No se encontró el laboratorio con ID ${laboratorioId}`);
          }
        }

        if (!Array.isArray(responseData)) {
          responseData = [];
        }

        if (responseData.length === 0) {
          throw new Error(
            "No se encontraron registros con los criterios seleccionados"
          );
        }

        setData(responseData);
      } catch (error) {
        // eslint-disable-next-line no-console
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

    fetchData();
  }, [reportType, laboratorioId]);

  const getReportComponent = () => {
    if (!data) return null;

    switch (reportType) {
      case "laboratorios":
        return <LaboratoriosReport data={data} />;
      case "laboratorio":
        return <LaboratorioDetalleReport data={data} />;
      default:
        return <LaboratoriosReport data={data} />;
    }
  };

  const getFileName = () => {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");

    switch (reportType) {
      case "laboratorios":
        return `Informe_General_Laboratorios_${dateStr}.pdf`;
      case "laboratorio":
        return `Informe_Laboratorio_${laboratorioId}_${dateStr}.pdf`;
      default:
        return `Informe_Laboratorios_${dateStr}.pdf`;
    }
  };

 if (loading) {
  return (
    <div className="alert alert-info text-center">
      <i className="fas fa-spinner fa-spin me-2" aria-hidden="true"></i>
      {" "}
      Cargando datos para el reporte...
    </div>
  );
}

 if (error) {
  return (
    <div className="alert alert-danger text-center">
      <i className="fas fa-exclamation-circle me-2" aria-hidden="true"></i>
      {" "}
      {error}
    </div>
  );
}

 if (!data || data.length === 0) {
  return (
    <div className="alert alert-warning text-center">
      <i className="fas fa-info-circle me-2" aria-hidden="true"></i>
      {" "}
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
      {({ loading: pdfLoading }) =>
        pdfLoading ? (
          <>
            <i className="fas fa-spinner fa-spin me-2" aria-hidden="true"></i>
            {" "}
            Generando PDF...
          </>
        ) : (
          <>
            <i className="fas fa-file-pdf me-2" aria-hidden="true"></i>
            {" "}
            Descargar Reporte en PDF
          </>
        )
      }
    </PDFDownloadLink>

      <div className="mt-3 small text-muted">
        <i className="fas fa-database me-1" aria-hidden="true"></i>
        El reporte incluirá {data.length} registro(s)
      </div>
    </div>
  );
};

MyDocumentProveedor.propTypes = {
  reportType: PropTypes.string.isRequired,
  laboratorioId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};