import React, { useEffect, useState } from "react";
import { useAuth } from "../../../Auth/auth.jsx";
import { useNavigate } from "react-router-dom";
import api from "../../../API/api.js";
import Swal from "sweetalert2";
import Menu from "../../../home/admimenulateral.jsx";

function Emplecrud() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const año = fecha.getFullYear();
    return `${dia}/${mes}/${año}`;
  };

  const fechaISO = "2025-02-22T05:00:00.000Z";
  console.log(formatearFecha(fechaISO));

  const [empleados, setEmpleados] = useState([]);
  const [ID_Usuario, setID_Usuario] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [nombre_usuario, setNombre_usuario] = useState("");
  const [contrasena_usuario, setContrasena_usuario] = useState("");
  const [fecha_registro, setFecha_registro] = useState("");
  const [ROLID_ROL, setROLID_ROL] = useState("");
  const [operacion, setOperacion] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");

  useEffect(() => {
    getEmpleados();
  }, []);

  const getEmpleados = async () => {
    try {
       const respuesta = await api.get(
        "/obtener/empleado"
      );
      setEmpleados(respuesta.data);
    } catch (error) {
      console.error("Error al obtener empleados:", error);
    }
  };

  const openModal = (
    op,
    ID_Usuario,
    nombre,
    apellido,
    correo,
    nombre_usuario,
    contrasena_usuario,
    fecha_registro,
    ROLID_ROL
  ) => {
    setID_Usuario(ID_Usuario || "");
    setNombre(nombre || "");
    setApellido(apellido || "");
    setCorreo(correo || "");
    setNombre_usuario(nombre_usuario || "");
    setContrasena_usuario(contrasena_usuario || "");
    setFecha_registro(fecha_registro || "");
    setROLID_ROL(ROLID_ROL || "");
    setOperacion(op);
    if (op === 1) {
      setTitle("Registrar nuevo Empleado");
    } else if (op === 2) {
      setTitle("Editar Empleado");
    }
    setShowForm(true);
    window.setTimeout(function () {
      document.getElementById("nombre").focus();
    }, 500);
  };

  const closeModal = () => {
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const empleado = {
      ID_Usuario,
      nombre,
      apellido,
      correo,
      nombre_usuario,
      contrasena_usuario,
      fecha_registro,
      ROLID_ROL: parseInt(ROLID_ROL),
    };

    try {
        if (operacion === 1) {
        await api.post(
          "/registrar/empleado",
          empleado
        );
      } else {
        await api.put(
          `/actualizar/empleado/${ID_Usuario}`,
          empleado
        );
      }
      getEmpleados();
      closeModal();
      Swal.fire({
        icon: "success",
        title: "Éxito",
        text:
          operacion === 1
            ? "Empleado registrado correctamente"
            : "Empleado actualizado correctamente",
      });
    } catch (error) {
      let errorMessage = "Hubo un error al procesar la solicitud";
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
      });
        }
      };

  const validar = (e) => {
    if (nombre.trim() === "") {
      show_alerta("El campo nombre es obligatorio", "error");
    } else if (apellido.trim() === "") {
      show_alerta("El campo de Apellido es obligatorio", "error");
    } else if (correo.trim() === "") {
      show_alerta("El campo correo es obligatorio", "error");
    } else if (nombre_usuario.trim() === "") {
      show_alerta("El campo de Nombre usuario es obligatorio", "error");
    } else if (contrasena_usuario.trim() === "") {
      show_alerta("El campo de contraseña es obligatorio", "error");
    } else if (String(ROLID_ROL).trim() === "") {
      show_alerta("El campo de rol es obligatorio", "error");
    } else {
      handleSubmit(e);
    }
  };

  const show_alerta = (msj, icon) => {
    Swal.fire({
      title: msj,
      icon: icon,
      confirmButtonText: "Aceptar",
    });
  };

 const deleteEmpleado = async (ID_Usuario, nombre) => {
  Swal.fire({
    title: `¿Eliminar a ${nombre}?`,
    text: "Esta acción no se puede deshacer",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await api.delete(
          `/eliminar/empleado/${ID_Usuario}`
        );
        getEmpleados();
        Swal.fire({
          icon: "success",
          title: "Eliminado",
          text: "Empleado eliminado correctamente",
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo eliminar",
        });
      }
    }
  });
};

  return (
    <div>
      <nav>
        <div className="head row">
          <div className="logos col p-3">
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
      <div className="container_prove">
        <div className="op row d-flex">
          <Menu />
          <div className="boton-atras-container">
            <button
              onClick={handleGoBack}
              className="btn btn-primary fle_atras"
            >
              <img src="/Assets/flecha_atras.png" alt="flecha_a" />
            </button>
          </div>
          <div className="col-lg-10 col-md-5 mt-0">
            <div className="App">
              <div className="container-fluid">
                <div className="row mt-3">
                  <div className="col-md-3 offset-md-4">
                    <div className="d-grid mx-auto">
                      <button
                        className="btn btn-dark"
                        onClick={() => openModal(1)}
                      >
                        <i className="fa-solid fa-circle-plus"></i> Añadir
                        Empleado
                      </button>
                    </div>
                  </div>
                </div>
                <div className="tabla_medic row mt-5">
                  <div className="col-10 col-lg-8">
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <td>#</td>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Correo</th>
                            <th>Nombre de usuario</th>
                            <th>Contrasena del Empleado</th>
                            <th>Fecha_registro</th>
                            <th>ROL</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="table-group-divider">
                          {empleados.map((empleado) => (
                            <tr key={empleado.ID_Usuario}>
                              <td>{empleado.ID_Usuario}</td>
                              <td>{empleado.nombre}</td>
                              <td>{empleado.apellido}</td>
                              <td>{empleado.correo}</td>
                              <td>{empleado.nombre_usuario}</td>
                              <td>{empleado.contrasena_usuario}</td>
                              <td>{formatearFecha(empleado.fecha_registro)}</td>
                              <td>{empleado.ROLID_ROL}</td>
                              <td>
                                <button
                                  onClick={() =>
                                    openModal(
                                      2,
                                      empleado.ID_Usuario,
                                      empleado.nombre,
                                      empleado.apellido,
                                      empleado.correo,
                                      empleado.nombre_usuario,
                                      empleado.contrasena_usuario,
                                      empleado.fecha_registro,
                                      empleado.ROLID_ROL
                                    )
                                  }
                                  className="btn btn-warning"
                                >
                                  <i className="fa-solid fa-edit"></i>
                                </button>
                                &nbsp;
                                <button
                                  onClick={() =>
                                    deleteEmpleado(
                                      empleado.ID_Usuario,
                                      empleado.nombre
                                    )
                                  }
                                  className="btn btn-danger"
                                >
                                  <i className="fa-solid fa-trash"></i>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {showForm && (
              <div id="modalEmpleado" className="modal-fade" aria-hidden="true">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <label className="h5">{title}</label>
                    </div>
                    <div className="modal-body">
                      <form onSubmit={handleSubmit}>
                        <input
                          type="hidden"
                          id="ID_Usuario"
                          value={ID_Usuario}
                        />
                        <div className="input-group mb-3">
                          <span className="input-group-text">
                            <i className="fas fa-user"></i>
                          </span>
                          <input
                            type="text"
                            id="nombre"
                            className="form-control"
                            placeholder="Nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                          />
                        </div>
                        <div className="input-group mb-3">
                          <span className="input-group-text">
                            <i className="fas fa-user"></i>
                          </span>
                          <input
                            type="text"
                            id="apellido"
                            className="form-control"
                            placeholder="Apellido"
                            value={apellido}
                            onChange={(e) => setApellido(e.target.value)}
                          />
                        </div>
                        <div className="input-group mb-3">
                          <span className="input-group-text">
                            <i className="fas fa-envelope"></i>
                          </span>
                          <input
                            type="email"
                            id="correo"
                            className="form-control"
                            placeholder="Correo"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                          />
                        </div>

                        <div className="input-group mb-3">
                          <span className="input-group-text">
                            <i className="fas fa-tags"></i>
                          </span>
                          <input
                            type="text"
                            id="nombre_usuario"
                            className="form-control"
                            placeholder="Nombre de Usuario"
                            value={nombre_usuario}
                            onChange={(e) => setNombre_usuario(e.target.value)}
                          />
                        </div>
                        <div className="input-group mb-3">
                          <span className="input-group-text">
                            <i className="fas fa-lock"></i>
                          </span>
                          <input
                            type="password"
                            id="contrasena_usuario"
                            className="form-control"
                            placeholder="Contraseña del Administrador"
                            value={contrasena_usuario}
                            onChange={(e) =>
                              setContrasena_usuario(e.target.value)
                            }
                          />
                          <div className="input-group mb-3 mt-3">
                            <span className="input-group-text">
                              <i className="fas fa-user-tag"></i>
                            </span>
                            <select
                              id="ROLID_ROL"
                              className="form-control"
                              value={ROLID_ROL}
                              onChange={(e) => setROLID_ROL(e.target.value)}
                            >
                              <option value="">Seleccione un rol</option>
                              <option value="2">Empleado</option>
                            </select>
                          </div>{" "}
                        </div>

                        <div className="d-grid col-6 mx-auto">
                          <button
                            type="button"
                            onClick={(e) => validar(e)}
                            className="btn btn-success"
                          >
                            <i className="fa-solid fa-floppy-disk"></i> Guardar
                          </button>
                        </div>
                      </form>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        id="btnCerrar"
                        className="btn btn-secondary"
                        onClick={closeModal}
                      >
                        Cerrar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Emplecrud;
