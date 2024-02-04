import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/cart"; 
import "../styles/ProductDetails.css" 
const ProductDetails = () => {
  const [cart, setCart] = useCart();
  const params = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [inputFocused, setInputFocused] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState(null);

  const handleInputFocus = () => {
    setInputFocused(true);
  };

  const handleInputBlur = () => {
    setInputFocused(false);
  };

    // Obtener el producto por slug
    const getProduct = async () => {
      try {
        const { data } = await axios.get(
          `/api/v1/product/get-product/${params.slug}`
        );
        setProduct(data?.product);
        getSimilarProduct(data?.product._id, data?.product.category._id);
      } catch (error) {
        console.log(error);
      }
    };
  

  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params?.slug]);


  // Obtener productos similares
  const getSimilarProduct = async (productId, categoryId) => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/related-product/${productId}/${categoryId}`
      );
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  // Manejar el cambio de talla
  const handleSizeChange = (e) => {
    const selectedSize = e.target.value;
    setSelectedSize(selectedSize);

    // Buscar el precio correspondiente a la talla seleccionada
  const variation = product.variations.find(
    (variation) => variation.size === selectedSize
  );

  if (variation) {
    setSelectedVariation(variation); // Almacenar la variación seleccionada
    setSelectedPrice(variation.price);
    setSelectedQuantity(1); // Restablecer la cantidad seleccionada a 1 al cambiar de talla
  } else {
    setSelectedPrice(0);
    setSelectedQuantity(0);
  }
  };

  // Agregar producto al carrito
  const handleAddToCart = () => {
    // Buscar la variación seleccionada
    const selectedVariation = product.variations.find(
      (variation) => variation.size === selectedSize
    );

    if(!selectedVariation){
      toast.error("Seleccione una talla");
      return;
    }

    // Verificar si la variación existe y si la cantidad seleccionada es mayor que la cantidad disponible
    if ( selectedQuantity > selectedVariation.quantity) {
      toast.error("No esta disponible esta cantidad en este momento");
      return;
    }

    const productData = {
      _id: product._id,
      name: product.name,
      description: product.description,
      price: selectedPrice,
      category: product.category,
      size: selectedSize,
      quantity: selectedQuantity, 
    };

    setCart([...cart, productData]);
    localStorage.setItem("cart", JSON.stringify([...cart, productData]));
    toast.success("Agregado al carrito");
  };

  return (
    <Layout>
      <div className="row container  product-details d-flex justify-content-center align-items-center">
      <div className="col-md-4 col-sm-4">
        {product._id ? (
            <img
              src={`/api/v1/product/product-photo/${product._id}`}
               className="card-img-top product-image"
              
               alt={product.name}
               
               
            />
            ) : (
           <p>Imagen no disponible</p>
            )}
 
        </div>
        <div className="col-md-6 m-2  product-details-info">
          <h1 className="text-left "style={{color: "#125E8A" }} >{product.name}</h1>
          
          <h5> <strong> Detalles del producto </strong> </h5>
          <h6> <strong>Nombre:</strong> {product.name}</h6>
          <h6><strong>Descripción:</strong> {product.description}</h6>
          {product.quantity === 0 || product.quantity < 0  && <p className="unavailable-label">No disponible</p>}
          <h6><strong>Categoría:</strong> {product?.category?.name}</h6>
          <div className="size-quantity">
            <div className="row container d-flex justify-content-left pb-3">
              <div className="col-2 col-sm-2">
                <h6><strong>Talla:</strong></h6>
              </div>

              <div className="col-6 col-sm-4">
                <select className="form-select selectSize " value={selectedSize} onChange={handleSizeChange}>
                  <option className="option" value="">Talla:</option>
                  {product?.variations?.map((variation) => (
                    <option key={variation.size} value={variation.size}>
                      {variation.size}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedSize && (
              <>
                {product?.variations?.map((variation) => {
                  if (variation.size === selectedSize) {
                    const selectedVariation = variation;
                    return (
                      <React.Fragment key={variation.size}>
                        <h6><strong>Precio:</strong> {selectedVariation.price.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}</h6>
                        <h6><strong>Disponible:</strong> {selectedVariation.quantity}</h6>
                      </React.Fragment>
                    );
                  }
                  return null;
                })}
              </>
            )}
      
<div className="row container d-flex justify-content-left pb-3">
  <div className="col-4 col-sm-2">
    <h6> <strong>Cantidad:</strong></h6>
  </div>
  <div className="col-6 col-sm-5 d-flex align-items-center">
    <button
      className="btn  btn-outline-danger"
      onClick={() => setSelectedQuantity((prev) => Math.max(prev - 1, 1))}
    >
      -
    </button>
    <input
      className="form-control inputQuantity mx-2"
      type="number"
      min={1}
      value={selectedQuantity}
      onChange={(e) => setSelectedQuantity(Number(e.target.value))}
    />
   <button
  className="btn  btn-outline-primary"
  onClick={() =>
    setSelectedQuantity((prev) =>
      Math.min(prev + 1, selectedVariation?.quantity || 1)
    )
  }
>
  +
</button>
  </div>
</div>
          </div>

          <button
            className="btn text-white ms-1 "
            disabled={product.quantity === 0}
            onClick={handleAddToCart}
            style={{backgroundColor: "#125E8A" }} 
          >
            Agregar al carrito
          </button>
        </div>
        
      </div>
      <hr />
      <div className="row container similar-products">
        <h4>Productos similares</h4>
        {relatedProducts.length < 1 && (
          <p className="text-center">No se encontraron productos similares</p>
        )}
        <div className="d-flex flex-wrap">
          {relatedProducts?.map((p) => (
            <div className="card m-2" key={p._id}>
              <img
                src={`/api/v1/product/product-photo/${p._id}`}
                className="card-img-top"
                alt={p.name}
              />
              <div className="card-body">
                <div className="card-name-price">
                  <h5 className="card-title">{p.name}</h5>
                </div>
                <p className="card-text">{p.description.substring(0, 60)}...</p>
                <div className="card-name-price">
                  <button
                    className="btn btn-info ms-1 verDetalles"
                    onClick={() => navigate(`/product/${p.slug}`)}
                  >
                    Ver más
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
