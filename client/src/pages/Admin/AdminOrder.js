import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import { Modal, Button } from "antd";
import { useAuth } from "../../context/auth";
import { useNavigate, useParams } from "react-router-dom"; 
import axios from "axios";
import toast from "react-hot-toast";
import "../../styles/CartStyles.css";
 
const AdminOrder = () => {
  const [auth, setAuth] = useAuth();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null); // Estado para almacenar los datos de la orden
  const [showModal, setShowModal] = useState(false);
 
  useEffect(() => {
    setLoading(true);
    const getOrderData = async () => {
      try {
        const { data } = await axios.get(`/api/v1/auth/order/${params._id}`);
        console.log(data)
        setOrderData(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    getOrderData();
  }, [params.slug]);
  
  const handleMarkAsPaid = async () => {
    try {
      // Hacer la solicitud a la ruta /update-isPaid enviando el _id de la orden
      await axios.put(`/api/v1/auth/update-isPaid/${orderData?.order?._id}`);

      // Mostrar un mensaje de éxito usando react-hot-toast
      toast.success("La orden ha sido marcada como pagada.");

      // Cerrar el modal de confirmación
      setShowModal(false);

      // Actualizar la información de la orden para reflejar el nuevo estado de pago
      setOrderData((prevOrderData) => ({
        ...prevOrderData,
        order: {
          ...prevOrderData.order,
          isPaid: true,
        },
      }));
    } catch (error) {
      console.log(error);
      // Mostrar un mensaje de error en caso de que haya un problema con la solicitud
      toast.error("Ha ocurrido un error al marcar la orden como pagada.");
    }
  };


  return (
    <Layout title={"Dashboard - Orden"}>
    <div className="cart-page">
    <div className="row pt-20">
          
        </div>

      <div className="container" style={{ marginTop: "22px", paddingBottom: "22px" }}>
        <div className="row pb-4">
        <div className="col-lg-8 mb-4 pb-4">
          <h2>Código: {orderData?.order?._id}</h2>  
            <h5>Usted ha comprado</h5>
            {/* Show the products in the order */}
            {orderData?.order?.products?.map((p, index) => (
             <div className="card mb-3" key={index}>
             <div className="row no-gutters">
               <div className="col-12 col-md-3">
                 <img
                   src={`/api/v1/product/product-photo/${p._id}`}
                   className="card-img-Pay"
                   alt={p.name}
                   style={{ maxHeight: "140px" }}
                 />
               </div>
               <div className="col-12 col-md-9">
                 <div className="card-body">
                   <h5 className="card-title">{p.name}</h5>
                   <p className="card-text">
                     <strong>Talla:</strong> {p.size} <br />
                     <strong>Cantidad:</strong> {p.quantity} <br />
                     <strong>Precio:</strong> {p.price}
                   </p>
                 </div>
               </div>
             </div>
           </div>
            ))}
          </div>

          <div className="col-lg-4 cart-summary">
            <h2>Resumen total de la Orden</h2>
            <p>Total | Información de entrega </p>
            <hr />
            {/* Show the total amount of the order */}
            <h2 style={{ color: "#017752" }}>Total: {orderData?.order?.total?.toFixed(2)}</h2>
            <h5 style={{ color: "#017752" }}>Subtotal: {orderData?.order?.subtotal?.toFixed(2)}</h5>
            <h5 style={{ color: "#017752" }}>Tasa de envío: ${orderData?.order?.address.tasaEnvio}</h5>
            <hr />

            {/* Show the address details if available */}
            {orderData?.order?.address && (
  <>
    <div className="mb-3">
      <h4>
        <strong>Dirección de entrega</strong>
      </h4>
      <h5>
        <strong>Estado:</strong> {orderData?.order?.address.estado}
      </h5>
      <h5>
        <strong>Municipio:</strong> {orderData?.order?.address.municipio}
      </h5>
      <h5>
        <strong>Parroquia:</strong> {orderData?.order?.address.parroquia}
      </h5>
      <h5>
        <strong>Zona:</strong> {orderData?.order?.address.zona}
      </h5>
      <h5>
        <strong>Código Postal:</strong> {orderData?.order?.address.codigoPostal}
      </h5>
      <h5>
        <strong>Servicio de Entrega:</strong> {orderData?.order?.address.servicioEntrega}
      </h5>
      <h5>
        <strong>Contacto:</strong> {orderData?.order?.address.telefono}
      </h5>
       
      <hr />
      
    </div>
  </>
)}
    <div className="mb-3">
      <h4>
        <strong>Estado de la Orden</strong>
      </h4>
      <h5 style={{color: "#059669"}}>
        {orderData?.order?.status}
      </h5>
      <h4>
  <strong>Estado de Pago</strong>
</h4>

{orderData?.order?.isPaid ? (
  <h5 style={{ color: "#059669" }}>
     Orden Pagada 
  </h5>
) : (
  <h5 style={{ color: "red" }}>
     Orden Sin Pagar <br/> 
     <Button type="success" className="mt-2 btn btn-success" onClick={() => setShowModal(true)}>
          Marcar como pagado
        </Button>
  </h5>
)}
    </div>
          </div>
        </div>
      </div>
    </div>
    <Modal
        title="Confirmar pago"
        visible={showModal}
        onOk={handleMarkAsPaid}
        onCancel={() => setShowModal(false)}
        okText="Confirmar"
        cancelText="Cancelar"
      >
        <p>¿Está seguro que desea marcar esta orden como pagada?</p>
      </Modal>
  </Layout>
  

  );
};

export default AdminOrder;
