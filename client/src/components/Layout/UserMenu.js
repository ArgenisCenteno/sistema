import React from "react";
import { NavLink } from "react-router-dom";
const UserMenu = () => {
  return (
    <div>
      <div className="text-center dashboard-menu">
        <div className="list-group">
          <h4 className="bg-success">Panel de Administración</h4>
          
          <NavLink
            to="/dashboard/user/profile"
            className="list-group-item list-group-item-action"
          >
            Perfil
          </NavLink>
          <NavLink
            to="/dashboard/user/orders"
            className="list-group-item list-group-item-action "
          >
            Ordenes
          </NavLink>
          <NavLink
            to="/dashboard/user/password"
            className="list-group-item list-group-item-action "
          >
            Actualizar clave
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default UserMenu;
