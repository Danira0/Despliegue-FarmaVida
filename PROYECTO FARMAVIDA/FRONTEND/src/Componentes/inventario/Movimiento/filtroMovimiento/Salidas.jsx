import React, { useEffect, useState } from "react";
import api from "../../../API/api.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../../src/Componentes/Auth/auth.jsx";
import Menu from "../../../../Componentes/home/admimenulateral.jsx";

function Salidas() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [salidas, setSalidas] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSalidas = async () => {
      try {
        const response = await api.get("/obtener/salidas");
        setSalidas(response.data.data);
      } catch (err) {
        setError("Error al cargar las salidas");
        console.error("Error fetching salidas:", err);
      }
    };

    fetchSalidas();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return "";
    const fecha = new Date(fechaISO);
    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const año = fecha.getFullYear();
    const horas = String(fecha.getHours()).padStart(2, "0");
    const minutos = String(fecha.getMinutes()).padStart(2, "0");
    return `${dia}/${mes}/${año} ${horas}:${minutos}`;
  };

  const formatearMoneda = (valor) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(valor);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <div className="boton-atras-container">
        <button
          className="boton-atras btn btn-primary fle_atras"
          onClick={handleGoBack}
        >
          <img src="/Assets/flecha_atras.png" alt="flecha_a" />
        </button>
      </div>
      <nav>
        <div className="head row">
          <div className="logo col p-3">
            <img
              src="/Assets/logo.png"
              alt="Logo de la farmacia"
              width="250px"
            />
          </div>
          <div className="rol col">
            <div className="salir p-3">
              <button
                type="button"
                onClick={handleLogout}
                className="btn-logout"
                aria-label="Cerrar sesión"
                style={{ background: "none", border: "none", padding: 0 }}
              >
                <img
                  src="/Assets/flecha_salir.png"
                  alt="Cerrar sesión"
                  width="50px"
                />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container-fluid">
        <div className="op row d-flex">
          <Menu />
          <div className="col-lg-10 col-md-5 mt-5">
            <div className="App">
              <div className="container-fluid">
                <div className="tabla_medic row mt-5">
                  <div className="col-12 col-lg-10">
                    <div className="table-responsive">
                      {error ? (
                        <div className="alert alert-danger" role="alert">
                          {error}
                        </div>
                      ) : salidas.length === 0 ? (
                        <div className="alert alert-info" role="alert">
                          No hay registros de salidas disponibles
                        </div>
                      ) : (
                        <table className="table table-bordered">
                          <thead>
                            <tr className="table-primary">
                              <th>#</th>
                              <th>Nombre del producto</th>
                              <th>Presentación</th>
                              <th>Cantidad</th>
                              <th>Usuario</th>
                              <th>IVA</th>
                              <th>Subtotal</th>
                              <th>Total Venta</th>
                              <th>Valor Unitario</th>
                              <th>Fecha y Hora</th>
                            </tr>
                          </thead>
                          <tbody className="table-group-divider">
                            {salidas.map((salida, index) => (
                              <tr key={`${salida.ID_STOCK}-${index}`}>
                                <td className="table-info">{index + 1}</td>
                                <td>{salida.producto}</td>
                                <td className="table-info">{salida.presentacion_nombre}</td>
                                <td>{salida.cantidad}</td>
                                <td>{salida.usuario}</td>
                                <td>{formatearMoneda(salida.iva_aplicado)}</td>
                                <td>{formatearMoneda(salida.subtotal)}</td>
                                <td>{formatearMoneda(salida.total_venta)}</td>
                                <td>{formatearMoneda(salida.valor_unitario_movimiento)}</td>
                                <td>{formatearFecha(salida.fecha_hora_movimiento)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Salidas;