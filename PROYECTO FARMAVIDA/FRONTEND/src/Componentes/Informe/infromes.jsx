import React, { useState } from "react";
import {
  Row,
  Col,
  Form,
  Alert,
  Tabs,
  Tab,
} from "react-bootstrap";
import { MyDocumentProductos } from "../../../Report/MyDocument.Productos.jsx";
import { MyDocumentMovimientos } from "../../../Report/MyDocument.Mov.jsx";
import { MyDocumentProveedor } from "../../../Report/MyDocumentprov.jsx";
import { MyDocumentUsuarios } from "../../../Report/MyDocument.user.jsx";
import { useAuth } from "../Auth/auth.jsx";
import { useNavigate } from "react-router-dom";
import Menu from "../home/admimenulateral.jsx";
import EmpleadoMenu from "../home/emplemenulateral.jsx";

const InformesUnificados = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Estados para productos
  const [productReportType, setProductReportType] = useState("todos");
  const [productFechaInicio, setProductFechaInicio] = useState("");
  const [productFechaFin, setProductFechaFin] = useState("");

  // Estados para movimientos
  const [movementReportType, setMovementReportType] = useState("todos");
  const [movementFechaInicio, setMovementFechaInicio] = useState("");
  const [movementFechaFin, setMovementFechaFin] = useState("");
  const [productoId, setProductoId] = useState("");
  const [usuarioId, setUsuarioId] = useState("");
  const [tipoMovimiento, setTipoMovimiento] = useState("Entrada");

  // Estados para proveedores/laboratorios
  const [providerReportType, setProviderReportType] = useState("laboratorios");
  const [laboratorioId, setLaboratorioId] = useState("");

  // Estados para usuarios
  const [userReportType, setUserReportType] = useState("todos");
  const [userId, setUserId] = useState("");
  const [rolId, setRolId] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/");
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
          <section className="gestionUsuario col-lg p-8 mt-1 mb-5">
            <div className="mainContainer_inform">
              <div className="profile-section-info mb-4">
                <h2 className="informe-title">Informes</h2>

                <Tabs
                  defaultActiveKey="productos"
                  id="informes-tabs"
                  className="mb-2"
                >
                  {/* Pestaña de Productos */}
                  <Tab eventKey="productos" title="Informes de Productos">
                    <Form>
                      <Row className="mb-1 justify-content-center">
                        <Col md={8}>
                          <Form.Group controlId="formProductReportType">
                            <Form.Label>Tipo de Informe</Form.Label>
                            <Form.Control
                              as="select"
                              value={productReportType}
                              onChange={(e) =>
                                setProductReportType(e.target.value)
                              }
                              className="mb-3"
                            >
                              <option value="todos">Todos los Productos</option>
                              <option value="vencer">
                                Productos por Vencer
                              </option>
                              <option value="stock">Productos en Stock</option>
                              <option value="fecha-ingreso">
                                Productos por Fecha de Ingreso
                              </option>
                            </Form.Control>
                          </Form.Group>
                        </Col>
                      </Row>

                      {productReportType === "fecha-ingreso" && (
                        <Row className="mb-3 justify-content-center">
                          <Col md={4}>
                            <Form.Group controlId="formProductFechaInicio">
                              <Form.Label>Fecha Inicio</Form.Label>
                              <Form.Control
                                type="date"
                                value={productFechaInicio}
                                onChange={(e) =>
                                  setProductFechaInicio(e.target.value)
                                }
                              />
                            </Form.Group>
                          </Col>
                          <Col md={4}>
                            <Form.Group controlId="formProductFechaFin">
                              <Form.Label>Fecha Fin</Form.Label>
                              <Form.Control
                                type="date"
                                value={productFechaFin}
                                onChange={(e) =>
                                  setProductFechaFin(e.target.value)
                                }
                              />
                            </Form.Group>
                          </Col>
                          <Col md={8} className="mt-3">
                            {productFechaInicio &&
                              productFechaFin &&
                              new Date(productFechaInicio) >
                                new Date(productFechaFin) && (
                                <Alert variant="warning" className="mb-0 w-100">
                                  La fecha de inicio es mayor que la fecha final
                                </Alert>
                              )}
                          </Col>
                        </Row>
                      )}

                      <Row className="mt-3">
                        <Col className="d-flex justify-content-center">
                          <MyDocumentProductos
                            reportType={productReportType}
                            fechaInicio={productFechaInicio}
                            fechaFin={productFechaFin}
                          />
                        </Col>
                      </Row>
                    </Form>
                  </Tab>

                  {/* Pestaña de Movimientos */}
                  <Tab eventKey="movimientos" title="Informes de Movimientos">
                    <Form>
                      <Row className="mb-1 justify-content-center">
                        <Col md={8}>
                          <Form.Group controlId="formMovementReportType">
                            <Form.Label>Tipo de Informe</Form.Label>
                            <Form.Control
                              as="select"
                              value={movementReportType}
                              onChange={(e) =>
                                setMovementReportType(e.target.value)
                              }
                              className="mb-3"
                            >
                              <option value="todos">
                                Todos los Movimientos
                              </option>
                              <option value="fechas">
                                Movimientos por Fecha
                              </option>
                              <option value="porproducto">
                                Movimientos por Producto
                              </option>
                              <option value="usuario">
                                Movimientos por Usuario
                              </option>
                              <option value="tipo">Movimientos por Tipo</option>
                            </Form.Control>
                          </Form.Group>
                        </Col>
                      </Row>

                      {movementReportType === "fechas" && (
                        <Row className="mb-3 justify-content-center">
                          <Col md={4}>
                            <Form.Group controlId="formMovementFechaInicio">
                              <Form.Label>Fecha Inicio</Form.Label>
                              <Form.Control
                                type="date"
                                value={movementFechaInicio}
                                onChange={(e) =>
                                  setMovementFechaInicio(e.target.value)
                                }
                              />
                            </Form.Group>
                          </Col>
                          <Col md={4}>
                            <Form.Group controlId="formMovementFechaFin">
                              <Form.Label>Fecha Fin</Form.Label>
                              <Form.Control
                                type="date"
                                value={movementFechaFin}
                                onChange={(e) =>
                                  setMovementFechaFin(e.target.value)
                                }
                              />
                            </Form.Group>
                          </Col>
                          <Col md={8} className="mt-3">
                            {movementFechaInicio &&
                              movementFechaFin &&
                              new Date(movementFechaInicio) >
                                new Date(movementFechaFin) && (
                                <Alert variant="warning" className="mb-0 w-100">
                                  La fecha de inicio es mayor que la fecha final
                                </Alert>
                              )}
                          </Col>
                        </Row>
                      )}

                      {movementReportType === "porproducto" && (
                        <Row className="mb-3 justify-content-center">
                          <Col md={8}>
                            <Form.Group controlId="formProductoId">
                              <Form.Label>ID del Producto</Form.Label>
                              <Form.Control
                                type="text"
                                value={productoId}
                                onChange={(e) => setProductoId(e.target.value)}
                                placeholder="Ingrese el ID del producto"
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      )}

                      {movementReportType === "usuario" && (
                        <Row className="mb-3 justify-content-center">
                          <Col md={8}>
                            <Form.Group controlId="formUsuarioId">
                              <Form.Label>ID del Usuario</Form.Label>
                              <Form.Control
                                type="text"
                                value={usuarioId}
                                onChange={(e) => setUsuarioId(e.target.value)}
                                placeholder="Ingrese el ID del usuario"
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      )}

                      {movementReportType === "tipo" && (
                        <Row className="mb-3 justify-content-center">
                          <Col md={8}>
                            <Form.Group controlId="formTipoMovimiento">
                              <Form.Label>Tipo de Movimiento</Form.Label>
                              <Form.Control
                                as="select"
                                value={tipoMovimiento}
                                onChange={(e) =>
                                  setTipoMovimiento(e.target.value)
                                }
                              >
                                <option value="Entrada">Entrada</option>
                                <option value="Salida">Salida</option>
                                <option value="Ajuste">Ajuste</option>
                                <option value="Transferencia">
                                  Transferencia
                                </option>
                              </Form.Control>
                            </Form.Group>
                          </Col>
                        </Row>
                      )}

                      <Row className="mt-3">
                        <Col className="d-flex justify-content-center">
                          <MyDocumentMovimientos
                            reportType={movementReportType}
                            fechaInicio={movementFechaInicio}
                            fechaFin={movementFechaFin}
                            productoId={productoId}
                            usuarioId={usuarioId}
                            tipoMovimiento={tipoMovimiento}
                          />
                        </Col>
                      </Row>
                    </Form>
                  </Tab>

                  {/* Pestaña de Proveedores/Laboratorios */}
                  <Tab eventKey="proveedores" title="Informes de Proveedores">
                    <Form>
                      <Row className="mb-1 justify-content-center">
                        <Col md={8}>
                          <Form.Group controlId="formProviderReportType">
                            <Form.Label>Tipo de Informe</Form.Label>
                            <Form.Control
                              as="select"
                              value={providerReportType}
                              onChange={(e) =>
                                setProviderReportType(e.target.value)
                              }
                              className="mb-3"
                            >
                              <option value="laboratorios">
                                Todos los Laboratorios
                              </option>
                              <option value="laboratorio">
                                Informe de Laboratorio
                              </option>
                              {/* Eliminamos la opción de Productos por Laboratorio */}
                            </Form.Control>
                          </Form.Group>
                        </Col>
                      </Row>

                      {providerReportType === "laboratorio" && (
                        <Row className="mb-3 justify-content-center">
                          <Col md={8}>
                            <Form.Group controlId="formLaboratorioId">
                              <Form.Label>ID del Laboratorio</Form.Label>
                              <Form.Control
                                type="text"
                                value={laboratorioId}
                                onChange={(e) =>
                                  setLaboratorioId(e.target.value)
                                }
                                placeholder="Ingrese el ID del laboratorio"
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      )}

                      <Row className="mt-3">
                        <Col className="d-flex justify-content-center">
                          <MyDocumentProveedor
                            reportType={providerReportType}
                            laboratorioId={laboratorioId}
                          />
                        </Col>
                      </Row>
                    </Form>
                  </Tab>

                  {/* Nueva Pestaña de Usuarios */}
                  <Tab eventKey="usuarios" title="Informes de Usuarios">
                    <Form>
                      <Row className="mb-1 justify-content-center">
                        <Col md={8}>
                          <Form.Group controlId="formUserReportType">
                            <Form.Label>Tipo de Informe</Form.Label>
                            <Form.Control
                              as="select"
                              value={userReportType}
                              onChange={(e) =>
                                setUserReportType(e.target.value)
                              }
                              className="mb-3"
                            >
                              <option value="todos">Todos los Usuarios</option>
                              <option value="usuario">
                                Usuario Específico
                              </option>
                              <option value="rol">Usuarios por Rol</option>
                            </Form.Control>
                          </Form.Group>
                        </Col>
                      </Row>

                      {userReportType === "usuario" && (
                        <Row className="mb-3 justify-content-center">
                          <Col md={8}>
                            <Form.Group controlId="formUserId">
                              <Form.Label>ID del Usuario</Form.Label>
                              <Form.Control
                                type="text"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                placeholder="Ingrese el ID del usuario"
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      )}

                      {userReportType === "rol" && (
                        <Row className="mb-3 justify-content-center">
                          <Col md={8}>
                            <Form.Group controlId="formRolId">
                              <Form.Label>ID del Rol</Form.Label>
                              <Form.Control
                                type="text"
                                value={rolId}
                                onChange={(e) => setRolId(e.target.value)}
                                placeholder="Ingrese el ID del rol"
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      )}

                      <Row className="mt-3">
                        <Col className="d-flex justify-content-center">
                          <MyDocumentUsuarios
                            reportType={userReportType}
                            usuarioId={userId}
                            rolId={rolId}
                          />
                        </Col>
                      </Row>
                    </Form>
                  </Tab>
                </Tabs>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default InformesUnificados;
