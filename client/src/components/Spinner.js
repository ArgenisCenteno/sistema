import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Spinner = ({ path = "login" }) => {
  const [count, setCount] = useState(3); // Estado para realizar una cuenta regresiva
  const navigate = useNavigate(); // Hook de enrutamiento para redirigir a una ruta específica
  const location = useLocation(); // Hook de enrutamiento para obtener la ubicación actual

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevValue) => --prevValue); // Decrementa el valor de count cada segundo
    }, 1000);

    count === 0 &&
      navigate(`/${path}`, {
        state: location.pathname, // Redirige a la ruta especificada cuando count llega a cero, pasando la ubicación actual como estado
      });

    return () => clearInterval(interval); // Limpia el intervalo cuando el componente se desmonta

  }, [count, navigate, location, path]);

  return (
    <>
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
       
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    </>
  );
};

export default Spinner;
