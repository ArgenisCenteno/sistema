import { useState, useEffect } from "react";
import axios from "axios";

export default function useCategory() {
  const [categories, setCategories] = useState([]);

  // Obtener categorías
  const getCategories = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category"); // Realizar una solicitud GET a la ruta "/api/v1/category/get-category" para obtener las categorías
      setCategories(data?.category); // Establecer el estado "categories" con los datos de las categorías obtenidas
    } catch (error) {
      console.log(error); // Manejar errores en caso de que la solicitud falle
    }
  };

  useEffect(() => {
    getCategories(); // Llamar a la función para obtener las categorías al montar el componente
  }, []);

  return categories; // Devolver las categorías
}
