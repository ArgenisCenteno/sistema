import { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";

// Crear el contexto para la autenticación
const AuthContext = createContext();

// Proveedor de autenticación
const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });

  // Establecer el token de autenticación en las cabeceras de Axios por defecto
  axios.defaults.headers.common["Authorization"] = auth?.token;

  // Cargar la información de autenticación almacenada en el almacenamiento local al cargar el componente
  useEffect(() => {
    const data = localStorage.getItem("auth");
    if (data) {
      const parseData = JSON.parse(data);
      setAuth({
        ...auth,
        user: parseData.user,
        token: parseData.token,
      });
    }
    // eslint-disable-next-line
  }, []);

  // Renderizar el proveedor de contexto con el valor del estado de autenticación
  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para acceder al contexto de autenticación
const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };
