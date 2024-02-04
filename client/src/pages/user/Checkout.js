import React, { useState, useEffect } from 'react';
import { useCart } from "../../context/cart";
import { useAuth } from "../../context/auth";
import Layout from "../../components/Layout/Layout.js";
import axios from "axios"; 
import { useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
const initialState = {
  estado: '',
  municipio: '',
  parroquia: '',
  zona: '',
  codigoPostal: '',
  servicioEntrega: '',
  telefono: '',
  tasaEnvio: 0,
};

const Checkout = () => {
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const [isFormComplete, setIsFormComplete] = useState(false);

 
  useEffect(() => {
    // Verificar si el usuario está autenticado
    const isAuthenticated = localStorage.getItem('auth');
    if (!isAuthenticated) {
      navigate("/login");
      toast.error("Debe iniciar sesión para hacer checkout");
    }
  }, [navigate]);

  
  useEffect(() => {
    // Obtener el carrito del localStorage
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');

    // Verificar si el carrito está vacío
    if (cartItems.length === 0) {
      navigate("/cart");
      toast.error("Agregue productos a su carrito");
    }
  }, [navigate]);
 

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (event) => {
    if (event.target.checked) {
      setFormData({
        ...formData,
        estado: 'Monagas',
        municipio: 'Ezequiel Zamora',
        parroquia: 'Punta de Mata',
        codigoPostal: '6217'
      });
    } else {
      setFormData(initialState); // Aquí se reinician todos los campos
    }
  };

  const userId =  auth?.user?._id

  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que el formulario se envíe automáticamente
  
    try {  
      setLoading(true);
      const { data } = await axios.post("/api/v1/product/create-order", { 
        cart, 
        formData, 
        userId
      });  
      
      localStorage.removeItem("cart");
      setCart([]);
      toast.success("Orden iniciada");
      
      setLoading(false);
    // Redireccionar a la ruta de la orden completada
      navigate(`/dashboard/user/order/${data.order._id}`);
      
      
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // Verificar si todos los campos requeridos están completos
  useEffect(() => {
    const { estado, municipio, parroquia, zona, codigoPostal, servicioEntrega, telefono, tasaEnvio } = formData;
    setIsFormComplete(
      estado !== '' &&
      municipio !== '' &&
      parroquia !== '' &&
      zona !== '' &&
      codigoPostal !== '' &&
      servicioEntrega !== '' &&
      telefono !== ''&&
      tasaEnvio !== '' &&
      telefono.length  == 11

    );
  }, [formData]);

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    if (value === "Delivery") {
      setFormData({
        ...formData,
        [name]: value,
        tasaEnvio: 5,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
        tasaEnvio: 0,
      });
    }
  };
  

  return (
    <Layout>
    <div className="row mt-3 mx-3" style={{ marginTop: '25px',  marginBottom: '25px'  }} mb-4>
  <div className="col-md-3">
    <div style={{ marginTop: '50px', marginLeft: '10px' }} className="text-center">
   
    <LocalShippingIcon style={{fontSize: "94px", color: "#125E8A"}}/>
      <p className="white-text">Para envíos nacionales, puede contactar a atención al cliente por medio
        de Whatsapp para consultar los servicios de envíos disponibles. 
      </p>
    </div>
    <div className="text-center">
      <button type="submit" className="btn btn-success btn-rounded  mb-4">
        <WhatsAppIcon/>
       Whatsapp
      </button>
    </div>
  </div>
  <div className="col-md-9 justify-content-center">
    <div className="card card-custom pb-4" style={{border: "2px solid #125E8A" }}>
      <div className="card-body mt-0 mx-5">
        <div className="text-center mb-3 pb-2 mt-3">
          <h4 style={{ color: '#495057' }}>Detalles de entrega</h4>
        </div>
        <form className="mb-0" onSubmit={handleSubmit}>
        <div className="col">
            <div className="form-group mt-3">
          <div className="form-check">

                <input type="checkbox" className="form-check-input" onChange={handleCheckboxChange} />
                <strong><h4 className="form-check-label text-primary">¿Eres de Punta de Mata?</h4></strong>

              </div>
              </div>
            </div>
          <div className="row mb-4">
           
            <div className="col">
            <div className="form-group">
                <strong><label className="form-label">Estado:</label></strong>
                <input type="text" name="estado" className="form-control" value={formData.estado} onChange={handleChange} />
              </div>
            </div>
            <div className="col">
            <div className="form-group">
                <strong><label className="form-label">Municipio:</label></strong>
                <input type="text" name="municipio" className="form-control" value={formData.municipio} onChange={handleChange} />
              </div>
            </div>
          </div>
          <div className="row mb-4">
            <div className="col">
            <div className="form-group">
                <strong><label className="form-label">Parroquia:</label></strong>
                <input type="text" name="parroquia" className="form-control" value={formData.parroquia} onChange={handleChange} />
              </div>
            </div>
            <div className="col">
            <div className="form-group">
                <strong><label className="form-label" >Zona:</label></strong>
                <input type="text" name="zona" className="form-control" value={formData.zona} onChange={handleChange} />
              </div>
            </div>
          </div>
          <div className="row mb-4">
          <div className="col">
          <div className="form-group">
                <strong><label className="form-label">Código Postal:</label></strong>
                <input type="text" name="codigoPostal" className="form-control" value={formData.codigoPostal} onChange={handleChange} />
              </div>
              </div>
            <div className="col">
            <div className="form-group">
                  <strong><label className="form-label">Servicio de Entrega:</label></strong>
                  <select name="servicioEntrega" className="form-control" value={formData.servicioEntrega} onChange={handleSelectChange}>

                   <option value="">Seleccionar servicio de entrega</option>
                   <option value="MRW">MRW</option>
                   <option value="ZOOM">ZOOM</option> 
                   <option value="Delivery">Delivery</option>
                   <option value="Retirar en negocio">Retirar en negocio</option>
                 </select>
                </div>
            </div>
            
          </div>
          <div className='row mb-4'>
          <div className="col">
            <div className="form-group">
                <strong><label className="form-label">Teléfono de contacto:</label></strong>
                <input type="text" name="telefono" maxLength="11" className="form-control" value={formData.telefono} onChange={handleChange} />
              
              </div>
              {formData.telefono.length !== 11 && (
                    <small className="text-danger">
                      El número de telefono debe tener 11 digitos
                    </small>
                  )}
              </div>
              <div className="col">
              
              </div>
              
          </div>
          <div className="float-end">
            {/* Submit button */}
            <button
        type="submit"
        className="btn btn-primary mt-3 mb-4"
        disabled={!isFormComplete || loading}
      >
        {loading ? "Procesando..." : "Continuar"}
      </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>

    </Layout>
  );
};

export default Checkout;
