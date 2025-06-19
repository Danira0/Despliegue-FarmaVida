import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../API/api.js";

function Register() {
  const [rol, setRol] = useState("");
  const [error, setError] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [correoGuardado, setCorreoGuardado] = useState("");

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [nombre_usuario, setNombre_usuario] = useState("");
  const [contrasena_usuario, setContrasena_usuario] = useState("");
  const [confirmaContrasena, setConfirmaContrasena] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (success) {
      navigate("/");
    }
  }, [success, navigate]);

  useEffect(() => {
    if (correoGuardado && !isApproved) {
      const interval = setInterval(() => {
        checkApproval();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [correoGuardado, isApproved]);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (contrasena_usuario !== confirmaContrasena) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    const datosRegistro = {
      nombre,
      apellido,
      correo,
      nombre_usuario,
      contrasena_usuario,
      ROLID_ROL: rol === "Administrador" ? 1 : 2,
    };

    try {
       const response = await api.post("/auth/register", datosRegistro);

      if (
        response.data.message ===
        "Notificación enviada al administrador para aprobación."
      ) {
        setAlertMessage(
          "Tu registro está pendiente de aprobación. ¡Pendiente a tu correo!"
        );
        setShowAlert(true);
        setCorreoGuardado(correo);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Error al registrar el usuario."
      );
    }
  };

  const checkApproval = async () => {
    try {
       const response = await api.get(`/auth/check-approval/checkApproval?correo=${correoGuardado}`);
      if (response.data.aprobado === 1) {
        setIsApproved(true);
        setAlertMessage(
          "Tu registro ha sido aprobado. ¡Bienvenido!, sera redirigido en 3 segundos."
        );
        setShowAlert(true);
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    } catch (error) {
      console.error("Error al verificar aprobación:", error);
    }
  };

  return (
    <main className="container">
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div className="row border rounded-5 p-3 bg-white shadow box-area">
          <div className="col-md-6 rounded-4 d-flex justify-content-around align-items-center flex-column left-box">
            <img
              src="/Assets/logo.png"
              alt="Logo"
              className="img-fluid width-style"
            />
            <img
              src="/Assets/img1.png"
              alt="Farmacéutica"
              className="img-fluid width-style"
            />
          </div>
          <div className="col-md-6 right-box">
            <form onSubmit={handleRegister}>
              <h2 className="text-center">Registro</h2>

              <div className="d-flex justify-content-between">
                <button
                  type="button"
                  className={`form-control btn btn-lg fs-6 ${
                    rol === "Administrador" ? "btn-success" : "btn-primary"
                  }`}
                  onClick={() => setRol("Administrador")}
                >
                  Soy Administrador
                </button>
                <button
                  type="button"
                  className={`form-control btn btn-lg fs-6  ${
                    rol === "Empleado" ? "btn-success" : "btn-primary"
                  }`}
                  onClick={() => setRol("Empleado")}
                >
                  Soy Empleado
                </button>
              </div>

              <div className="mb-3">
                <label htmlFor="nombre" className="form-label">
                  Nombre
                </label>
                <input
                  id="nombre"
                  type="text"
                  className="form-control"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="apellido" className="form-label">
                  Apellido
                </label>
                <input
                  id="apellido"
                  type="text"
                  className="form-control"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="correo" className="form-label">
                  Correo Electrónico
                </label>
                <input
                  id="correo"
                  type="email"
                  className="form-control"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="nombre_usuario" className="form-label">
                  Nombre de Usuario
                </label>
                <input
                  id="nombre_usuario"
                  type="text"
                  className="form-control"
                  value={nombre_usuario}
                  onChange={(e) => setNombre_usuario(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="contraseña" className="form-label">
                  Contraseña de usuario
                </label>
                <input
                  id="contraseña"
                  type="password"
                  className="form-control"
                  value={contrasena_usuario}
                  onChange={(e) => setContrasena_usuario(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="confirmar-password" className="form-label">
                  Confirmar Contraseña
                </label>
                <input
                  id="confirmar-password"
                  type="password"
                  className="form-control"
                  value={confirmaContrasena}
                  onChange={(e) => setConfirmaContrasena(e.target.value)}
                  required
                />
              </div>

              <div className="d-grid gap-2">
                <button className="btn btn-primary" type="submit">
                  Registrar
                </button>
              </div>
            </form>
            <div className="row">
              <small>
                ¿Tienes Cuenta? <Link to="/">Ingresar</Link>
              </small>
            </div>

            {showAlert && (
              <div className="alert alert-info mt-3" role="alert">
                {alertMessage}
              </div>
            )}

            {error && (
              <div className="alert alert-danger mt-3" role="alert">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Register;
