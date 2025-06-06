import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../Auth/auth";

function Menu() {
  const { user, profileImage } = useAuth();

  return (
    <div className="mlat col-2 md-2">
      <ul className="list-unstyled">
      {user && user.rolId === 1 && (
          <>
             <li className="nav-item">
             <div className="d-flex flex-column align-items-center mt-4">
                <Link to="/imagenUsuario" className="nav-link text-center">
                  <img 
                    src={profileImage} 
                    className="img-thumbnail" 
                    alt="Perfil"
                    width="70px"
                  />
                </Link>
              </div>
            </li>

            <li className="nav-item">
              <div className="d-flex flex-column align-items-center mt-4">
                <Link to="/proveedor" className="nav-link text-center">
                  <img
                    src="/Assets/proveedor.png"
                    className="img_L"
                    alt="Icono de laboratorio"
                    width="70px"
                    title="Laboratorio"
                  />
                  <h2>Registro de proveedores</h2>
                </Link>
              </div>
            </li>
            <li className="nav-item">
              <div className="d-flex flex-column align-items-center mt-4">
                <Link to="/medicamento" className="nav-link text-center">
                  <img
                    src="/Assets/medicamentos.png"
                    className="img_L"
                    alt="Icono de medicamentos"
                    width="70px"
                    title="Medicamentos"
                  />
                  <h2>Registro de medicamentos</h2>
                </Link>
              </div>
            </li>
            <li className="nav-item">
              <div className="d-flex flex-column align-items-center mt-4">
                <Link to="/movimiento" className="nav-link text-center">
                  <img
                    src="/Assets/flecha_entrada.png"
                    className="img_L"
                    alt="Icono de Movimiento"
                    width="70px"
                    title="Registro Movimiento"
                  />
                  <h2>Registro de Movimientos</h2>
                </Link>
              </div>
            </li>
            <li className="nav-item">
              <div className="d-flex flex-column align-items-center mt-4">
                <Link to="/informes" className="nav-link text-center">
                  <img
                    src="/Assets/informes.png"
                    className="img_L"
                    alt="Icono de informes"
                    width="70px"
                    title="Informes"
                  />
                  <h2>Informes</h2>
                </Link>
              </div>
            </li>
            <li className="nav-item">
              <div className="d-flex flex-column align-items-center mt-4">
                <Link to="/gestion_usuario" className="nav-link text-center">
                  <img
                    src="/Assets/usuario1.png"
                    className="img_L"
                    alt="Icono de gestión de usuarios"
                    width="70px"
                    title="Gestión de usuarios"
                  />
                  <h2>Gestión de usuario</h2>
                </Link>
              </div>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}

export default Menu;