import React, { useEffect, useState } from "react";
import api from "../../../API/api.js";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../../src/Componentes/Auth/auth.jsx";
import Menu from "../../../../Componentes/home/admimenulateral.jsx";

function Entradas() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [entradas, setEntradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Estado para errores

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const año = fecha.getFullYear();
    const horas = String(fecha.getHours()).padStart(2, "0");
    const minutos = String(fecha.getMinutes()).padStart(2, "0");
    return `${dia}/${mes}/${año} ${horas}:${minutos}`;
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    const fetchEntradas = async () => {
      try {
        const response = await api.get('/obtener/entradas'); 
        if (response.data.success) {
          setEntradas(response.data.data);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        console.error("Error fetching entradas:", err);
        setError("Error al obtener las entradas");
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las entradas',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEntradas();
  }, []);

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
                      {loading ? (
                        <div className="alert alert-info" role="alert">
                          Cargando entradas...
                        </div>
                      ) : error ? (
                        <div className="alert alert-danger" role="alert">
                          {error}
                        </div>
                      ) : entradas.length === 0 ? (
                        <div className="alert alert-info" role="alert">
                          No hay registros de entradas disponibles.
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
                              <th>Fecha y Hora</th>
                            </tr>
                          </thead>
                          <tbody className="table-group-divider">
                            {entradas.map((entrada, index) => (
                              <tr key={`${entrada.ID_PRODUCTO}-${index}`}>
                                <td className="table-info">{index + 1}</td>
                                <td>{entrada.producto}</td>
                                <td className="table-info">{entrada.presentacion_nombre}</td>
                                <td>{entrada.cantidad}</td>
                                <td>{entrada.usuario}</td>
                                <td>{formatearFecha(entrada.fecha_hora_movimiento)}</td>
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

export default Entradas;