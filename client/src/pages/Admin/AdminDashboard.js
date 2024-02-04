import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "./../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import axios from "axios";
import Inventory2Icon from '@mui/icons-material/Inventory2';
import CategoryIcon from '@mui/icons-material/Category';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import OrderChart from "./OrderChart"; 
import OrderDay from "./OrderDay";
import { ProductSaleChart } from "./ProductSaleChart";
import IncomeSaleChart from "./IncomeSaleChart";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [auth] = useAuth();
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  

  useEffect(() => {
    // Obtener los totales desde el servidor
    const getTotals = async () => {
      try {
        const responseProducts = await axios.get("/api/v1/auth/total-products");
        setTotalProducts(responseProducts.data.total);

        const responseOrders = await axios.get("/api/v1/auth/total-orders");
        setTotalOrders(responseOrders.data.total);

        const responseCategories = await axios.get("/api/v1/auth/total-categories");
        setTotalCategories(responseCategories.data.total);

        const responseUsers = await axios.get("/api/v1/auth/total-users");
        setTotalUsers(responseUsers.data.total);
      } catch (error) {
        console.log(error);
      }
    };

    getTotals();
  }, []);

  return (
    <Layout>
      <div className="container-fluid   p-3 dashboard admin-panel">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9 ">
            <div className="card w-100 p-3  mt-3">
              <h2>Bienvenido, {auth?.user?.name}</h2>
               
            </div>
           
            <div className="row mt-4">
              <div className="col-md-3 mt-3">
                <Link to={"products"} style={{textDecoration: "none"}}>
                <div className="card" style={{border: "none"}}>
                  <div className="card-body bg-success">
                    <h5 className="card-title text-white">Total de Productos</h5>
                    <p className="card-text text-white">{totalProducts}</p>
                    
                    <Inventory2Icon  style={{color: "white"}}/>
                    
                  </div>
                </div>
                </Link>
              </div>
              <div className="col-md-3 mt-3">
              <Link to={"orders"} style={{textDecoration: "none"}}>
                <div className="card" style={{border: "none"}}>
                  <div className="card-body  bg-danger">
                    <h5 className="card-title text-white">Total de Órdenes</h5>
                    <p className="card-text text-white">{totalOrders}</p> 
                    <CategoryIcon style={{color: "white"}}/>
                  </div>
                </div>
                </Link>
              </div>
              <div className="col-md-3 mt-3">
              <Link to={"create-category"} style={{textDecoration: "none"}}>
                <div className="card" style={{border: "none"}}>
                  <div className="card-body  bg-warning">
                    <h5 className="card-title text-black">Total de Categorías</h5>
                    <p className="card-text text-black">{totalCategories}</p>
                    <LoyaltyIcon/>
                  </div>
                </div>
                </Link>
              </div>
              <div className="col-md-3 mt-3">
              <Link to={"users"} style={{textDecoration: "none"}}>
                <div className="card" style={{border: "none"}}>
                  <div className="card-body   bg-info  text-white">
                    <h5 className="card-title text-white">Total de Usuarios</h5>
                    <p className="card-text text-white">{totalUsers}</p>
                    <PeopleAltIcon/>
                  </div>
                </div>
                </Link>
              </div>
             
            </div>
            <div className="row mt-3 ">
              <div className="col p-3 card m-3">
                 <ProductSaleChart/>
               </div>
              <div className="col p-3 card m-3 ">
                 <IncomeSaleChart/>
              </div> 
            </div> 

            <div className="card  w-100 p-3  mt-3">
              <OrderChart/>
            </div>
            <div className="card   w-100 p-3  mt-3">
              <OrderDay/>
            </div>
            
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
