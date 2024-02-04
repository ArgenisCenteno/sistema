import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import { Outlet } from "react-router-dom";
import axios from "axios";
import Spinner from "../Spinner";

export default function PrivateRoute() {
  const [ok, setOk] = useState(false); // Estado para determinar si la autenticación es exitosa o no
  const [auth, setAuth] = useAuth(); // Hook personalizado para acceder a la autenticación

  useEffect(() => {
    const authCheck = async () => {
      const res = await axios.get("/api/v1/auth/user-auth"); // Realiza una solicitud GET a la ruta "/api/v1/auth/user-auth" para verificar la autenticación del usuario
      if (res.data.ok) {
        setOk(true); // Si la respuesta indica que la autenticación es exitosa, actualiza el estado "ok" a true
      } else {
        setOk(false); // Si la respuesta indica que la autenticación no es exitosa, actualiza el estado "ok" a false
      }
    };
    if (auth?.token) authCheck(); // Verifica si existe un token de autenticación. Si es así, realiza la verificación de autenticación.
  }, [auth?.token]); 

  return ok ? <Outlet /> : <Spinner />;
  // Si la autenticación es exitosa (ok = true), muestra el componente Outlet, que representa el contenido privado.
  // De lo contrario, muestra el componente Spinner, que podría ser un indicador de carga mientras se verifica la autenticación.
}
