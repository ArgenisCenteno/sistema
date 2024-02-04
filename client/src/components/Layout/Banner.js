import React from 'react'
import StoreIcon from '@mui/icons-material/Store';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { Link } from 'react-router-dom';

const Banner = () => {
  return (
    <div> 
    <footer className="text-center text-lg-start   text-white" style={{backgroundColor: "black", marginTop: "8rem"}}>
      
      <section className="">
        <div className="container text-center text-md-start pt-5 ">
         
          <div className="row mt-3">
            
            <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
              
              <h6 className="text-uppercase mb-4">
                <StoreIcon/> Blanca Sánchez C.A
              </h6>
              <p>
               Empresa especializada en la venta de ropa para hombres, mujeres, niños y niñas. Contamos con tienda fisica, un
               amplio catologo de productos con los mejores precios. Puedes contactarnos a través de Whatsapp.    
              </p>
            </div>
            
            <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
              
              <h6 className="text-uppercase  mb-4">
                Enlaces
              </h6>
              <p>
                <a href="/register" style={{textDecoration: "none"}} className="text-reset">Registrar</a>
              </p>
              <p>
                <a href="/login" style={{textDecoration: "none"}} className="text-reset">Ingresar</a>
              </p>
              <p>
                <a href="/categories" style={{textDecoration: "none"}} className="text-reset">Productos</a>
              </p>
              <p>
                <a href="/cart" style={{textDecoration: "none"}} className="text-reset">Carrito</a>
              </p>
            </div>
             
            
            
            <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
           
              <h6 className="text-uppercase  mb-4">Contacto</h6>
               <p><LocationOnIcon/>  Punta de Mata</p>
               
              <Link  style={{textDecoration: "none"}}><WhatsAppIcon/> 04129874785</Link>
 
            </div>
            
          </div>
         
        </div>
      </section>
      
      <div className="text-center p-4"  >
        © BLANCA SÁNCHEZ C.A. Todos los derechos reservados 
         
      </div>
     
    </footer></div>
  )
}

export default Banner 