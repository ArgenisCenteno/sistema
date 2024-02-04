import React from "react";
import { NavLink } from "react-router-dom";
const AdminMenu = () => {
  return (
    <>
      <div className="text-center">
        <div className="list-group dashboard-menu">
        
          <h5 className=" text-white p-4" style={{backgroundColor: "#125E8A  "}}>Panel de administración</h5>
          <NavLink
            to="/dashboard/admin"
            className="list-group-item list-group-item-action"
          >
            Inicio
          </NavLink>
          <NavLink
            to="/dashboard/admin/create-category"
            className="list-group-item list-group-item-action"
          >
            Crear categoría
          </NavLink>
          <NavLink
            to="/dashboard/admin/create-product"
            className="list-group-item list-group-item-action"
          >
            Crear producto
          </NavLink>
          <NavLink
            to="/dashboard/admin/products"
            className="list-group-item list-group-item-action"
          >
            Productos
          </NavLink>
          <NavLink
            to="/dashboard/admin/orders"
            className="list-group-item list-group-item-action"
          >
            Ordenes
          </NavLink>
        <NavLink
            to="/dashboard/admin/users"
            className="list-group-item list-group-item-action"
          >
            Usuarios
          </NavLink> 
          <NavLink 
            to="/dashboard/admin/sales-report"
            className="list-group-item list-group-item-action"
          >
            Reporte de ordenes
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default AdminMenu;
