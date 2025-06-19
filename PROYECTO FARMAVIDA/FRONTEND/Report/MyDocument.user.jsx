import React, { useEffect, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PropTypes from "prop-types";
import api from "../src/Componentes/API/api.js";

import { UsuariosReport, UserByReport, UserRolReport } from "./User.Reports";

export const MyDocumentUsuarios = ({ reportType, usuarioId, rolId }) => {
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
            endpoint = "/usuarios";
            break;
          case "usuario":
            if (!usuarioId) {
              throw new Error("Se requiere un ID de usuario");
            }
            endpoint = `/usuarios/${usuarioId}`;
            break;
          case "rol":
            if (!rolId) {
              throw new Error("Se requiere un ID de rol");
            }
            endpoint = `/usuarios/rol/${rolId}`;
            break;
          default:
            endpoint = "/usuarios";
        }

        const response = await api.get(endpoint);
        if (!response.data || !response.data.success) {
          throw new Error(
            response.data?.message ||
              "No se recibieron datos válidos del servidor"
          );
        }

        const responseData = Array.isArray(response.data.data)
          ? response.data.data
          : [response.data.data];

        if (responseData.length === 0) {
          throw new Error(
            "No se encontraron usuarios con los criterios seleccionados"
          );
        }

        setData(responseData);
      } catch (err) {
        setError(err.message || "Error al obtener los datos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [reportType, usuarioId, rolId]);

  const getReportComponent = () => {
    if (!data) return null;
    const commonProps = {
      data,
      fechaGeneracion: new Date().toLocaleString(),
      filtros: {
        reportType,
        ...(usuarioId && { usuarioId }),
        ...(rolId && { rolId }),
      },
    };

    switch (reportType) {
      case "todos":
        return <UsuariosReport {...commonProps} />;
      case "usuario":
        return <UserByReport {...commonProps} />;
      case "rol":
        return <UserRolReport {...commonProps} />;
      default:
        return <UsuariosReport {...commonProps} />;
    }
  };

  const getFileName = () => {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    switch (reportType) {
      case "todos":
        return `Informe_General_Usuarios_${dateStr}.pdf`;
      case "usuario":
        return `Usuario_${usuarioId || ""}_${dateStr}.pdf`;
      case "rol":
        return `Usuarios_Rol_${rolId || ""}_${dateStr}.pdf`;
      default:
        return `Informe_General_${dateStr}.pdf`;
    }
  };

  if (loading) {
    return (
      <div className="alert alert-info text-center">
        <i className="fas fa-spinner fa-spin me-2" aria-hidden="true"></i>{" "}
        Cargando datos para el reporte...
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center">
       <i className="fas fa-exclamation-circle me-2" aria-hidden="true"></i>{" "}
{error}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="alert alert-warning text-center">
       <i className="fas fa-info-circle me-2" aria-hidden="true"></i>{" "}
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
             <i className="fas fa-spinner fa-spin me-2" aria-hidden="true"></i>{" "}
                  Generando PDF...
            </>
          ) : (
            <>
             <i className="fas fa-file-pdf me-2" aria-hidden="true"></i>{" "}
Descargar Reporte en PDF
            </>
          )
        }
      </PDFDownloadLink>

      <div className="mt-3 small text-muted">
        <i className="fas fa-database me-1" aria-hidden="true"></i>
        El reporte incluirá {data.length} usuario(s)
      </div>
    </div>
  );
};

MyDocumentUsuarios.propTypes = {
  reportType: PropTypes.string.isRequired,
  usuarioId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  rolId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
