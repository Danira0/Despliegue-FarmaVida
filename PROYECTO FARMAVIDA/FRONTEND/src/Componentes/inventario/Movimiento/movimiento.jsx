import React, { useEffect, useState } from "react";
import { useAuth } from "../../Auth/auth.jsx";
import api from "../../API/api.js";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Menu from "../../home/admimenulateral.jsx";
import EmpleadoMenu from "../../home/emplemenulateral.jsx";
import "./../../../App.css";

function InvMovimiento() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleFilterChange = (value) => {
    if (value === "filtroEntradas") {
      navigate("/filtroEntradas");
    } else if (value === "filtroSalidas") {
      navigate("/filtroSalidas");
    }
  };

  const PRESENTACIONES_UNIDADES = [1, 2];
  const PRESENTACIONES_FRASCOS = [3, 4, 5, 6];

  const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const año = fecha.getFullYear();
    return `${dia}/${mes}/${año}`;
  };


  const [Movimiento, setMovimiento] = useState([]);
  const [ID_STOCK, setID_STOCK] = useState("");
  const [ProductoID_Producto, setProductoID_Producto] = useState("");
  const [UsuarioID_Usuario, setUsuarioID_Usuario] = useState("");
  const [PresentacionID_Presentacion, setPresentacionID_Presentacion] =
    useState("");
  const [UbicacionID_Ubicacion, setUbicacionID_Ubicacion] = useState("");
  const [motivo, setMotivo] = useState("");
  const [fecha_hora_movimiento, setFecha_hora_movimiento] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [cantidad_blister, setCantidad_blister] = useState("");
  const [unidad_por_blister, setUnidad_por_blister] = useState("");
  const [tipo_movimiento, setTipo_movimiento] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [valor_unitario_movimiento, setValor_unitario_movimiento] =
    useState("");
  const [productos, setProductos] = useState([]);
  const [usuario, setUsuario] = useState([]);
  const [presentaciones, setPresentaciones] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [iva_aplicado, setIva_aplicado] = useState("");
  const [subtotal, setSubtotal] = useState("");
  const [total_venta, setTotal_venta] = useState("");
  const [pendientesDevolucion, setPendientesDevolucion] = useState([]);
  const [
    movimientoSeleccionadoDevolucion,
    setMovimientoSeleccionadoDevolucion,
  ] = useState(null);
  const [showDevolucionModal, setShowDevolucionModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [scrollPosition, setScrollPosition] = useState(0);
  const [operacion, setOperacion] = useState("");
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
    getMovimiento();
    getProductos();
    getUsuario();
    getPresentaciones();
    getPendientesDevolucion();
  }, []);

  const getMovimiento = async () => {
    try {
      const respuesta = await api.get("/obtener/movimientos");
      console.log("Datos de entrada recibidos:", respuesta.data);
      setMovimiento(respuesta.data);
    } catch (error) {
      console.error("Error fetching movimiento:", error);
    }
  };

  const getProductos = async () => {
    try {
      const response = await api.get("/obtener/productos");
      console.log("Todos los productos cargados:", response.data);
      setProductos(response.data || []);
      setProductosFiltrados(response.data || []);
    } catch (error) {
      console.error("Error fetching productos:", error);
      setProductos([]);
      setProductosFiltrados([]);
    }
  };

  const getProductosByPresentacion = async (presentacionId) => {
    try {
      const response = await api.get(
        `/obtener/productos/presentacion/${presentacionId}`
      );
      console.log(
        `Productos para presentación ${presentacionId}:`,
        response.data
      );
      setProductosFiltrados(response.data || []);
      setProductoID_Producto("");
    } catch (error) {
      console.error("Error fetching productos por presentación:", error);
      setProductosFiltrados([]);
    }
  };

  const getUsuario = async () => {
    try {
      const response = await api.get("/obtener/usuarios");
      console.log("Usuarios cargados:", response.data);
      setUsuario(response.data);
    } catch (error) {
      console.error("Error fetching usuarios:", error);
    }
  };

  const getPresentaciones = async () => {
    try {
      const response = await api.get("/obtener/presentaciones");
      console.log("Presentaciones Cargadas:", response.data);
      setPresentaciones(response.data || []);
    } catch (error) {
      console.error("Error fetching presentaciones:", error);
      setPresentaciones([]);
    }
  };

  const getPendientesDevolucion = async () => {
    try {
      const response = await api.get("/movimientos/devoluciones/pendientes");
      setPendientesDevolucion(response.data);
    } catch (error) {
      console.error("Error al obtener pendientes de devolución:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron obtener los movimientos pendientes de devolución",
      });
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      getMovimiento();
    } else {
      const movimientosFiltrados = Movimiento.filter((mov) =>
        mov.producto.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setMovimiento(movimientosFiltrados);
    }
  };

  useEffect(() => {
    if (searchTerm.trim() !== "") {
      const movimientosFiltrados = Movimiento.filter((mov) =>
        mov.producto.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setMovimiento(movimientosFiltrados);
    } else {
      getMovimiento();
    }
  }, [searchTerm]);

  const openModal = (
    op,
    ID_STOCK,
    ProductoID_Producto,
    PresentacionID_Presentacion,
    UsuarioID_Usuario,
    UbicacionID_Ubicacion,
    fecha_hora_movimiento,
    tipo_movimiento,
    iva_aplicado,
    subtotal,
    total_venta,
    valor_unitario_movimiento,
    motivo,
    cantidad,
    cantidad_blister,
    unidad_por_blister,
    observaciones
  ) => {
    console.log("Datos recibidos en OpenModal:", {
      ID_STOCK,
      ProductoID_Producto,
      PresentacionID_Presentacion,
      UsuarioID_Usuario,
      UbicacionID_Ubicacion,
      fecha_hora_movimiento,
      tipo_movimiento,
      iva_aplicado,
      subtotal,
      total_venta,
      valor_unitario_movimiento,
      motivo,
      cantidad,
      cantidad_blister,
      unidad_por_blister,
      observaciones,
    });
    setID_STOCK(ID_STOCK || "");
    setProductoID_Producto(
      ProductoID_Producto ? String(ProductoID_Producto) : ""
    );
    setPresentacionID_Presentacion(
      PresentacionID_Presentacion ? String(PresentacionID_Presentacion) : ""
    );
    setUsuarioID_Usuario(UsuarioID_Usuario ? String(UsuarioID_Usuario) : "");
    setUbicacionID_Ubicacion(
      UbicacionID_Ubicacion ? String(UbicacionID_Ubicacion) : ""
    );
    setFecha_hora_movimiento(
      fecha_hora_movimiento
        ? fecha_hora_movimiento.replace("T", " ").split(".")[0]
        : ""
    );
    setTipo_movimiento(tipo_movimiento || "");
    setIva_aplicado(iva_aplicado || "");
    setSubtotal(subtotal || "");
    setTotal_venta(total_venta || "");
    setValor_unitario_movimiento(valor_unitario_movimiento || "");
    setMotivo(motivo || "");
    setCantidad(cantidad ? String(cantidad) : "");
    setCantidad_blister(cantidad_blister || "");
    setUnidad_por_blister(unidad_por_blister || "");
    setObservaciones(observaciones || "");
    setOperacion(op);
    setTitle(op === 1 ? "Registrar Movimiento" : "Editar Movimiento");
    setShowForm(true);
  };

  const closeModal = () => {
    setShowForm(false);
    setMovimientoSeleccionadoDevolucion(null);
    setShowDevolucionModal(false);
  };

  const handleSubmitDevolucion = async (e) => {
    e.preventDefault();

    if (!movimientoSeleccionadoDevolucion) {
      show_alerta("Debe seleccionar un movimiento para devolver", "error");
      return;
    }

    if (!cantidad || cantidad <= 0) {
      show_alerta("La cantidad a devolver debe ser mayor a cero", "error");
      return;
    }

    try {
      const response = await api.put(
        `/movimientos/devoluciones/${movimientoSeleccionadoDevolucion.ID_STOCK}`,
        {
          cantidad: Number(cantidad),
          motivo: motivo || "Devolucion_producto",
          observaciones: observaciones || "",
        }
      );

      if (response.status >= 200 && response.status < 300) {
        Swal.fire({
          icon: "success",
          title: "Éxito",
          text: `Devolución registrada correctamente. ID: ${response.data.id}`,
        });
        getMovimiento();
        getPendientesDevolucion();
        closeModal();
      }
    } catch (error) {
      console.error("Error completo:", error);

      let errorMessage = "Hubo un error al procesar la devolución";
      let errorDetails = "";

      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = `No se encontró el movimiento con ID ${movimientoSeleccionadoDevolucion.ID_STOCK}`;
          errorDetails =
            "Por favor, actualiza la lista de movimientos pendientes";
        } else if (error.response.data?.error === "CANTIDAD_EXCEDIDA") {
          errorMessage = error.response.data.message;
          errorDetails = `Cantidad pendiente: ${error.response.data.cantidad_pendiente}`;
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      }

      Swal.fire({
        icon: "error",
        title: "Error",
        html: `<div>${errorMessage}</div><div class="text-muted small mt-2">${errorDetails}</div>`,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (tipo_movimiento === "Salida" && !valor_unitario_movimiento) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "El valor unitario es obligatorio para salidas",
      });
      return;
    }

    if (PRESENTACIONES_UNIDADES.includes(Number(PresentacionID_Presentacion))) {
      if (tipo_movimiento === "Entrada") {
        if (!unidad_por_blister || unidad_por_blister <= 0) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Debe especificar el número de unidades por blister para entradas",
          });
          return;
        }
        if (!cantidad_blister || cantidad_blister <= 0) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Debe especificar la cantidad de blisters para entradas",
          });
          return;
        }
      } else if (tipo_movimiento === "Salida") {
        if (!cantidad_blister || cantidad_blister <= 0) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Debe especificar la cantidad de unidades a retirar",
          });
          return;
        }
      }
    } else if (
      PRESENTACIONES_FRASCOS.includes(Number(PresentacionID_Presentacion))
    ) {
      if (!cantidad || cantidad <= 0) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Debe especificar la cantidad de frascos",
        });
        return;
      }
    }

    const movimiento = {
      ID_STOCK,
      ProductoID_Producto: Number(ProductoID_Producto),
      PresentacionID_Presentacion: Number(PresentacionID_Presentacion),
      UsuarioID_Usuario: Number(UsuarioID_Usuario),
      UbicacionID_Ubicacion: Number(UbicacionID_Ubicacion),
      fecha_hora_movimiento,
      tipo_movimiento,
      motivo,
      cantidad: Number(cantidad),
      cantidad_blister: Number(cantidad_blister),
      unidad_por_blister: Number(unidad_por_blister),
      observaciones,
      valor_unitario_movimiento: valor_unitario_movimiento
        ? Number(valor_unitario_movimiento)
        : null,
    };

    if (PRESENTACIONES_UNIDADES.includes(Number(PresentacionID_Presentacion))) {
      movimiento.unidad_por_blister = Number(unidad_por_blister);
      movimiento.cantidad_blister = Number(cantidad_blister);
      movimiento.cantidad =
        Number(cantidad_blister) * Number(unidad_por_blister);
    } else {
      movimiento.cantidad = Number(cantidad);
    }

    try {
      let response;
      if (operacion === 1) {
        response = await api.post("/registrar/movimiento", movimiento);
      } else if (operacion === 2) {
        response = await api.put(
          `/actualizar/movimiento/${ID_STOCK}`,
          movimiento
        );
      }

      if (response && response.status >= 200 && response.status < 300) {
        getMovimiento();
        closeModal();
        Swal.fire({
          icon: "success",
          title: "Éxito",
          text:
            operacion === 1
              ? "Movimiento registrado correctamente"
              : "Movimiento actualizado correctamente",
        });
      } else {
        throw new Error("Error al procesar la solicitud del servidor");
      }
    } catch (error) {
      console.error("Error al procesar la solicitud:", error);

      if (error.response?.data?.error === "INACTIVE_PRODUCT") {
        Swal.fire({
          icon: "info",
          title: "Información",
          text:
            error.response?.data?.message ||
            "No se puede realizar salida de un producto inactivo",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            error.response?.data?.message ||
            "Hubo un error al procesar la solicitud",
        });
      }
    }
  };

  const validar = (e) => {
    if (tipo_movimiento === "Devolucion") {
      if (!movimientoSeleccionadoDevolucion) {
        show_alerta("Debe seleccionar un producto para devolver", "error");
        return;
      }
      if (!cantidad) {
        show_alerta("La cantidad a devolver es obligatoria", "error");
        return;
      }
      if (!motivo) {
        show_alerta("El motivo de la devolución es obligatorio", "error");
        return;
      }
      handleSubmitDevolucion(e);
    } else {
      if (!PresentacionID_Presentacion) {
        show_alerta("El campo presentación es obligatorio", "error");
        return;
      }
      if (!ProductoID_Producto) {
        show_alerta("El campo Producto es obligatorio", "error");
        return;
      }
      if (!UsuarioID_Usuario) {
        show_alerta("El campo Usuario es obligatorio", "error");
        return;
      }
      if (!UbicacionID_Ubicacion) {
        show_alerta("El campo Ubicación es obligatorio", "error");
        return;
      }
      if (tipo_movimiento === "Salida" && !valor_unitario_movimiento) {
        show_alerta("El valor unitario es obligatorio para salidas", "error");
        return;
      }
      if (!tipo_movimiento) {
        show_alerta("El campo tipo movimiento es obligatorio", "error");
        return;
      }
      if (!motivo) {
        show_alerta("El campo Motivo es obligatorio", "error");
        return;
      }
      if (!observaciones) {
        show_alerta("El campo observaciones es obligatorio", "error");
        return;
      }
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

  const deleteMovimiento = async (ID_STOCK) => {
    const MySwal = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    MySwal.fire({
      title: `¿Estás seguro de eliminar el Movimiento ${ID_STOCK}?`,
      icon: "question",
      text: "Esta acción no se puede deshacer",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await api.delete(`/eliminar/movimiento/${ID_STOCK}`);
          if (response.status === 200) {
            getMovimiento();
            Swal.fire({
              icon: "success",
              title: "Éxito",
              text: "Movimiento eliminado correctamente",
            });
          }
        } catch (error) {
          console.error("Error al eliminar movimiento:", error);
          if (error.response?.data?.message) {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: error.response.data.message,
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Ocurrió un error al eliminar el movimiento",
            });
          }
        }
      } else {
        Swal.fire({
          icon: "info",
          title: "Operación cancelada",
          text: "El movimiento no fue eliminado",
        });
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
                placeholder="Buscar por nombre de producto"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              ></input>
            </div>
            <div>
              <select
                id="filterSelect"
                className="formulario"
                aria-label="Selecciona un filtro de búsqueda"
                onChange={(e) => handleFilterChange(e.target.value)}
              >
                <option value="" disabled selected>
                  Filtro de Movimientos
                </option>
                <option value="filtroEntradas">Entradas</option>
                <option value="filtroSalidas">Salidas</option>
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
                        Movimiento
                      </button>
                    </div>
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
                  aria-label="Control de desplazamiento de tabla"
                />
              </div>
              <div className="tabla_medic row mt-3  ">
                <div className="col-10 col-lg-8">
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr className="table-primary">
                          <th>ID Stock</th>
                          <th>Producto</th>
                          <th>Presentación</th>
                          <th>Usuario</th>
                          <th>Ubicación</th>
                          <th>Fecha y Hora</th>
                          <th>Tipo de Movimiento</th>
                          <th>IVA Aplicado</th>
                          <th>Subtotal</th>
                          <th>Total Venta</th>
                          <th>Valor Unitario</th>
                          <th>Motivo</th>
                          <th>Cantidad</th>
                          <th>Cantidad de Blister</th>
                          <th>Cantidad de Unidades</th>
                          <th>Observaciones</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="table-group-divider">
                        {Movimiento.map((mov) => (
                          <tr key={mov.ID_STOCK}>
                            <td className="table-info">{mov.ID_STOCK}</td>
                            <td>{mov.producto}</td>
                            <td className="table-info">
                              {mov.presentacion_nombre}
                            </td>
                            <td>{mov.usuario}</td>
                            <td className="table-info">
                              {mov.ubicacion_nombre}
                            </td>
                            <td>{formatearFecha(mov.fecha_hora_movimiento)}</td>
                            <td className="table-info">
                              {mov.tipo_movimiento}
                            </td>
                            <td>
                              {mov.iva_aplicado
                                ? new Intl.NumberFormat("es-CO", {
                                    style: "currency",
                                    currency: "COP",
                                    minimumFractionDigits: 0,
                                  }).format(mov.iva_aplicado)
                                : "-"}
                            </td>

                            <td className="table-info">
                              {mov.subtotal
                                ? new Intl.NumberFormat("es-CO", {
                                    style: "currency",
                                    currency: "COP",
                                    minimumFractionDigits: 0,
                                  }).format(mov.subtotal)
                                : "-"}
                            </td>
                            <td>
                              {mov.total_venta
                                ? new Intl.NumberFormat("es-CO", {
                                    style: "currency",
                                    currency: "COP",
                                    minimumFractionDigits: 0,
                                  }).format(mov.total_venta)
                                : "-"}
                            </td>

                            <td>
                              {mov.valor_unitario_movimiento
                                ? new Intl.NumberFormat("es-CO", {
                                    style: "currency",
                                    currency: "COP",
                                    minimumFractionDigits: 0,
                                  }).format(mov.valor_unitario_movimiento)
                                : "-"}
                            </td>

                            <td>{mov.motivo}</td>
                            <td className="table-info">{mov.cantidad}</td>
                            <td>{mov.cantidad_blister}</td>
                            <td>{mov.unidad_por_blister}</td>
                            <td>{mov.observaciones}</td>
                            <td>
                              <button
                                onClick={() =>
                                  openModal(
                                    2,
                                    mov.ID_STOCK,
                                    mov.ProductoID_Producto,
                                    mov.PresentacionID_Presentacion,
                                    mov.UsuarioID_Usuario,
                                    mov.UbicacionID_Ubicacion,
                                    mov.fecha_hora_movimiento,
                                    mov.tipo_movimiento,
                                    mov.iva_aplicado,
                                    mov.subtotal,
                                    mov.total_venta,
                                    mov.valor_unitario_movimiento,
                                    mov.motivo,
                                    mov.cantidad,
                                    mov.cantidad_blister,
                                    mov.unidad_por_blister,
                                    mov.observaciones
                                  )
                                }
                                className="btn btn-warning"
                              >
                                <i className="fa-solid fa-edit"></i>
                              </button>
                              &nbsp;
                              <button
                                onClick={() => deleteMovimiento(mov.ID_STOCK)}
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
                  id="ModalMovimiento"
                  className="modal-fade"
                  aria-hidden="true"
                >
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                      </div>

                      <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                          <input type="hidden" id="ID_STOCK" value={ID_STOCK} />

                          {tipo_movimiento === "Devolucion" ? (
                            <>
                              <div className="mb-4">
                                <h5>Seleccionar Producto para Devolución</h5>
                                <p className="text-muted">
                                  Seleccione un producto de la lista de salidas
                                  pendientes de devolución
                                </p>
                              </div>

                              {pendientesDevolucion.length === 0 ? (
                                <div className="alert alert-info">
                                  No hay productos pendientes de devolución
                                </div>
                              ) : (
                                <>
                                  <div className="mb-3">
                                    <label
                                      htmlFor="productosDevolucion"
                                      className="form-label"
                                    >
                                      Productos Pendientes de Devolución
                                    </label>
                                    <select
                                      id="productosDevolucion"
                                      className="form-select"
                                      value={
                                        movimientoSeleccionadoDevolucion
                                          ? movimientoSeleccionadoDevolucion.ID_STOCK
                                          : ""
                                      }
                                      onChange={(e) => {
                                        const movimientoId = e.target.value;
                                        const movimiento =
                                          pendientesDevolucion.find(
                                            (m) =>
                                              m.ID_STOCK.toString() ===
                                              movimientoId
                                          );
                                        setMovimientoSeleccionadoDevolucion(
                                          movimiento || null
                                        );
                                      }}
                                    >
                                      <option value="">
                                        Seleccione un producto para devolver
                                      </option>
                                      {pendientesDevolucion.map((mov) => (
                                        <option
                                          key={mov.ID_STOCK}
                                          value={mov.ID_STOCK}
                                        >
                                          {mov.nombre_producto} (
                                          {mov.nombre_presentacion}) - Cantidad
                                          original: {mov.cantidad_original} -
                                          Pendiente: {mov.cantidad_pendiente} -
                                          Fecha:{" "}
                                          {new Date(
                                            mov.fecha_hora_movimiento
                                          ).toLocaleDateString()}{" "}
                                          - Usuario: {mov.nombre_usuario}{" "}
                                          {mov.apellido_usuario}
                                        </option>
                                      ))}
                                    </select>
                                  </div>

                                  {movimientoSeleccionadoDevolucion && (
                                    <>
                                      <div className="alert alert-info">
                                        <div className="row">
                                          <div className="col-md-6">
                                            <p>
                                              <strong>Producto:</strong>{" "}
                                              {
                                                movimientoSeleccionadoDevolucion.nombre_producto
                                              }
                                            </p>
                                            <p>
                                              <strong>Presentación:</strong>{" "}
                                              {
                                                movimientoSeleccionadoDevolucion.nombre_presentacion
                                              }
                                            </p>
                                            <p>
                                              <strong>Valor unitario:</strong> $
                                              {movimientoSeleccionadoDevolucion.valor_unitario_movimiento?.toLocaleString()}
                                            </p>
                                          </div>
                                          <div className="col-md-6">
                                            <p>
                                              <strong>
                                                Cantidad original:
                                              </strong>{" "}
                                              {
                                                movimientoSeleccionadoDevolucion.cantidad_original
                                              }
                                            </p>
                                            <p>
                                              <strong>Ya devuelto:</strong>{" "}
                                              {
                                                movimientoSeleccionadoDevolucion.cantidad_devuelta
                                              }
                                            </p>
                                            <p>
                                              <strong>
                                                Pendiente por devolver:
                                              </strong>{" "}
                                              {
                                                movimientoSeleccionadoDevolucion.cantidad_pendiente
                                              }
                                            </p>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="mb-3">
                                        <label
                                          htmlFor="cantidad_Devolver"
                                          className="form-label"
                                        >
                                          Cantidad a Devolver *
                                        </label>
                                        <input
                                          id="cantidad_Devolver"
                                          type="number"
                                          className="form-control"
                                          value={cantidad}
                                          onChange={(e) =>
                                            setCantidad(e.target.value)
                                          }
                                          min="1"
                                          max={
                                            movimientoSeleccionadoDevolucion.cantidad_pendiente
                                          }
                                          required
                                        />
                                        <small className="text-muted">
                                          Máximo:{" "}
                                          {
                                            movimientoSeleccionadoDevolucion.cantidad_pendiente
                                          }
                                        </small>
                                      </div>

                                      <div className="mb-3">
                                        <label
                                          htmlFor="motivo-devolucion"
                                          className="form-label"
                                        >
                                          Motivo de la Devolución *
                                        </label>
                                        <select
                                          id="motivo-devolucion"
                                          className="form-select"
                                          value={motivo}
                                          onChange={(e) =>
                                            setMotivo(e.target.value)
                                          }
                                          required
                                        >
                                          <option value="">
                                            Seleccione el motivo
                                          </option>
                                          <option value="Producto defectuoso">
                                            Producto defectuoso
                                          </option>
                                          <option value="Cliente no lo necesitó">
                                            Cliente no lo necesitó
                                          </option>
                                          <option value="Error en el despacho">
                                            Error en el despacho
                                          </option>
                                          <option value="Devolucion_producto">
                                            Devolución estándar
                                          </option>
                                          <option value="Otro">Otro</option>
                                        </select>
                                      </div>

                                      <div className="mb-3">
                                        <label
                                          htmlFor="Observaciones"
                                          className="form-label"
                                        >
                                          Observaciones
                                        </label>
                                        <textarea
                                          id="Observaciones"
                                          className="form-control"
                                          value={observaciones}
                                          onChange={(e) =>
                                            setObservaciones(e.target.value)
                                          }
                                          rows="3"
                                        ></textarea>
                                      </div>
                                    </>
                                  )}
                                </>
                              )}
                            </>
                          ) : (
                            <>
                              <small className="form-text text-muted mb-2">
                                Ingrese Presentación
                              </small>
                              <div className="input-group mb-3">
                                <span className="input-group-text">
                                  <i className="fas fa-pills"></i>
                                </span>
                                <select
                                  id="PresentacionID_Presentacion"
                                  className="form-control"
                                  placeholder="Presentacion"
                                  value={PresentacionID_Presentacion}
                                  onChange={async (e) => {
                                    const presentacionId = e.target.value;
                                    setPresentacionID_Presentacion(
                                      presentacionId
                                    );

                                    if (presentacionId) {
                                      await getProductosByPresentacion(
                                        presentacionId
                                      );
                                    } else {
                                      setProductosFiltrados(productos);
                                    }

                                    setProductoID_Producto("");
                                  }}
                                >
                                  <option value="">
                                    Seleccione una Presentacion
                                  </option>
                                  {presentaciones.map((presentacion) => (
                                    <option
                                      key={presentacion.ID_Presentacion}
                                      value={presentacion.ID_Presentacion}
                                    >
                                      {presentacion.nombre_presentacion}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <small className="form-text text-muted mb-2">
                                Ingrese Producto de Movimiento
                              </small>
                              <div className="input-group mb-3">
                                <span className="input-group-text">
                                  <i className="fas fa-notes-medical"></i>
                                </span>
                                <select
                                  id="ProductoID_Producto"
                                  className="form-control"
                                  placeholder="ID PRODUCTO"
                                  value={ProductoID_Producto}
                                  onChange={(e) =>
                                    setProductoID_Producto(e.target.value)
                                  }
                                  disabled={!PresentacionID_Presentacion}
                                >
                                  <option value="">
                                    Seleccione un producto
                                  </option>
                                  {productosFiltrados.map((producto) => (
                                    <option
                                      key={producto.ID_PRODUCTO}
                                      value={producto.ID_PRODUCTO}
                                    >
                                      {producto.nombre} (
                                      {producto.nombre_presentacion})
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <small className="form-text text-muted mb-2">
                                Ingrese Usuario
                              </small>
                              <div className="input-group mb-3">
                                <span className="input-group-text">
                                  <i className="fas fa-user"></i>
                                </span>
                                <select
                                  id="UsuarioID_Usuario"
                                  className="form-control"
                                  placeholder="Usuario de movimiento"
                                  value={UsuarioID_Usuario}
                                  onChange={(e) =>
                                    setUsuarioID_Usuario(e.target.value)
                                  }
                                >
                                  <option value="">
                                    Seleccione un usuario
                                  </option>
                                  {usuario.map((user) => (
                                    <option
                                      key={user.ID_Usuario}
                                      value={user.ID_Usuario}
                                    >
                                      {user.nombre_usuario}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <small className="form-text text-muted mb-2">
                                Ingrese la Ubicacion del Producto
                              </small>
                              <div className="input-group mb-3">
                                <span className="input-group-text">
                                  <i className="fas fa-map-pin"></i>
                                </span>
                                <select
                                  id="UbicacionID_Ubicacion"
                                  className="form-control"
                                  placeholder="Ubicacion del producto"
                                  value={UbicacionID_Ubicacion}
                                  onChange={(e) =>
                                    setUbicacionID_Ubicacion(e.target.value)
                                  }
                                >
                                  <option value="">
                                    Seleccione la Ubicacion
                                  </option>
                                  <option value="1">Almacén principal</option>
                                  <option value="2">Almacén secundario</option>
                                  <option value="3">
                                    Estantería para medicamentos comunes
                                  </option>
                                  <option value="4">
                                    Estantería para medicamentos controlados
                                  </option>
                                  <option value="5">
                                    Refrigerador para medicamentos termolábiles
                                  </option>
                                  <option value="6">
                                    Refrigerador para vacunas
                                  </option>
                                </select>
                              </div>

                              <small className="form-text text-muted mb-2">
                                Ingrese Tipo de movimiento
                              </small>
                              <div className="input-group mb-3">
                                <span className="input-group-text">
                                  <i className="fas fa-exchange-alt"></i>
                                </span>
                                <select
                                  id="tipo_movimiento"
                                  className="form-control"
                                  placeholder="Tipo de Movimiento a realizar"
                                  value={tipo_movimiento}
                                  onChange={(e) =>
                                    setTipo_movimiento(e.target.value)
                                  }
                                >
                                  <option value="">
                                    Seleccione el tipo de movimiento
                                  </option>
                                  <option value="Entrada">Entrada</option>
                                  <option value="Salida">Salida</option>
                                  <option value="Devolucion">Devolución</option>
                                </select>
                              </div>

                              {PresentacionID_Presentacion && (
                                <>
                                  {PRESENTACIONES_UNIDADES.includes(
                                    Number(PresentacionID_Presentacion)
                                  ) ? (
                                    <>
                                      {tipo_movimiento === "Entrada" && (
                                        <>
                                          <small className="form-text text-muted mb-2">
                                            Unidades por Blister
                                          </small>
                                          <div className="input-group mb-3">
                                            <span className="input-group-text">
                                              <i className="fas fa-boxes"></i>
                                            </span>
                                            <input
                                              id="unidad_por_blister"
                                              type="number"
                                              className="form-control"
                                              placeholder="Unidades por blister"
                                              value={unidad_por_blister}
                                              onChange={(e) =>
                                                setUnidad_por_blister(
                                                  e.target.value
                                                )
                                              }
                                              min="1"
                                            />
                                          </div>

                                          <small className="form-text text-muted mb-2">
                                            Cantidad de Blisters
                                          </small>
                                          <div className="input-group mb-3">
                                            <span className="input-group-text">
                                              <i className="fas fa-boxes"></i>
                                            </span>
                                            <input
                                              id="cantidad_blister"
                                              type="number"
                                              className="form-control"
                                              placeholder="Cantidad de blisters"
                                              value={cantidad_blister}
                                              onChange={(e) =>
                                                setCantidad_blister(
                                                  e.target.value
                                                )
                                              }
                                              min="1"
                                            />
                                          </div>
                                        </>
                                      )}

                                      {tipo_movimiento === "Salida" && (
                                        <>
                                          <small className="form-text text-muted mb-2">
                                            Cantidad de Unidades a Retirar
                                          </small>
                                          <div className="input-group mb-3">
                                            <span className="input-group-text">
                                              <i className="fas fa-boxes"></i>
                                            </span>
                                            <input
                                              id="cantidad_blister"
                                              type="number"
                                              className="form-control"
                                              placeholder="Cantidad de unidades"
                                              value={cantidad_blister}
                                              onChange={(e) =>
                                                setCantidad_blister(
                                                  e.target.value
                                                )
                                              }
                                              min="1"
                                            />
                                          </div>
                                        </>
                                      )}
                                    </>
                                  ) : (
                                    <>
                                      <small className="form-text text-muted mb-2">
                                        {tipo_movimiento === "Entrada"
                                          ? "Cantidad de Frascos/Tubos"
                                          : "Cantidad a Retirar"}
                                      </small>
                                      <div className="input-group mb-3">
                                        <span className="input-group-text">
                                          <i className="fas fa-boxes"></i>
                                        </span>
                                        <input
                                          id="cantidad"
                                          type="number"
                                          className="form-control"
                                          placeholder={
                                            tipo_movimiento === "Entrada"
                                              ? "Cantidad de frascos/tubos"
                                              : "Cantidad a retirar"
                                          }
                                          value={cantidad}
                                          onChange={(e) =>
                                            setCantidad(e.target.value)
                                          }
                                          min="1"
                                        />
                                      </div>
                                    </>
                                  )}
                                </>
                              )}

                              <small className="form-text text-muted mb-2">
                                Ingrese el Motivo
                              </small>
                              <div className="input-group mb-3">
                                <span className="input-group-text">
                                  <i className="fas fa-list-ol"></i>
                                </span>
                                <select
                                  id="motivo"
                                  className="form-control"
                                  placeholder="Tipo de Movimiento a realizar"
                                  value={motivo}
                                  onChange={(e) => setMotivo(e.target.value)}
                                >
                                  <option value="">
                                    Seleccione el Motivo del movimiento
                                  </option>
                                  <option value="Venta">Venta</option>
                                  <option value="Entrada">
                                    Reponer Producto
                                  </option>
                                  <option value="Devolucion_producto">
                                    Devolucion del producto
                                  </option>
                                </select>
                              </div>

                              {tipo_movimiento !== "Entrada" && (
                                <>
                                  <small className="form-text text-muted mb-2">
                                    Ingrese Valor unitario de Salida
                                  </small>
                                  <div className="input-group mb-3">
                                    <span className="input-group-text">
                                      <i className="fas fa-dollar-sign"></i>
                                    </span>
                                    <input
                                      type="number"
                                      id="valor_unitario_movimiento"
                                      className="form-control"
                                      placeholder="Valor unitario movimiento"
                                      value={valor_unitario_movimiento}
                                      onChange={(e) => {
                                        const numericValue =
                                          e.target.value.replace(/\D/g, "");
                                        setValor_unitario_movimiento(
                                          numericValue
                                        );
                                      }}
                                      min="0"
                                      step="0.01"
                                    />
                                  </div>
                                </>
                              )}

                              <small className="form-text text-muted mb-2">
                                Ingrese Observación
                              </small>
                              <div className="input-group mb-3">
                                <span className="input-group-text">
                                  <i className="fas fa-align-left"></i>
                                </span>
                                <input
                                  type="text"
                                  id="observaciones"
                                  className="form-control"
                                  placeholder="Observaciones"
                                  value={observaciones}
                                  onChange={(e) =>
                                    setObservaciones(e.target.value)
                                  }
                                />
                              </div>
                            </>
                          )}
                        </form>
                      </div>
                      <div className="d-grid col-6 mx-auto">
                        <button
                          type="button"
                          onClick={(e) => validar(e)}
                          className="btn btn-success"
                        >
                          <i className="fa-solid fa-floppy-disk"></i>
                          {tipo_movimiento === "Devolucion"
                            ? "Procesar Devolución"
                            : "Guardar"}
                        </button>
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
export default InvMovimiento;
