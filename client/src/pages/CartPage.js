import React,{useState, useEffect}  from "react";
import Layout from "./../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
  
import "../styles/CartStyles.css";
 
const CartPage = () => {
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const [tasa, setTasa] = useState("");

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await axios.get("/api/v1/auth//all-config");
        const configData = response.data.config;

        // Establecer los valores de la configuración en los estados del componente 
        setTasa(configData.tasa); 
      } catch (error) {
        console.error("Error al obtener la configuración:", error);
      }
    };

    fetchConfig();
  }, []); // La dependencia vacía asegura que esta función s
   
  const navigate = useNavigate();  
  
  //CALCULAR EL TOTAL 
  const totalPrice = () => {
    try {
      let total = 0;
      cart?.map((item) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
      });
      return total.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    } catch (error) {
      console.log(error);
    }
  };
  //REMOVER PRODUCTO
  const removeCartItem = (pid) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === pid);
      myCart.splice(index, 1);
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
    } catch (error) {
      console.log(error);
    }
  };

  const totalDolares = () => {
    try {
      let total = 0; 
      cart?.map((item) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
      });
      const subtotal = total  ;
      const monto = subtotal * tasa;
      return monto.toFixed(2).toLocaleString();
    } catch (error) {
      console.log(error);  
    }
  };

   
  
  return (
    <Layout style={{width: "100vw"}}>
     <section className="h-100 h-custom" style={{backgroundColor: "#eee"}}>
  <div className="container py-5 h-100">
    <div className="row d-flex justify-content-center align-items-center h-100">
      <div className="col">
        <div className="card">
          <div className="card-body p-4">

            <div className="row">

              <div className="col-lg-7">
                <h5>Carrito de compras</h5>
                <hr/>

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div> 
                    <p className="mb-0">Tienes {cart.length} productos en tu carrito</p>
                  </div>
                  <div className="d-flex justify-content-between">
                            <p className="mb-2">TASA DEL DOLAR:   </p>
                            <p className="mb-2"> {tasa} Bs</p>
                          </div>
                  
                </div>
                {cart.map((p, index) => (
                <div className="card mb-3">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div className="d-flex flex-row align-items-center">
                        <div>
                          <img
                            src={`/api/v1/product/product-photo/${p._id}`}
                            className="img-fluid rounded-3" alt="Shopping item" style={{width: "65px" }}/>
                        </div>
                        <div className="ms-3">
                          <h5>{p.name}</h5>
                          <p className="small mb-0">Talla: {p.size} </p>
                        </div>
                      </div>
                      <div className="d-flex flex-row align-items-center">
                        <div style={{width: "50px"}}>
                          <h5 className="fw-normal mb-0">{p.quantity}</h5>
                        </div>
                        <div style={{width: "80px"}}>
                          <h5 className="mb-0">${p.price}</h5>
                        </div>
                        <button
               className="btn btn-danger"
               onClick={() => removeCartItem(p._id)}
              >
                 X
            </button>
                      </div>
                    </div>
                  </div>
                </div>

            ))}
 
              </div>
              <div className="col-lg-5">

                <div className="card text-white rounded-3" style={{backgroundColor: "#125E8A"}}>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h4 className="mb-0">Resumen de compra</h4>
                      
                    </div>

                    <h5 className=" mb-2">{!auth?.user
                    ? "Inicia sesión" 
                   : `${auth?.token && auth?.user?.name}`}</h5>
                   

                    <hr className="my-4"/>
 
                    <div className="d-flex justify-content-between mb-4">
                      <h4 className="mb-2">Total</h4>
                      <h4 className="mb-2">{totalPrice()}</h4>
                    </div>
                    <div className="d-flex justify-content-between mb-4">
                        <p className="mb-2">Total en BS </p>
                        <p className="mb-2">BS {totalDolares()}</p>
                      </div>

                    
                      <div className="d-flex justify-content-center">
                      
                      {auth?.user  ? (
                <>
                <div className="mb-3">
                
                  {cart.length > 0 ? ( // Verificar si el carrito no está vacío
                    <button
                      className="btn btn-success"
                      onClick={() => navigate("/checkout")}
                    >
                      Checkout
                    </button>
                  ) : (
                    <button className="btn btn-success" disabled>Checkout</button> // Deshabilitar el botón cuando el carrito está vacío
                  )}
                </div>
              </>
              ) : (
                <div className="mb-3">
                  {auth?.token ? (
                    <button
                      className="btn btn-success "
                      onClick={() => navigate("/checkout")}
                    >
                      Checkout
                    </button>
                  ) : (
                   <>
                     <button
                      className="btn btn-warning mb-2"
                      onClick={() =>
                        navigate("/login", {
                          state: "/cart",
                        })
                      }
                    >
                      Inicia sesión para continuar
                    </button>
                    <br></br>
                    <button
                    className="btn btn-success"
                    onClick={() =>
                      navigate("/register", {
                        state: "/cart",
                      })
                    }
                  >
                    Registrarse para continuar
                  </button>
                   </>
                  )}
                </div>
              )}
                      </div>
                    
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</section>
    </Layout>
  );
};

export default CartPage;
