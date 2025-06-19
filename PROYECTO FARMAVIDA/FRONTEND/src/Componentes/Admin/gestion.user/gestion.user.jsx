  import { useAuth } from "../../Auth/auth.jsx";
import { Link, useNavigate } from "react-router-dom";
import "../../Admin/gestion.user/gestion.user.css";
import Menu from "../../home/admimenulateral.jsx";

function GestionUsu() {
  const { logout } = useAuth();
  const navigate = useNavigate();

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
          <section className="gestionUsuario col-lg p-0">
            <div className="mainContainer">
              <div className="botones">
                <Link to="/user_crud">
                  <button
                    className="botones1 btn-lg btn-light fs-6"
                    aria-label="Perfil Administrador"
                  >
                    <img
                      src="/Assets/usuario2.png"
                      alt="Gestionar perfil administrador"
                    />
                  </button>
                </Link>
                <p className="admi_emple"> Administrador</p>
              </div>
              <div className="botones">
                <Link to="/empleado_crud">
                  <button className="botones1 btn-lg btn-light fs-6">
                    <img
                      src="/Assets/grupo_usuarios.png"
                      alt="Gestionar perfiles de empleados"
                    />
                  </button>
                </Link>
                <p className="admi_emple"> Empleados</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default GestionUsu;
