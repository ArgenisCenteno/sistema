import React, { useState, useEffect } from "react"; 
import Layout from "./../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import axios from "axios";
import AdminMenu from "../../components/Layout/AdminMenu";
 
const ConfigAdmin = () => {
  // CONTEXTO
  const [auth, setAuth] = useAuth();
  
  // ESTADOS
  const [tasa, setTasa] = useState("");
  const [banco, setBanco] = useState("");
  const [telefono, setTelefono] = useState("");
  const [documento, setDocumento] = useState("");
  const [email, setEmail] = useState("");
   
  // OBTENER LA CONFIGURACIÓN AL MONTAR EL COMPONENTE
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await axios.get("/api/v1/auth//all-config");
        const configData = response.data.config;

        // Establecer los valores de la configuración en los estados del componente
        setEmail(configData.email);
        setTelefono(configData.telefono);
        setDocumento(configData.documento);
        setTasa(configData.tasa);
        setBanco(configData.banco);
      } catch (error) {
        console.error("Error al obtener la configuración:", error);
      }
    };

    fetchConfig();
  }, []); // La dependencia vacía asegura que esta función solo se ejecute una vez al montar el componente

  // CREAR O ACTUALIZAR LA CONFIGURACIÓN
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const info = new FormData();
      info.append("email", email);
      info.append("telefono", telefono);
      info.append("documento", documento);
      info.append("tasa", tasa);
      info.append("banco", banco);

      const { data } = await axios.put("/api/v1/auth/update-config", info);

      if (data?.success) {
        toast.success(data?.message);
      } else {
        toast.error("Verifique los campos para crear la configuración");
      }
    } catch (error) {
      console.log(error);
      toast.error("Complete los campos en el formulario");
    }
  };

  return (
    <Layout >
      <div className=" container-fluid p-3 dashboard "  >
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-8 mt-4">
          <h1 className="title">Ajustes Generales del sistema</h1>
            <div  >
              <form onSubmit={handleCreate} >
                
                <div className="mb-3">
                  <span><strong>Email</strong></span>
                  <input
                    type="text" 
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control" 
                    placeholder="Email"
                    autoFocus
                  />
                </div>
                <div className="mb-3">
                  <span><strong>Telefono</strong></span>
                  <input
                    type="telefono" 
                    name="telefono"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="form-control" 
                    placeholder="Telefono"
                  />
                </div>
                <div className="mb-3">
                  <span><strong>Documento</strong></span>
                  <input
                    type="number" 
                    name="documento"
                    value={documento}
                    onChange={(e) => setDocumento(e.target.value)}
                    className="form-control" 
                    placeholder="Documento" 
                  />
                </div>
                <div className="mb-3">
                  <span><strong>Tasa Dolar</strong></span>
                  <input
                    type="number"
                    step="any" 
                    name="tasa"
                    value={tasa}
                    onChange={(e) => setTasa(e.target.value)}
                    className="form-control" 
                    placeholder="Ingresa tasa del dolar" 
                  />
                </div>
                <div className="mb-3">
                  <span><strong>Banco</strong></span>
                  <input
                    type="text"  
                    name="banco"
                    value={banco}
                    onChange={(e) => setBanco(e.target.value)}
                    className="form-control" 
                    placeholder="Banco" 
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Guardar cambios
                </button>
              </form>
            </div>
          </div>  
        </div> 
      </div>
    </Layout>
  );
};

export default ConfigAdmin;
