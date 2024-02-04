import React, { useEffect, useState } from 'react'
import Layout from "./../components/Layout/Layout"; 
import { Link, useParams } from 'react-router-dom';
import axios from "axios";  

const Gender = () => {
  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(false);

  const params = useParams();
  
  useEffect(() => {
    if (params?.name) {
      setLoading(true);
      getProductsByCat();
    }
  }, [params?.name]);

  // Obtener productos por categoría
  const getProductsByCat = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/product-gender/${params.name}`
      );

      setProducts(data);
     
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false); 
    }
  };


  return (
    <Layout>
       <div className="container mb-6 category titleGenderCategory">
       {loading ? (
          <div className="text-center mt-4">
            <h4>Cargando productos...</h4>
          </div>
        ) : (
          <>
            <h4 className="text-center mt-4 " style={{color: "#125E8A"}}>
              Ropa para {params?.name}
            </h4>
            <h6 className="text-center " style={{color: "#125E8A"}}>
              {products?.length} {products?.length === 1 ? "resultado" : "resultados"} 
            </h6>
          </>
        )}
       
      <div className="row gender">
    
          <div className="col-md-12 offset-1">
            <div className="d-flex flex-wrap justify-content-center">
             
              {products?.map((p, index) => (
                <Link to={`/product/${p.slug}`} key={index} style={{textDecoration: "none"}}>
                <div className="card m-2" >
                  <img
                    src={`/api/v1/product/product-photo/${p._id}`}
                    className="card-img-top"
                    alt={p.name}
                  />
                  <div className="card-body">
                    <div className="card-name-price">
                      <h5  style={{color: "#125E8A"}}>{p.name}</h5>
                    </div>
                    <p className="card-text ">{p.description.substring(0, 60)}</p>
                    <p className="card-text">
                      <strong>Tallas:</strong> {p.variations.map((e) => e.size).join(" | ")}
                    </p>
                     
                  </div>
                </div>
                </Link>
                
              ))}
            </div>
              </div>
              </div>
      </div>
   </Layout> 
  )
}

export default Gender