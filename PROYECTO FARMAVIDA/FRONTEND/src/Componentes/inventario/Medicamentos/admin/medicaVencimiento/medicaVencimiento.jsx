import React, { useEffect, useState } from "react";
import api from "../../../../API/api.js";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../Auth/auth.jsx";
import Menu from "../../../../home/admimenulateral.jsx";

function MedicaVencimiento() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const calcularDiasRestantes = (fechaVencimiento) => {
    const fechaActual = new Date();
    const fechaVenci = new Date(fechaVencimiento);
    const diferenciaTiempo = fechaVenci - fechaActual;
    const diasRestantes = Math.ceil(diferenciaTiempo / (1000 * 60 * 60 * 24));
    return diasRestantes >= 0 ? diasRestantes : "Caducado";
  };

  const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const año = fecha.getFullYear();
    return `${dia}/${mes}/${año}`;
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const [medicamento, setMedicamento] = useState([]);

  useEffect(() => {
    getFechavenci();
  }, []);

  

  const getFechavenci = async () => {
    try {
       const respuesta = await api.get("/caducidad/productos");
      if (Array.isArray(respuesta.data.expiringMedicines)) {
        setMedicamento(respuesta.data.expiringMedicines);
      } else {
        console.error("La respuesta del servidor no es un array:", respuesta.data);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "La respuesta del servidor no es válida",
        });
      }
    } catch (error) {
      console.error("Error al obtener los medicamentos próximos a vencer:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron obtener los medicamentos próximos a vencer",
      });
    }
  };

  return (
    <div>
      <div className="boton-atras-container">
        <button onClick={handleGoBack} className="btn btn-primary fle_atras">
          <img src="/Assets/flecha_atras.png" alt="flecha_a" />
        </button>
      </div>
      <nav>
        <div className="head row">
          <div className="logos col p-3">
            <img src="/Assets/logo.png" alt="Logo de la farmacia" width="250px" />
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
          <div className="col-lg-10 col-md-5 mt-0">
            <div className="App">
              <div className="container-fluid">
                <div className="row mt-5">
                  <div className="col-md-3 offset-md-4"></div>
                </div>
                <div className="tabla_medic row mt-5">
                  <div className="col-10 col-lg-8">
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead>
                          <tr className="table-primary">
                            <th>#</th>
                            <th>Nombre</th>
                            <th>Fecha de Vencimiento</th>
                            <th>Dias Restantes</th>
                          </tr>
                        </thead>
                        <tbody className="table-group-divider">
                          {medicamento.map((med) => (
                            <tr key={med.ID_PRODUCTO}>
                              <td className="table-info">{med.ID_PRODUCTO}</td>
                              <td>{med.nombre}</td>
                              <td className="table-info">{formatearFecha(med.fecha_vencimiento)}</td>
                              <td>{calcularDiasRestantes(med.fecha_vencimiento)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
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

export default MedicaVencimiento;