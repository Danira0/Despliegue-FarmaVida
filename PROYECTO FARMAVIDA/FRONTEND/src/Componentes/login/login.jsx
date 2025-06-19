import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/auth";
import "bootstrap/dist/css/bootstrap.min.css";
import "../login/login.css";
import { Alert, Spinner } from "react-bootstrap";
import api from "../API/api.js";

function Login() {
  const [formData, setFormData] = useState({
    nombre_usuario: "",
    contrasena_usuario: "",
    requestedRole: "",
  });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [redirectMessage, setRedirectMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showRedirect, setShowRedirect] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    if (showRedirect) {
      const timer = setTimeout(() => {
        if (formData.requestedRole === "1") {
          navigate("/homeadmi");
        } else if (formData.requestedRole === "2") {
          navigate("/homeemple");
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showRedirect, formData.requestedRole, navigate]);

  const handleChange = ({ target: { id, value } }) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleRoleSelect = (roleId) => {
    setFormData((prev) => ({ ...prev, requestedRole: roleId }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: "", type: "" });
    setShowRedirect(false);

    if (
      !formData.nombre_usuario ||
      !formData.contrasena_usuario ||
      !formData.requestedRole
    ) {
      setMessage({
        text: "Por favor, complete todos los campos y seleccione un rol.",
        type: "warning",
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post("/auth/login", {
          nombre_usuario: formData.nombre_usuario,
          contrasena_usuario: formData.contrasena_usuario,
          requestedRole: formData.requestedRole,
        }
      );

      if (response.data.token) {
        const user = {
          id: response.data.user.id,
          nombre: response.data.user.nombre,
          nombre_usuario: formData.nombre_usuario,
          rol: response.data.user.rol,
          rolId: response.data.user.rolId,
        };

        login(user, response.data.token);
        console.log(
          "Token almacenado en localStorage:",
          localStorage.getItem("token")
        );
        setRedirectMessage(
          `Redirigiendo al panel de ${
            user.rolId === 1 ? "Administrador" : "Empleado"
          }...`
        );
        setShowRedirect(true);
      } else {
        setMessage({
          text:
            response.data.message || "Usuario, contraseña o rol incorrectos.",
          type: "danger",
        });
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Error al iniciar sesión. Por favor, intente nuevamente.";
      setMessage({ text: errorMessage, type: "danger" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container">
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div className="row border rounded-5 p-3 bg-white shadow box-area">
          <div className="col-md-6 rounded-4 d-flex justify-content-around align-items-center flex-column left-box">
            <div className="featured-image mb-3">
              <img
                src="./Assets/logo.png"
                className="img-fluid1 width-style1"
                alt="Logo de la farmacia"
              />
            </div>
            <div className="featured-image mb-3">
              <img
                src="/Assets/img1.png"
                className="img-fluid2 width-style1"
                alt="Farmacéutica sonriendo"
              />
            </div>
          </div>
          <div className="col-md-6 right-box">
            <div className="row align-items-center">
              <div className="header-text mb-4">
                <h2>Iniciar Sesión</h2>
              </div>
              <div className="btns">
                <button
                  className={`btn btn-lg fs-6 ${
                    formData.requestedRole === "1"
                      ? "btn-success"
                      : "btn-primary"
                  }`}
                  onClick={() => handleRoleSelect("1")}
                >
                  Soy Administrador
                </button>
                <button
                  className={`btn btn-lg fs-6 ms-2 ${
                    formData.requestedRole === "2"
                      ? "btn-success"
                      : "btn-primary"
                  }`}
                  onClick={() => handleRoleSelect("2")}
                >
                  Soy Empleado
                </button>
              </div>

              {message.text && (
                <Alert
                  variant={message.type}
                  className="mt-3"
                  dismissible
                  onClose={() => setMessage({ text: "", type: "" })}
                >
                  {message.text}
                </Alert>
              )}

              {showRedirect && (
                <Alert variant="info" className="mt-3">
                  <div className="d-flex align-items-center">
                    <Spinner animation="border" size="sm" className="me-2" />
                    {redirectMessage}
                  </div>
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                  <label htmlFor="nombre_usuario">Usuario</label>
                  <input
                    type="text"
                    className="form-control form-control-lg bg-light fs-6"
                    id="nombre_usuario"
                    placeholder="Usuario"
                    autoComplete="on"
                    value={formData.nombre_usuario}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="contrasena_usuario">Contraseña</label>
                  <input
                    type="password"
                    className="form-control form-control-lg bg-light fs-6"
                    id="contrasena_usuario"
                    placeholder="Contraseña"
                    autoComplete="on"
                    value={formData.contrasena_usuario}
                    onChange={handleChange}
                  />
                </div>
                <div className="input-group mb-5 d-flex justify-content-between">
                  <div className="forgot">
                    <small className="text-secondary">
                      <Link to="/OlvidoContrasena">¿Olvidó la contraseña?</Link>
                    </small>
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        className="me-2"
                        aria-label="Cargando"
                      />
                      Iniciando Sesión...
                    </>
                  ) : (
                    "Iniciar Sesión"
                  )}
                </button>
              </form>
              <div className="row">
                <small>
                  ¿No tiene una cuenta? <Link to="/register">Registrarse</Link>
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Login;
