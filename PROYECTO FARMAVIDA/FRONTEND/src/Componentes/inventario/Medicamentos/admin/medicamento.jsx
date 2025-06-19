import React, { useEffect, useState } from "react";
import { useAuth } from "../../../Auth/auth.jsx";
import api from "../../../API/api.js";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "../../Medicamentos/admin/medicamento.css";
import Menu from "../../../home/admimenulateral.jsx";
import EmpleadoMenu from "../../../home/emplemenulateral.jsx";
import "../../../../App.css";

function Producto() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleFilterChange = (value) => {
    if (value === "vencimiento") {
      navigate("/caducidad");
    } else if (value === "filtro_az") {
      setOrdenAZ(true);
    } else if (value === "stock") {
      navigate("/stockMinimo");
    }
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

  const ordenarProductosAZ = (productos) => {
    return productos.slice().sort((a, b) => {
      if (a.nombre < b.nombre) return -1;
      if (a.nombre > b.nombre) return 1;
      return 0;
    });
  };

  const [producto, setProducto] = useState([]);
  const [ID_PRODUCTO, setID_PRODUCTO] = useState("");
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha_entrada, setFecha_entrada] = useState("");
  const [CategoriaID_Categoria, setCategoriaID_Categoria] = useState("");
  const [PresentacionID_Presentacion, setPresentacionID_Presentacion] =
    useState("");
  const [LaboratorioID_Laboratorio, setLaboratorioID_Laboratorio] =
    useState("");
  const [IVA, setIVA] = useState("");
  const [EstadoID_Estado, setEstadoID_Estado] = useState("");
  const [valor_unitario, setValor_unitario] = useState("");
  const [stock_minimo, setStock_minimo] = useState("");
  const [unidades_por_blister, setUnidades_por_blister] = useState("");
  const [cantidad_blister, setCantidad_blister] = useState("");
  const [cantidad_unidades, setCantidad_unidades] = useState("");
  const [cantidad_frascos, setCantidad_frascos] = useState("");
  const [contenido_neto, setContenido_neto] = useState("");
  const [lote, setLote] = useState("");
  const [codigo_barras, setCodigo_barras] = useState("");
  const [fecha_vencimiento, setFecha_vencimiento] = useState("");
  const [ordenAZ, setOrdenAZ] = useState(false);
  const [buscarMedic, setBuscarMedic] = useState("");
  const [imagen, setImagen] = useState("");
  const [imagenPreview, setImagenPreview] = useState("");
  const [laboratorio, setLaboratorio] = useState([]);
  const [fecha_actualizacion, setFecha_actualizacion] = useState("");
  const [isTabletaCapsulas, setIsTabletaCapsulas] = useState(false);
  const [operacion, setOperacion] = useState("");
  const [scrollPosition, setScrollPosition] = useState(0);
  const [title, setTitle] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleScrollChange = (e) => {
    const position = e.target.value;
    setScrollPosition(position);

    const tableContainer = document.querySelector(".table-responsive");
    if (tableContainer) {
      const maxScroll = tableContainer.scrollWidth - tableContainer.clientWidth;
      tableContainer.scrollLeft = (position / 100) * maxScroll;
    }
  };

  useEffect(() => {
    getProductos();
    getNombresLaboratorios();
  }, []);

  useEffect(() => {
    if (
      PresentacionID_Presentacion === "1" ||
      PresentacionID_Presentacion === "2"
    ) {
      setIsTabletaCapsulas(true);
      setCantidad_frascos("");
      setContenido_neto("");
    } else if (["3", "4", "5", "6"].includes(PresentacionID_Presentacion)) {
      setIsTabletaCapsulas(false);
      setUnidades_por_blister("");
      setCantidad_blister("");
    }
  }, [PresentacionID_Presentacion]);

  const getNombresLaboratorios = async () => {
    try {
      const response = await api.get("/obtener/laboratorios/nombres");
      setLaboratorio(response.data);
    } catch (error) {
      console.error("Error al obtener los laboratorios:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron obtener los laboratorios",
      });
    }
  };

  const getProductos = async () => {
    try {
      const response = await api.get("/obtener/productos");
      setProducto(response.data);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron obtener los productos",
      });
    }
  };

  const handleSearch = () => {
    if (buscarMedic.trim() === "") {
      getProductos();
    } else {
      const productosFiltrados = producto.filter((prod) =>
        prod.nombre.toLowerCase().includes(buscarMedic.toLowerCase())
      );
      setProducto(productosFiltrados);
    }
  };

  useEffect(() => {
    if (buscarMedic.trim() !== "") {
      const productosFiltrados = producto.filter((prod) =>
        prod.nombre.toLowerCase().includes(buscarMedic.toLowerCase())
      );
      setProducto(productosFiltrados);
    } else {
      getProductos();
    }
  }, [buscarMedic]);

  const openModal = (
    op,
    ID_PRODUCTO,
    nombre,
    descripcion,
    fecha_entrada,
    CategoriaID_Categoria,
    PresentacionID_Presentacion,
    LaboratorioID_Laboratorio,
    IVA,
    EstadoID_Estado,
    valor_unitario,
    stock_minimo,
    unidades_por_blister,
    cantidad_blister,
    cantidad_unidades,
    cantidad_frascos,
    contenido_neto,
    lote,
    fecha_actualizacion,
    fecha_vencimiento,
    codigo_barras,
    imagen_producto
  ) => {
    setID_PRODUCTO(ID_PRODUCTO || "");
    setNombre(nombre || "");
    setDescripcion(descripcion || "");
    setFecha_entrada(fecha_entrada ? fecha_entrada.split("T")[0] : "");
    setFecha_actualizacion(
      fecha_actualizacion ? fecha_actualizacion.split("T")[0] : ""
    );
    setCategoriaID_Categoria(CategoriaID_Categoria || "");
    setPresentacionID_Presentacion(PresentacionID_Presentacion || "");
    setLaboratorioID_Laboratorio(LaboratorioID_Laboratorio || "");
    setIVA(IVA || "");
    setEstadoID_Estado(EstadoID_Estado || "");
    setValor_unitario(valor_unitario || "");
    setStock_minimo(stock_minimo || "");
    setUnidades_por_blister(unidades_por_blister || "");
    setCantidad_blister(cantidad_blister || "");
    setCantidad_unidades(cantidad_unidades || "");
    setCantidad_frascos(cantidad_frascos || "");
    setContenido_neto(contenido_neto || "");
    setLote(lote || "");
    setFecha_vencimiento(
      fecha_vencimiento ? fecha_vencimiento.split("T")[0] : ""
    );
    setCodigo_barras(codigo_barras || "");
    setImagen(null);
    setImagenPreview(imagen_producto ? `/${imagen_producto}` : "");
    setOperacion(op);
    setTitle(op === 1 ? "Registrar Producto" : "Editar Producto");
    setShowForm(true);
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
    formData.append("descripcion", descripcion);
    formData.append("fecha_entrada", fecha_entrada);
    formData.append("fecha_actualizacion", new Date().toISOString());
    formData.append("CategoriaID_Categoria", CategoriaID_Categoria);
    formData.append("PresentacionID_Presentacion", PresentacionID_Presentacion);
    formData.append("LaboratorioID_Laboratorio", LaboratorioID_Laboratorio);
    formData.append("IVA", IVA);
    formData.append("EstadoID_Estado", EstadoID_Estado);
    formData.append("valor_unitario", valor_unitario);
    formData.append("stock_minimo", stock_minimo);
    formData.append("unidades_por_blister", unidades_por_blister || null);
    formData.append("cantidad_blister", cantidad_blister || null);
    formData.append("cantidad_unidades", cantidad_unidades || null);
    formData.append("cantidad_frascos", cantidad_frascos || null);
    formData.append("contenido_neto", contenido_neto || null);
    formData.append("lote", lote);
    formData.append("fecha_vencimiento", fecha_vencimiento);
    formData.append("codigo_barras", codigo_barras || null);

    if (imagen) {
      formData.append("imagen", imagen);
    }

    try {
      let response;
      if (operacion === 1) {
        response = await api.post("/registrar/productos", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else if (operacion === 2) {
        response = await api.put(
          `/actualizar/productos/${ID_PRODUCTO}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }
      if (response.status === 200 || response.status === 201) {
        getProductos();
        closeModal();
        Swal.fire({
          icon: "success",
          title: "Éxito",
          text:
            operacion === 1
              ? "Producto registrado correctamente"
              : "Producto actualizado correctamente",
        });
      } else {
        throw new Error("Respuesta inesperada del servidor");
      }
    } catch (error) {
      console.error("Error al procesar la solicitud:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          "Hubo un error al procesar la solicitud",
      });
    }
  };

  const validar = (e) => {
    if (PresentacionID_Presentacion.trim() === "") {
      show_alerta("El campo Presentación es obligatorio", "error");
    } else if (nombre.trim() === "") {
      show_alerta("El campo nombre es obligatorio", "error");
    } else if (descripcion.trim() === "") {
      show_alerta("El campo de Descripción es obligatorio", "error");
    } else if (String(CategoriaID_Categoria).trim() === "") {
      show_alerta("El campo Categoría es obligatorio", "error");
    } else if (fecha_entrada.trim() === "") {
      show_alerta("El campo de Fecha de entrada es obligatorio", "error");
    } else if (String(LaboratorioID_Laboratorio).trim() === "") {
      show_alerta("El campo de Laboratorio es obligatorio", "error");
    } else if (String(IVA).trim() === "") {
      show_alerta("El campo de IVA es obligatorio", "error");
    } else if (String(EstadoID_Estado).trim() === "") {
      show_alerta("El campo de Estado del producto es obligatorio", "error");
    } else if (String(valor_unitario).trim() === "") {
      show_alerta("El campo de Valor unitario es obligatorio", "error");
    } else if (String(stock_minimo).trim() === "") {
      show_alerta("El campo de Stock mínimo es obligatorio", "error");
    } else if (lote.trim() === "") {
      show_alerta("El campo de Lote es obligatorio", "error");
    } else if (fecha_vencimiento.trim() === "") {
      show_alerta("El campo de Fecha de vencimiento es obligatorio", "error");
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

  const deleteProducto = async (ID_PRODUCTO, nombre) => {
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
          const response = await api.delete(
            `/eliminar/productos/${ID_PRODUCTO}`
          );

          if (response.status === 200) {
            getProductos();
            show_alerta("Producto eliminado correctamente", "success");
          }
        } catch (error) {
          show_alerta(error.response.data.message, "error");
          if (error.response.data.details) {
            Swal.fire({
              title: "Detalles",
              text: error.response.data.details,
              icon: "info",
            });
          } else {
            show_alerta("Error al eliminar el Producto", "error");
          }
        }
      } else {
        show_alerta("Operación cancelada", "info");
      }
    });
  };

  const productosMostrados = ordenAZ ? ordenarProductosAZ(producto) : producto;

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
          <EmpleadoMenu />
          <div className="search-container">
            <div className="btn_busq">
              <button
                type="button"
                onClick={handleSearch}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                }}
                aria-label="Buscar"
              >
                <img
                  src="./Assets/lupa.png"
                  alt="lupa"
                  style={{ pointerEvents: "none" }}
                />
              </button>
              <input
                type="text"
                className="input-busqueda"
                placeholder="Buscar Medicamento"
                value={buscarMedic}
                onChange={(e) => setBuscarMedic(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <div>
              <select
                id="filterSelect"
                className="formulario"
                aria-label="Selecciona un filtro de búsqueda"
                onChange={(e) => handleFilterChange(e.target.value)}
              >
                <option value="" disabled selected>
                  Filtro de Medicamentos
                </option>
                <option value="filtro_az">filtro (A-Z)</option>
                <option value="vencimiento">Proximos Vencer</option>
                <option value="stock">Deficit Stock</option>
              </select>
            </div>
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
                        Producto
                      </button>
                    </div>
                  </div>
                </div>
                <div className="scroll-control mb-3">
                  <input
                    type="range"
                    className="form-range"
                    id="tableScrollRange"
                    min="0"
                    max="100"
                    value={scrollPosition}
                    onChange={handleScrollChange}
                    aria-label="Control de desplazamiento horizontal de la tabla"
                  />
                </div>
                <div className="col-10 col-lg-8">
                  <div
                    className="table-responsive mt-3"
                    style={{ maxHeight: "815px", overflowY: "auto" }}
                  >
                    <table className="table table-bordered">
                      <thead>
                        <tr className="table-primary">
                          <th>#</th>
                          <th>Imagen</th>
                          <th>Presentación</th>
                          <th>Nombre</th>
                          <th>Descripción</th>
                          <th>Categoria</th>
                          <th>Fecha de Entrada</th>
                          <th>Laboratorio</th>
                          <th>IVA</th>
                          <th>Estado del Producto</th>
                          <th>Valor Unitario</th>
                          <th>Stock Minimo</th>
                          <th>Unidades por Blister</th>
                          <th>Cantidad de Blister</th>
                          <th>Cantidad de Unidades</th>
                          <th>Cantidad de Frascos</th>
                          <th>Contenido Neto</th>
                          <th>Lote</th>
                          <th>Fecha de Actualización</th>
                          <th>Fecha de Vencimiento</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="table-group-divider">
                        {productosMostrados.map((producto) => (
                          <tr key={producto.ID_PRODUCTO}>
                            <td className="table-info">
                              {producto.ID_PRODUCTO}
                            </td>
                            <td>
                              {producto.imagen_producto ? (
                                <img
                                  src={`http://localhost:4000/${producto.imagen_producto}`}
                                  alt="Imagen del producto"
                                  style={{
                                    width: "100px",
                                    height: "100px",
                                    objectFit: "cover",
                                  }}
                                />
                              ) : (
                                <span>No hay imagen</span>
                              )}
                            </td>
                            <td className="table-info">
                              {producto.presentacion_nombre}
                            </td>
                            <td>{producto.nombre}</td>
                            <td className="table-info">
                              {producto.descripcion}
                            </td>
                            <td>{producto.categoria_nombre}</td>
                            <td className="table-info">
                              {formatearFecha(producto.fecha_entrada)}
                            </td>
                            <td>{producto.laboratorio_nombre}</td>
                            <td className="table-info">{producto.IVA}</td>
                            <td>{producto.estado_nombre}</td>
                            <td className="table-info">
                              {new Intl.NumberFormat("es-CO", {
                                style: "currency",
                                currency: "COP",
                              }).format(producto.valor_unitario)}
                            </td>
                            <td>{producto.stock_minimo}</td>
                            <td className="table-info">
                              {producto.unidades_por_blister}
                            </td>
                            <td>{producto.cantidad_blister}</td>
                            <td className="table-info">
                              {producto.cantidad_unidades}
                            </td>
                            <td>{producto.cantidad_frascos}</td>
                            <td className="table-info">
                              {producto.contenido_neto}
                            </td>
                            <td>{producto.lote}</td>
                            <td className="table-info">
                              {formatearFecha(producto.fecha_actualizacion)}
                            </td>
                            <td>
                              {formatearFecha(producto.fecha_vencimiento)}
                            </td>
                            <td>
                              <button
                                onClick={() =>
                                  openModal(
                                    2,
                                    producto.ID_PRODUCTO,
                                    producto.nombre,
                                    producto.descripcion,
                                    producto.fecha_entrada,
                                    producto.CategoriaID_Categoria,
                                    producto.PresentacionID_Presentacion,
                                    producto.LaboratorioID_Laboratorio,
                                    producto.IVA,
                                    producto.EstadoID_Estado,
                                    producto.valor_unitario,
                                    producto.stock_minimo,
                                    producto.unidades_por_blister,
                                    producto.cantidad_blister,
                                    producto.cantidad_unidades,
                                    producto.cantidad_frascos,
                                    producto.contenido_neto,
                                    producto.lote,
                                    producto.fecha_actualizacion,
                                    producto.fecha_vencimiento,
                                    producto.codigo_barras,
                                    producto.imagen_producto
                                  )
                                }
                                className="btn btn-warning"
                              >
                                <i className="fa-solid fa-edit"></i>
                              </button>
                              &nbsp;
                              <button
                                onClick={() =>
                                  deleteProducto(
                                    producto.ID_PRODUCTO,
                                    producto.nombre
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
              {showForm && (
                <div
                  id="modalProducto"
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
                            id="ID_PRODUCTO"
                            value={ID_PRODUCTO}
                          />
                          <small className="form-text text-muted mb-2">
                            Presentación
                          </small>
                          <div className="input-group mb-3">
                            <span className="input-group-text">
                              <i className="fas fa-pills"></i>
                            </span>
                            <select
                              id="PresentacionID_Presentacion"
                              className="form-control"
                              value={PresentacionID_Presentacion}
                              onChange={(e) =>
                                setPresentacionID_Presentacion(e.target.value)
                              }
                            >
                              <option value="">
                                Seleccione la Presentación
                              </option>
                              <option value="1">Cápsulas</option>
                              <option value="2">Tabletas</option>
                              <option value="3">Jarabe</option>
                              <option value="4">Gotas</option>
                              <option value="5">Crema</option>
                              <option value="6">Inyectable</option>
                            </select>
                          </div>
                          <div className="col-md-12 mb-3">
                            <div className="mb-3">
                              <label
                                className="form-label"
                                htmlFor="imagen_producto"
                              >
                                Imagen del Producto
                              </label>
                              <input
                                type="file"
                                id="imagen_producto"
                                className="form-control"
                                accept="image/*"
                                onChange={handleImageChange}
                              />
                              {imagenPreview && (
                                <div className="mt-2 text-center">
                                  <img
                                    src={imagenPreview}
                                    alt="Vista previa"
                                    style={{
                                      maxWidth: "150px",
                                      maxHeight: "150px",
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                          <small className="form-text text-muted mb-2">
                            Nombre
                          </small>
                          <div className="input-group mb-3">
                            <span className="input-group-text">
                              <i className="fas fa-notes-medical "></i>
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
                          <small className="form-text text-muted mb-2">
                            Descripcion
                          </small>
                          <div className="input-group mb-3">
                            <span className="input-group-text">
                              <i className="fas fa-align-left"></i>
                            </span>
                            <input
                              type="text"
                              id="descripcion"
                              className="form-control"
                              placeholder="Descripción"
                              value={descripcion}
                              onChange={(e) => setDescripcion(e.target.value)}
                            />
                          </div>
                          <small className="form-text text-muted mb-2">
                            Fecha de Entrada
                          </small>
                          <div className="input-group mb-3">
                            <span className="input-group-text">
                              <i className="fas fa-calendar-alt"></i>
                            </span>
                            <input
                              type="date"
                              id="fecha_entrada"
                              className="form-control"
                              placeholder="Fecha Entrada"
                              value={fecha_entrada}
                              onChange={(e) => setFecha_entrada(e.target.value)}
                            />
                          </div>
                          <small className="form-text text-muted mb-2">
                            Categoria
                          </small>
                          <div className="input-group mb-3">
                            <span className="input-group-text">
                              <i className="fas fa-tags"></i>
                            </span>
                            <select
                              className="form-control"
                              placeholder="Categoria"
                              value={CategoriaID_Categoria}
                              onChange={(e) =>
                                setCategoriaID_Categoria(e.target.value)
                              }
                            >
                              <option value="">Seleccione la Categoria</option>
                              <option value="1">Analgésicos</option>
                              <option value="2">Antibióticos</option>
                              <option value="3">Vitaminas</option>
                              <option value="4">Antihistamínicos</option>
                              <option value="5">Ibuprofeno</option>
                            </select>
                          </div>
                          <small className="form-text text-muted mb-2">
                            Proveedor
                          </small>
                          <div className="input-group mb-3">
                            <span className="input-group-text">
                              <i className="fas fa-flask"></i>
                            </span>
                            <select
                              className="form-control"
                              placeholder="Proveedor"
                              value={LaboratorioID_Laboratorio}
                              onChange={(e) =>
                                setLaboratorioID_Laboratorio(e.target.value)
                              }
                            >
                              <option value="">Seleccione el Proveedor</option>
                              {laboratorio.map((lab) => (
                                <option
                                  key={lab.ID_Laboratorio}
                                  value={lab.ID_Laboratorio}
                                >
                                  {lab.nombre}
                                </option>
                              ))}
                            </select>
                          </div>
                          <small className="form-text text-muted mb-2">
                            IVA
                          </small>
                          <div className="input-group mb-3">
                            <span className="input-group-text">
                              <i className="fas fa-percent"></i>
                            </span>
                            <select
                              className="form-control"
                              placeholder="IVA"
                              value={IVA}
                              onChange={(e) => setIVA(e.target.value)}
                            >
                              <option value="">Seleccione el IVA</option>
                              <option value="1">No aplica</option>
                            </select>
                          </div>

                          <small className="form-text text-muted mb-2">
                            Estado del producto
                          </small>
                          <div className="input-group mb-3">
                            <span className="input-group-text">
                              <i className="fas fa-toggle-on"></i>
                            </span>
                            <select
                              className="form-control"
                              placeholder="Estado del producto"
                              value={EstadoID_Estado}
                              onChange={(e) =>
                                setEstadoID_Estado(e.target.value)
                              }
                            >
                              <option value="">Seleccione el Estado</option>
                              <option value="1">Activo</option>
                              <option value="2">Inactivo</option>
                            </select>
                          </div>
                          <small className="form-text text-muted mb-2">
                            Valor Unitario
                          </small>
                          <div className="input-group mb-3">
                            <span className="input-group-text">
                              <i className="fas fa-dollar-sign"></i>
                            </span>
                            <input
                              type="text"
                              id="valor_unitario"
                              className="form-control"
                              placeholder="Valor Unitario"
                              value={new Intl.NumberFormat("es-CO", {
                                style: "currency",
                                currency: "COP",
                                minimumFractionDigits: 0,
                              }).format(valor_unitario || 0)}
                              onChange={(e) => {
                                const numericValue = e.target.value.replace(
                                  /\D/g,
                                  ""
                                );
                                setValor_unitario(numericValue);
                              }}
                            />
                          </div>
                          <small className="form-text text-muted mb-2">
                            Stock
                          </small>
                          <div className="input-group mb-3">
                            <span className="input-group-text">
                              <i className="fas fa-box"></i>
                            </span>
                            <input
                              type="number"
                              id="stock_minimo"
                              className="form-control"
                              placeholder="stock Minimo"
                              value={stock_minimo}
                              onChange={(e) => setStock_minimo(e.target.value)}
                            />
                          </div>
                          <small className="form-text text-muted mb-2">
                            Lote
                          </small>
                          <div className="input-group mb-3">
                            <span className="input-group-text">
                              <i className="fas fa-cube"></i>
                            </span>
                            <input
                              type="text"
                              id="lote"
                              className="form-control"
                              placeholder="Lote"
                              value={lote}
                              onChange={(e) => setLote(e.target.value)}
                            />
                          </div>
                          <small className="form-text text-muted mb-2">
                            Fecha de Vencimiento
                          </small>
                          <div className="input-group mb-3">
                            <span className="input-group-text">
                              <i className="fas fa-calendar-alt"></i>
                            </span>
                            <input
                              type="date"
                              id="fecha_vencimiento"
                              className="form-control"
                              placeholder="Fecha de Vencimiento"
                              value={fecha_vencimiento}
                              onChange={(e) =>
                                setFecha_vencimiento(e.target.value)
                              }
                            />
                          </div>

                          <div className="row">
                            {(PresentacionID_Presentacion === "1" ||
                              PresentacionID_Presentacion === "2") && (
                              <>
                                <div className="col-md-6">
                                  <small className="form-text text-muted mb-2">
                                    Unidades por Blister
                                  </small>
                                  <div className="input-group mb-3">
                                    <span className="input-group-text">
                                      <i className="fas fa-pills"></i>
                                    </span>
                                    <input
                                      type="number"
                                      className="form-control"
                                      placeholder="Unidades por Blister"
                                      value={unidades_por_blister}
                                      onChange={(e) =>
                                        setUnidades_por_blister(e.target.value)
                                      }
                                    />
                                  </div>
                                </div>

                                <div className="col-md-6">
                                  <small className="form-text text-muted mb-2">
                                    Cantidad de Blister
                                  </small>
                                  <div className="input-group mb-3">
                                    <span className="input-group-text">
                                      <i className="fas fa-capsules"></i>
                                    </span>
                                    <input
                                      type="number"
                                      className="form-control"
                                      placeholder="Cantidad de Blister"
                                      value={cantidad_blister}
                                      onChange={(e) =>
                                        setCantidad_blister(e.target.value)
                                      }
                                    />
                                  </div>
                                </div>
                              </>
                            )}
                            {(PresentacionID_Presentacion === "3" ||
                              PresentacionID_Presentacion === "4" ||
                              PresentacionID_Presentacion === "5" ||
                              PresentacionID_Presentacion === "6") && (
                              <>
                                <div className="col-md-6">
                                  <small className="form-text text-muted mb-2">
                                    Cantidad de Frascos
                                  </small>
                                  <div className="input-group mb-3">
                                    <span className="input-group-text">
                                      <i className="fas fa-prescription-bottle"></i>
                                    </span>
                                    <input
                                      type="number"
                                      className="form-control"
                                      placeholder="Cantidad de Frascos"
                                      value={cantidad_frascos}
                                      onChange={(e) =>
                                        setCantidad_frascos(e.target.value)
                                      }
                                    />
                                  </div>
                                </div>

                                <div className="col-md-6">
                                  <small className="form-text text-muted mb-2">
                                    Contenido Neto
                                  </small>
                                  <div className="input-group mb-3">
                                    <span className="input-group-text">
                                      <i className="fas fa-boxes"></i>
                                    </span>
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="Contenido Neto"
                                      value={contenido_neto}
                                      onChange={(e) =>
                                        setContenido_neto(e.target.value)
                                      }
                                    />
                                  </div>
                                </div>
                              </>
                            )}
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

export default Producto;
