import { useState, useContext, createContext } from "react";

// Crear el contexto para la búsqueda
const SearchContext = createContext();

// Proveedor de búsqueda
const SearchProvider = ({ children }) => {
  const [search, setSearch] = useState({
    keyword: "",
    results: [],
  });

  // Renderizar el proveedor de contexto con el valor del estado de búsqueda
  return (
    <SearchContext.Provider value={[search, setSearch]}>
      {children}
    </SearchContext.Provider>
  );
};

// Hook personalizado para acceder al contexto de búsqueda
const useSearch = () => useContext(SearchContext);

export { useSearch, SearchProvider };
