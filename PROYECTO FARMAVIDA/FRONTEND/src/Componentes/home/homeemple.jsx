import React, { useState, useEffect } from "react";
import { useAuth } from "../Auth/auth.jsx";
import { useNavigate } from "react-router-dom";
import EmpleadoMenu from "./emplemenulateral.jsx";
import "../home/home.css";

function HomeEmple() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const formattedDate = currentDate.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

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
      <div className="container-fluid">
        <div className="op row d-flex">
          <EmpleadoMenu />
          <section className="bienvenida col-lg p-0">
            <div>
              <div className="text-overlay">
                <h1>
                  ¡Bienvenido al inventario
                  <br />
                  de FarmaVida!
                  <br />
                  {user && user.rol
                    ? user.rol === "Empleado"
                      ? "Empleado"
                      : "Administrador"
                    : "Usuario"}
                </h1>
                <div className="user-welcome-info">
                  <p className="welcome-username">{user?.nombre_usuario || 'Usuario'}</p>
                  <p className="welcome-date">{formattedDate}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default HomeEmple;