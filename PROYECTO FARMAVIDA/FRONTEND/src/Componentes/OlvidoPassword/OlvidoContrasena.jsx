import { useState } from "react";
import api from "../API/api.js";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import "../../App.css";

function OlvidoContrasena() {
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [token, setToken] = useState("");
  const [step, setStep] = useState(1); 
  const navigate = useNavigate();

  const handleSolicitudRecuperacion = async (e) => {
    e.preventDefault();
    try {
    const response = await api.post("/auth/request-password-reset", {
        correo: email
      });
      
      setToken(response.data.token);
      setStep(2);
      Swal.fire({
        icon: 'success',
        title: 'Código enviado',
        text: 'Se ha enviado un código de verificación a tu correo electrónico.'
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Error al solicitar recuperación'
      });
    }
  };

  const handleVerificarCodigo = async (e) => {
    e.preventDefault();
       try {
      const response = await api.post("/auth/verify-reset-code", {
        token,
        code: codigo
      });
      
      setToken(response.data.resetToken);
      setStep(3);
      Swal.fire({
        icon: 'success',
        title: 'Código verificado',
        text: 'Ahora puedes establecer tu nueva contraseña.'
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Error al verificar el código'
      });
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (nuevaContrasena !== confirmarContrasena) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las contraseñas no coinciden'
      });
      return;
    }

    try {
      await api.post("/auth/reset-password", {
        token,
        newPassword: nuevaContrasena
      });
      
      Swal.fire({
        icon: 'success',
        title: 'Contraseña actualizada',
        text: 'Tu contraseña ha sido actualizada correctamente.'
      }).then(() => {
        navigate("/");
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Error al actualizar la contraseña'
      });
    }
  };

  return (
    <main>
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div className="row border rounded-5 p-4 bg-white shadow box-area wider-box" style={{ maxWidth: '980px' }}>
          <div className="col-md-6 rounded-4 d-flex justify-content-around align-items-center flex-column left-box">
            <img src="/Assets/logo.png" alt="Logo" className="img-fluid width-style" />
            <img src="/Assets/img1.png" alt="Farmacéutica" className="img-fluid width-style" />
          </div>
          
          <div className="col-md-6 right-box">
            {step === 1 && (
              <form onSubmit={handleSolicitudRecuperacion}>
                <h2 className="text-center">Recuperar Contraseña</h2>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Correo Electrónico</label>
                  <input
                  id="email"
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    Enviar Código
                  </button>
                </div>
                <div className="text-center mt-3">
                  <Link to="/">Volver al inicio de sesión</Link>
                </div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleVerificarCodigo}>
                <h2 className="text-center">Verificar Código</h2>
                <div className="mb-3">
                  <label htmlFor="verificar-codigo" className="form-label">Código de Verificación</label>
                  <input
                  id="verificar-codigo"
                    type="number"
                    className="form-control"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    required
                  />
                  <small className="text-muted">Ingresa el código que recibiste en tu correo</small>
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    Verificar Código
                  </button>
                </div>
                <div className="text-center mt-3">
                  <button 
                    type="button" 
                    className="btn btn-link"
                    onClick={() => setStep(1)}
                  >
                    Volver atrás
                  </button>
                </div>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleResetPassword}>
                <h2 className="text-center">Nueva Contraseña</h2>
                <div className="mb-3">
                  <label htmlFor="new-contraseña" className="form-label">Nueva Contraseña</label>
                  <input
                  id="new-contraseña"
                    type="password"
                    className="form-control"
                    value={nuevaContrasena}
                    onChange={(e) => setNuevaContrasena(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="confirmar-contraseña" className="form-label">Confirmar Contraseña</label>
                  <input
                  id="confirmar-contraseña"
                    type="password"
                    className="form-control"
                    value={confirmarContrasena}
                    onChange={(e) => setConfirmarContrasena(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    Establecer Nueva Contraseña
                  </button>
                </div>
                <div className="text-center mt-3">
                  <button 
                    type="button" 
                    className="btn btn-link"
                    onClick={() => setStep(2)}
                  >
                    Volver atrás
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default OlvidoContrasena;