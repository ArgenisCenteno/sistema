import { useState, useContext, createContext, useEffect } from "react";

// Crear el contexto para el carrito
const CartContext = createContext();

// Proveedor de carrito
const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Cargar los elementos del carrito almacenados en el almacenamiento local al cargar el componente
  useEffect(() => {
    let existingCartItem = localStorage.getItem("cart");
    if (existingCartItem) setCart(JSON.parse(existingCartItem));
  }, []);

  // Renderizar el proveedor de contexto con el valor del estado del carrito
  return (
    <CartContext.Provider value={[cart, setCart]}>
      {children}
    </CartContext.Provider>
  );
};

// Hook personalizado para acceder al contexto del carrito
const useCart = () => useContext(CartContext);

export { useCart, CartProvider };

