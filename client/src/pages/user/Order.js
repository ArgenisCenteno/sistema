import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import {PayPalButtons } from '@paypal/react-paypal-js';  
import {  useParams } from "react-router-dom"; 
import axios from "axios";
import toast from "react-hot-toast";
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import CreditCardOffIcon from '@mui/icons-material/CreditCardOff';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import "../../styles/CartStyles.css";
import { Modal, Form, Input, Select, Button } from 'antd';

const Order = () => { 
  const params = useParams();
  const [loading, setLoading] = useState(false); 
  const [orderData, setOrderData] = useState(null); // Estado para almacenar los datos de la orden
  const [isPaying, setIsPaying] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tasa, setTasa] = useState("");
  const [banco, setBanco] = useState("");
  const [documento, setDocumento] = useState("");
  const [telefono, setTelefono] = useState("");

  // Función para abrir el formulario
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Función para cerrar el formulario
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await axios.get("/api/v1/auth//all-config");
        const configData = response.data.config;

        // Establecer los valores de la configuración en los estados del componente 
        setTasa(configData.tasa); 
        setBanco(configData.banco);
        setTelefono(configData.telefono);   
        setDocumento(configData.documento)
      } catch (error) {
        console.error("Error al obtener la configuración:", error);
      }
    };

    fetchConfig();
  }, []); // La dependencia vacía asegura que esta función s

  const onFinish = async(values) => {
    // Aquí puedes manejar la lógica para enviar los datos del formulario
    // Puedes enviar los datos al servidor, actualizar el estado, etc.
    try {
      const orderId = params._id;
      const { data } = await  axios.post("/api/v1/product/paywithbank", {
          values,
          orderId, 
      }); 
      toast.success("Pago enviado ")
      window.location.reload()  
  } catch (error) {
      setIsPaying(false); 
      toast.error('Error al realizar el pago');
  }
    setIsModalVisible(false);
  };


  useEffect(() => {
    setLoading(true);
    const getOrderData = async () => {
      try {
        const { data } = await axios.get(`/api/v1/auth/order/${params._id}`);
         
        setOrderData(data);
        setLoading(false);
      } catch (error) {
         
        setLoading(false);
      }
    };
    getOrderData();
  }, [params.slug]);



  const onOrderCompleted = async (details) => {
    if ( details.status !== 'COMPLETED' ) {
      return toast.error('No hay pago en Paypal'); }

      setIsPaying(true);

      try {
          const orderId = params._id;
          const { data } = await  axios.post("/api/v1/product/paypal-pay", {
              transactionId: details.id,
              orderId, 
          }); 
          window.location.reload()  
      } catch (error) {
          setIsPaying(false); 
          toast.error('Error al realizar el pago');
      }
   
  }
    
  return (
    <Layout style={{ width: "100vw" }}>
   <section className="h-100 gradient-custom" style={{height: "100%"}}>
  <div className="container py-5 h-100">
    <div className="row d-flex   justify-content-center  h-100">
      <div className="col-lg-10 col-xl-8 mt-4">
        <div className="card" style={{borderRadius: "10px"}}>
        
          <div className="card-header px-4 py-5 text-muted" style={{backgroundColor: "white"}} >
             { !orderData?.order?.payment && !orderData?.order?.isPaid   ? <h4 className="text-muted mb-0">¡Gracias por su compra!</h4> : <h4>Productos a pagar</h4> } 
           </div>
          <div className="card-body p-4">
          
              <div class="d-flex justify-content-between align-items-center mb-4">
              <p class="lead fw-normal mb-0 text-muted" >Código de orden : {orderData?.order?._id}</p>
             
              <p class="small text-muted mb-0"></p>
            </div>
            <div class="d-flex justify-content-between align-items-center mb-4">
              
              <p class="lead fw-normal mb-0 text-muted"  >Estado de orden : {orderData?.order?.status}</p>
              <p class="small text-muted mb-0"></p>
            </div>
          {orderData?.order?.products?.map((p, index) => (
            <div className="card shadow-0 border mb-4" key={index}>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-2">
                 
                    <img  src={`/api/v1/product/product-photo/${p._id}`}
                      className="img-fluid"  alt={p.name}/>
                  </div>
                  <div className="col-md-2 text-left d-flex justify-content-center align-items-center">
                  
                    <p className="text-muted mb-0"> <strong>Nombre:</strong> {p.name}</p>
                  </div>
                  <div className="col-md-2 text-left d-flex justify-content-center align-items-center">
                  
                    <p className="text-muted mb-0 "><strong>Talla:</strong> {p.size}</p>
                  </div>
                  <div className="col-md-2 text-center d-flex justify-content-center align-items-center">
                  
                    <p className="text-muted mb-0 "><strong> Cantidad: </strong> {p.quantity}</p>
                  </div>
                  <div className="col-md-2 text-center d-flex justify-content-center align-items-center">
                   
                    <p className="text-muted mb-0  "><strong> Precio:</strong>  {p.price}</p>
                  </div>
                  
                </div> 
                
              </div>
            </div> 
             ))}
           <div className="d-flex flex-column pt-2">
   
</div>
<div className="d-flex flex-column pt-2">
  <div className="d-flex justify-content-between mb-2">
    <p className="fw-bold mb-0">Detalles de entrega</p>
    
  </div>

  <div className="d-flex justify-content-between mb-2">
    <p className="text-muted mb-0">Estado: {orderData?.order?.address.estado}</p>
   
  </div>

  <div className="d-flex justify-content-between mb-2">
    <p className="text-muted mb-0"> Municipio: {orderData?.order?.address.municipio} </p>
   </div>
  <div className="d-flex justify-content-between mb-2">
    <p className="text-muted mb-0">Parroquia: {orderData?.order?.address.parroquia}</p>
   </div>
   <div className="d-flex justify-content-between mb-2">
    <p className="text-muted mb-0">Zona: {orderData?.order?.address.zona}</p>
   </div>
   <div className="d-flex justify-content-between mb-2">
    <p className="text-muted mb-0">Código postal: {orderData?.order?.address.codigoPostal}</p>
   </div>
   <div className="d-flex justify-content-between mb-2">
    <p className="text-muted mb-0">Servicio de entrega: {orderData?.order?.address.servicioEntrega}</p>
   </div>
</div>

<div className="d-flex flex-column pt-2">
  <div className="d-flex justify-content-between mb-2">
    <p className="fw-bold mb-0">Para pagar con pago Movil </p>
        
  </div>

  <div className="d-flex justify-content-between mb-2">
                          <p className="mb-2">Telefono</p>
                          <p className="mb-2">{telefono}</p>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <p className="mb-2">Docuemeto</p>
                          <p className="mb-2">{documento}</p>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <p className="mb-2">Banco</p>
                          <p className="mb-2">{banco}</p>
                        </div>
   
</div>


           
          </div>
          
        </div>
      </div>
      <div className=" col-lg-4  h-100 mt-4">
        <div className="card h-100 " >
          <div className="card-header text-center px-4 py-4"style={{backgroundColor: "white" }} >
           <h5 className="text-muted mb-0"><span  >Resumen de Pago</span> </h5>
          </div>
          <div className="card-body ">
          <div >
            

            {/* Show the address details if available */}
           
    <div className="mb-3 text-muted  ">
    <div className="border-0 py-4 d-flex flex-column p-2"
            style={{backgroundColor: "#125E8A"}}>
            <h5 className="d-flex align-items-center text-center justify-content-center text-white text-uppercase mb-0">Monto Total: <span className="  mb-0 ms-2">${orderData?.order?.total?.toFixed(2)}</span></h5>
            <h5 className="d-flex align-items-center text-center justify-content-center text-white text-uppercase mb-0">Monto en BS: <span className="  mb-0 ms-2">  {orderData?.order?.total * tasa}</span></h5>

            <p className="d-flex align-items-center text-center justify-content-center text-white text-uppercase mb-0"><span className="fw-bold me-4">Subtotal</span> ${orderData?.order?.subtotal?.toFixed(2)}</p>
            <p className="d-flex align-items-center text-center justify-content-center text-white text-uppercase mb-0"><span className="fw-bold me-4">Envío</span>  ${Number(orderData?.order?.address.tasaEnvio)}</p>
          </div>
           
      <p className="text-center mt-4">
        <strong>Estado de Pago</strong>
      </p>
           
      {  orderData?.order?.payment &&  orderData?.order?.isPaid  ? (
        
    <p className="text-center" style={{color: "#059669"}} ><CreditScoreIcon/> <strong>Orden Pagada</strong> </p>
  ) : (
    <>
    <div className="mt-2 text-muted  ">
                      <p className="text-center" style={{color: "red"}}><CreditCardOffIcon/> <strong>Orden Sin Pagar</strong> </p>
                      {orderData?.order?.total && (
              <PayPalButtons 
              createOrder={(data, actions) => {
                
                return actions.order.create({
                    purchase_units: [
                        {
                            amount: {
                                value: `${orderData?.order?.total}` ,
                            },
                        },
                    ],
                });
            }}
            onApprove={(data, actions) => {
                return actions.order.capture().then((details) => {
                    onOrderCompleted( details );
                    // console.log({ details  })
                    // const name = details.payer.name.given_name;
                    // alert(`Transaction completed by ${name}`);
                });
            }}
              />)}
             
              </div>
              <button className="btn btn-success  btn-lg btn-block mt-4 mb-4 "          onClick={showModal}>Pagar con Pago Movil </button> <br/>
              <span className="span text-muted  mt-2  text-center "> <strong>Atencion al cliente</strong> </span>
  <a href="https://wa.link/5ye7qg" target="_blank" style={{textDecoration: "none"}}>
              <button className="btn btn-primary btn-lg btn-block mt-4" style={{width: "100%"}}> <WhatsAppIcon/> WhatsApp</button>
            </a>

              </>
  )}
  
       
    </div>
    </div>
          </div>

        </div> 
      </div>
    </div>
  </div>

  <Modal
        title="Pagar con Pago Móvil/Transferencia"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
          
        <Form
          name="paymentForm"
          onFinish={onFinish}
          initialValues={{ monto: (orderData?.order?.total * tasa).toFixed(2) }}
          >
          <Form.Item
            label="Banco"
            name="banco"
            rules={[{ required: true, message: 'Por favor, selecciona un banco' }]}
          >
             
              <Input placeholder="Banco"/>
          </Form.Item>

          <Form.Item
            label="Monto"
            name="monto"
            rules={[{ required: true, message: 'Por favor, ingresa el monto' }]}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            label="Tipo de Transacción"
            name="tipoTransaccion"
            rules={[{ required: true, message: 'Por favor, selecciona el tipo de transacción' }]}
          >
            <Select>
              {/* Opciones de tipo de transacción */}
              <Select.Option value="pagoMovil">Pago Móvil</Select.Option>
              <Select.Option value="transferencia">Transferencia</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Código de Referencia"
            name="codigoReferencia"
            rules={[{ required: true, message: 'Por favor, ingresa el código de referencia' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Enviar Pago
            </Button>
          </Form.Item>
        </Form>
      </Modal>
</section>
  </Layout>
  );
};

export default Order;
