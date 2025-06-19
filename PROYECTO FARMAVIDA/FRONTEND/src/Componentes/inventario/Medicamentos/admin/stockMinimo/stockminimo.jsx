import React, { useEffect, useState } from "react";
import api from "../../../../API/api.js";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../Auth/auth.jsx";
import Menu from "../../../../home/admimenulateral.jsx";

function Stockminimo() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const [stockminimo, setStockminimo] = useState([]);

  const getverificarStockYEnviarAlerta = async () => {
    try {
      const respuesta = await api.get("/verificar/stock");
      const productosProcesados = respuesta.data.productosBajoStock.map(producto => {
        let unidadMedida = '';
        let presentacion = '';
        

        switch(producto.PresentacionID_Presentacion) {
          case 1:
            presentacion = 'Cápsulas';
            unidadMedida = 'unidades';
            break;
          case 2:
            presentacion = 'Tabletas';
            unidadMedida = 'unidades';
            break;
          case 3:
            presentacion = 'Jarabe';
            unidadMedida = 'frascos';
            break;
          case 4:
            presentacion = 'Gotas';
            unidadMedida = 'frascos';
            break;
          case 5:
            presentacion = 'Crema';
            unidadMedida = 'frascos';
            break;
          case 6:
            presentacion = 'Inyectable';
            unidadMedida = 'frascos';
            break;
          default:
            presentacion = '';
            unidadMedida = '';
        }
        
        return {
          ...producto,
          presentacion,
          unidadMedida,
          nombreCompleto: `${producto.nombre} (${presentacion})`
        };
      });
      
      setStockminimo(productosProcesados || []); 
    } catch (error) {
      console.error("Error al obtener los productos con stock mínimo:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron obtener los productos con stock mínimo.",
      });
    }
  };

  useEffect(() => {
    getverificarStockYEnviarAlerta();
  }, []);

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <div className="boton-atras-container">
        <button onClick={handleGoBack} className="btn btn-primary fle_atras">
          <img src="/Assets/flecha_atras.png" alt="flecha_a" />
        </button>
      </div>
      <nav>
        <div className="head row">
          <div className="logos col p-3">
            <img src="/Assets/logo.png" alt="Logo de la farmacia" width="250px" />
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
          <Menu />
          <div className="col-lg-10 col-md-5 mt-0">
            <div className="App">
              <div className="container-fluid">
                <div className="row mt-5">
                  <div className="col-md-3 offset-md-4">
                  </div>
                </div>
                <div className="tabla_medic row mt-5">
                  <div className="col-12 col-lg-10">
                    <div className="table-responsive">
                      <table className="table table-bordered table-hover">
                        <thead className="table-primary">
                          <tr>
                            <th>ID</th>
                            <th>Producto (Presentación)</th>
                            <th>Stock Mínimo</th>
                            <th>Stock Actual</th>
                            <th>Faltante</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stockminimo.map((producto) => (
                            <tr 
                              key={producto.ID_PRODUCTO}
                              className={producto.stock_actual < producto.stock_minimo}
                            >
                              <td> {producto.ID_PRODUCTO}</td>
                              <td className="table-info">{producto.nombreCompleto}</td>
                              <td>{producto.stock_minimo} {producto.unidadMedida}</td>
                              <td className="table-info" style={{ fontWeight: producto.stock_actual < producto.stock_minimo ? "bold" : "normal" }}>
                                {producto.stock_actual} {producto.unidadMedida}
                              </td>
                              <td>
                                {Math.max(producto.stock_minimo - producto.stock_actual, 0)} {producto.unidadMedida}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stockminimo;