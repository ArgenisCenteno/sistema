import React, { useState, useEffect } from "react";
import UserMenu from "../../components/Layout/UserMenu";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import { useAuth } from "../../context/auth";
import moment from "moment";
import { Table, Button } from "antd";
const { Column } = Table;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [auth, setAuth] = useAuth();
  
  

  // Obtener las órdenes del usuario autenticado
  const getOrders = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/orders");
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  
  return (
    <Layout title={"Historial de órdenes"}>
      <div className="container-fluid p-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <h1 className="text-center mt-4 mb-4">Historial de órdenes</h1>
            <Table dataSource={orders} rowKey="_id" pagination={true}>
              <Column title="#" dataIndex="_id" key="id" render={(text, record, index) => index + 1} />
              <Column title="Estado" dataIndex="status" key="status" />
              <Column
                title="Fecha"
                dataIndex="createdAt"
                key="createdAt"
                render={(createdAt) => moment(createdAt).format('YYYY-MM-DD HH:mm:ss')} 
              />
              <Column
                title="Estado de pago"
                dataIndex="isPaid"
                key="isPaid"
                render={(success) => (success ? "Pagada" : "Sin pagar")}
              />
              <Column
                title="Monto total"
                dataIndex="total"
                key="total"
              />
              
              <Column
                title="Ver"
                key="ver"
                render={(text, record) => (
                  <Button type="link" href={`/dashboard/user/order/${record._id}`}>
                    Aqui
                  </Button>
                )}
              />
            </Table>
          </div>
        </div>
      </div>

      
    </Layout>
  );
};

export default Orders;
