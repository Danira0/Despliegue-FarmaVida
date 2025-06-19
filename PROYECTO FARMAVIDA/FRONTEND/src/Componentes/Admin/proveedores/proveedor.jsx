import React, { useEffect, useState } from "react";
import { useAuth } from "../../Auth/auth.jsx";
import api from "../../API/api.js";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Menu from "../../home/admimenulateral.jsx";

function Proveedor() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const [laboratorio, setLaboratorio] = useState([]);
  const [ID_Laboratorio, setID_Laboratorio] = useState("");
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo_electronico, setCorreo_electronico] = useState("");
  const [pagina_web, setPagina_web] = useState("");
  const [imagen, setImagen] = useState(null);
  const [imagenPreview, setImagenPreview] = useState("");
  const [operacion, setOperacion] = useState(1);
  const [title, setTitle] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    getProveedores();
  }, []);

  const getProveedores = async () => {
    const respuesta = await api.get(
      "/obtener/proveedores"
    );
    setLaboratorio(respuesta.data);
  };

  const openModal = (
    op,
    ID_Laboratorio,
    nombre,
    direccion,
    ciudad,
    telefono,
    correo_electronico,
    pagina_web,
    imagen_producto
  ) => {
    setID_Laboratorio(ID_Laboratorio || "");
    setNombre(nombre || "");
    setDireccion(direccion || "");
    setCiudad(ciudad || "");
    setTelefono(telefono || "");
    setCorreo_electronico(correo_electronico || "");
    setPagina_web(pagina_web || "");
    setImagen(null);
    setImagenPreview(
      imagen_producto ? `/${imagen_producto}` : ""
    );
    setOperacion(op);
    if (op === 1) {
      setTitle("Registrar Proveedor");
    } else if (op === 2) {
      setTitle("Editar Proveedor");
    }
    setShowForm(true);
    window.setTimeout(function () {
      document.getElementById("nombre").focus();
    }, 500);
  };

  const closeModal = () => {
    setShowForm(false);
    setImagen(null);
    setImagenPreview("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagen(file);
      setImagenPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("direccion", direccion);
    formData.append("ciudad", ciudad);
    formData.append("telefono", telefono);
    formData.append("correo_electronico", correo_electronico);
    formData.append("pagina_web", pagina_web);
    if (imagen) {
      formData.append("imagen", imagen);
    }

    try {
      if (operacion === 1) {
       await api.post(
          "/registrar/proveedores",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else if (operacion === 2) {
         await api.put(
          `/actualizar/proveedores/${ID_Laboratorio}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      getProveedores();
      closeModal();
      Swal.fire({
        icon: "success",
        title: "Exito",
        text:
          operacion === 1
            ? "Proveedor registrado correctamente"
            : "Proveedores actualizado correctamente",
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Hubo un error al procesar la solicitud",
      });
    }
  };

  const validar = (e) => {
    if (nombre.trim() === "") {
      show_alerta("El campo nombre es obligatorio", "error");
    } else if (direccion.trim() === "") {
      show_alerta("El campo dirección es obligatorio", "error");
    } else if (ciudad.trim() === "") {
      show_alerta("El campo ciudad es obligatorio", "error");
    } else if (telefono.trim() === "") {
      show_alerta("El campo teléfono es obligatorio", "error");
    } else if (correo_electronico.trim() === "") {
      show_alerta("El campo correo electrónico es obligatorio", "error");
    } else if (pagina_web.trim() === "") {
      show_alerta("El campo página web es obligatorio", "error");
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

  const deleteProveedor = async (ID_Laboratorio, nombre) => {
    const MySwal = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    MySwal.fire({
      title: `¿Estás seguro de eliminar a ${nombre}?`,
      icon: "question",
      text: "Esta acción no se puede deshacer",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
         await api.delete(
            `/eliminar/proveedores/${ID_Laboratorio}`
          );
          getProveedores();
          show_alerta("Proveedor eliminado correctamente", "success");
        } catch (error) {
          console.error(error);
          show_alerta(
            error?.response?.data?.message ||
              error?.message ||
              "Error al eliminar el proveedor",
            "error"
          );
        }
      } else {
        show_alerta("Operación cancelada", "info");
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
          <div className="mlat col-2 md-2">
            <Menu />
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
                        Proveedor
                      </button>
                    </div>
                  </div>
                </div>
                <div className="tabla_medic row mt-6">
                  <div className="col-12 col-lg-10 offset-lg-1">
                    <div className="table-responsives">
                      <table className="table table-bordered">
                        <thead>
                          <tr className="table-primary">
                            <th>ID</th>
                            <th>Imagen</th>
                            <th>Nombre</th>
                            <th>Dirección</th>
                            <th>Ciudad</th>
                            <th>Telefono</th>
                            <th>Correo Electronico</th>
                            <th>Pagina Web</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="table-group-divider">
                          {laboratorio.map((proveedor) => (
                            <tr key={proveedor.ID_Laboratorio}>
                              <td className="table-info">
                                {proveedor.ID_Laboratorio}
                              </td>
                              <td>
                                {proveedor.imagen_producto && (
                                  <img
                                    src={`/${proveedor.imagen_producto}`}
                                    alt="Imagen del proveedor"
                                    width="120px"
                                    height="80px"
                                    style={{ objectFit: "cover" }}
                                  />
                                )}
                              </td>
                              <td className="table-info">
                                {proveedor.nombre}{" "}
                              </td>
                              <td>{proveedor.direccion} </td>
                              <td className="table-info">
                                {proveedor.ciudad}{" "}
                              </td>
                              <td>{proveedor.telefono}</td>
                              <td className="table-info">
                                {proveedor.correo_electronico}
                              </td>
                              <td>{proveedor.pagina_web}</td>
                              <td>
                                <button
                                  onClick={() =>
                                    openModal(
                                      2,
                                      proveedor.ID_Laboratorio,
                                      proveedor.nombre,
                                      proveedor.direccion,
                                      proveedor.ciudad,
                                      proveedor.telefono,
                                      proveedor.correo_electronico,
                                      proveedor.pagina_web,
                                      proveedor.imagen_producto
                                    )
                                  }
                                  className="btn btn-warning"
                                >
                                  <i className="fa-solid fa-edit"></i>
                                </button>
                                &nbsp;
                                <button
                                  onClick={() =>
                                    deleteProveedor(
                                      proveedor.ID_Laboratorio,
                                      proveedor.nombre
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
              {showForm && (
                <div
                  id="modalProveedor"
                  className="modal-fade"
                  aria-hidden="true"
                >
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <label className="h5">{title}</label>
                      </div>
                      <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                          <input
                            type="hidden"
                            id="ID_Laboratorio"
                            value={ID_Laboratorio}
                          />

                          <div className="mb-3">
                            <label htmlFor="imagen" className="form-label">
                              Imagen del Proveedor
                            </label>
                            <input
                              type="file"
                              className="form-control"
                              id="imagen"
                              accept="image/*"
                              onChange={handleImageChange}
                            />
                            {imagenPreview && (
                              <div className="mt-2">
                                <img
                                  src={imagenPreview}
                                  alt="Vista previa"
                                  style={{
                                    maxWidth: "250px",
                                    maxHeight: "250px",
                                  }}
                                />
                              </div>
                            )}
                          </div>

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
                              <i className="fas fa-map-marker-alt"></i>
                            </span>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Dirección"
                              value={direccion}
                              onChange={(e) => setDireccion(e.target.value)}
                            />
                          </div>
                          <div className="input-group mb-3">
                            <span className="input-group-text">
                              <i className="fas fa-city"></i>
                            </span>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Ciudad"
                              value={ciudad}
                              onChange={(e) => setCiudad(e.target.value)}
                            />
                          </div>
                          <div className="input-group mb-3">
                            <span className="input-group-text">
                              <i className="fas fa-phone"></i>
                            </span>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Teléfono"
                              value={telefono}
                              onChange={(e) => setTelefono(e.target.value)}
                            />
                          </div>
                          <div className="input-group mb-3">
                            <span className="input-group-text">
                              <i className="fas fa-envelope"></i>
                            </span>
                            <input
                              type="email"
                              className="form-control"
                              placeholder="Correo Electrónico"
                              value={correo_electronico}
                              onChange={(e) =>
                                setCorreo_electronico(e.target.value)
                              }
                            />
                          </div>
                          <div className="input-group mb-3">
                            <span className="input-group-text">
                              <i className="fas fa-globe"></i>
                            </span>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Página Web"
                              value={pagina_web}
                              onChange={(e) => setPagina_web(e.target.value)}
                            />
                          </div>
                          <div className="d-grid col-6 mx-auto">
                            <button
                              type="button"
                              onClick={(e) => validar(e)}
                              className="btn btn-success"
                            >
                              <i
                                className="fa-solid fa-floppy-disk"
                                aria-hidden="true"
                              ></i>{" "}
                              Guardar
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
    </div>
  );
}

export default Proveedor;
