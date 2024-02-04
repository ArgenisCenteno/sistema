import React, { useState, useEffect } from "react";
import {  Link } from "react-router-dom"; 
import axios from "axios"; 
import Layout from "./../components/Layout/Layout";  
import "../styles/Homepage.css";
import Slider from "../components/Layout/Slider";
import { sliderItems } from '../components/Layout/data/data.js'; 
 

const HomePage = () => { 
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); 
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [foundProducts, setFoundProducts] = useState(true);   

  // OBTENER TODAS LAS CATEGORIAS
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // OBTENER PRODUCTOS
  const getAllProducts = async (page = 1) => {
    try {
      setLoading(true);
      const {data}  = await axios.get(`/api/v1/product/product-sales`);
      console.log(data)
      setLoading(false);
      setProducts(data);
      setFoundProducts(data.length > 0);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  
  

   

  // OBTENER NUMERO TOTAL DE PRODUCTOS
  const getTotal = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/product-count");
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };
  

  useEffect(() => {
    getAllCategory();
    getTotal();
    getAllProducts()
  }, []); // Asegúrate de agregar currentPage como dependencia aquí

    
   
  return (
    <>
      <Layout title={"Blanca Sánchez"} > 
        <Slider slides={sliderItems} /> 
       
        <div className="container"  >
        <div className="row container justify-content-center" >
          <h2 style={{color: "#125E8A", textAlign: "center", marginTop: "54px"}}>Categorías de productos</h2>
          {categories.map((c, index) => (
            <div className="col-md-3 mt-5 mb-3" key={index}>
              <div className="card category-card " >
                <Link to={`/category/${c.slug}`}  className="btn btn-outline-primary " style={{paddingBottom: "20px", paddingTop: "20px", fontSize: "18px"}}>
                  {c.name}
                </Link>
              </div>
            </div>
          ))}
        </div>
        <section >
      <div  style={{color: "#125E8A", textAlign: "center", marginTop: "54px"}}>
           <h2>Lo más vendido</h2>
      </div>
   

        <div className="row" style={{marginBottom: "53px"}}>
          <div className="col-md-12 offset-1" > 
                <div className="d-flex flex-wrap justify-content-center">
                 {products?.map((p, index) => (
                <Link to={`/product/${p.slug}`} key={index} style={{textDecoration: "none"}}>
                <div className="card m-2 text-left  text-muted" style={{ width: "18rem" }} >

                  <img
                    src={`/api/v1/product/product-photo/${p._id}`}
                    className="card-img-top"
                    alt={p.name}
                  />
                  <div className="mask">
                <div className="d-flex justify-content-start align-items-end h-100">
                  <h5><span className="badge bg-success ms-2">TOP</span></h5>
                </div>
              </div>
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

          {/* Repeat the same structure for the other product cards */}
       

        {/* Repeat the same structure for the second row */}
      </div>
    </section>
      </div>
      </Layout>
    </>
  );
};

export default HomePage;