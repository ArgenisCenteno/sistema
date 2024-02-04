import React from "react";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import { useAuth } from "../../context/auth";
const Dashboard = () => {
  const [auth] = useAuth();
  return (
    <Layout title={"Dashboard - Cliente"}>
      <div className="container-flui p-3 dashboard " style={{marginBottom: "18rem"}}>
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <div className="card w-75 p-3">
            <h5>Usuario:</h5>
              <p>{auth?.user?.name}</p>
              <h5>Email:</h5>
              <p>{auth?.user?.email}</p>
              <h5>Telefono:</h5>
              <p>{auth?.user?.phone}</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
