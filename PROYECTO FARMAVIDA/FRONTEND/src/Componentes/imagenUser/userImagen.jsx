import React, { useState } from "react";
import { useAuth } from "../Auth/auth.jsx";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import Menu from "../home/admimenulateral.jsx";
import EmpleadoMenu from "../home/emplemenulateral.jsx";
import { FaUserCircle, FaCamera, FaUpload } from "react-icons/fa";

function GestionUsu() {
  const { logout, profileImage, updateProfileImage } = useAuth();
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);

      // Simulando carga de imagen
      setTimeout(() => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const newImage = reader.result;
          updateProfileImage(newImage); 
          setIsUploading(false);
          Swal.fire({
            icon: "success",
            title: "¡Foto actualizada!",
            text: "Tu foto de perfil se ha cambiado correctamente.",
            timer: 2000,
            showConfirmButton: false,
          });
        };
        reader.readAsDataURL(file);
      }, 1500);
    }
  };

  return (
    <div className="profile-container">
      <nav>
        <div className="head row">
          <div className="logos col p-3">
            <Link to={"/"}>
            <img
              src="/Assets/logo.png"
              alt="Logo de la farmacia"
              width="250px"
            />
            </Link>
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
          <div className="boton-atras-container">
            <button
              onClick={handleGoBack}
              className="btn btn-primary fle_atras"
            >
              <img src="/Assets/flecha_atras.png" alt="flecha_a" />
            </button>
          </div>
          <section className="gestionUsuario col-lg p-0">
            <div className="mainContainer">
              <div className="profile-section">
                <h2 className="profile-title mb-4">
                  <FaUserCircle className="me-2" />
                  Editar Foto de Perfil
                </h2>

                <div className="profile-image-container">
                  <div className="image-wrapper">
                    <img
                      src={profileImage}
                      className="img-thumbnail profile-image"
                      alt="Perfil"
                    />
                    <div className="camera-icon">
                      <FaCamera />
                    </div>
                  </div>

                  <div className="upload-section mt-4">
                    <label htmlFor="profile-upload" className="upload-btn">
                      <FaUpload className="me-2" />
                      {isUploading ? "Subiendo..." : "Seleccionar Imagen"}
                      <input
                        id="profile-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={isUploading}
                        style={{ display: "none" }}
                      />
                    </label>
                    <p className="upload-hint mt-2">
                      Formatos soportados: JPG, PNG (Max. 2MB)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default GestionUsu;
