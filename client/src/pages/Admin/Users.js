import React, { useState, useEffect } from "react";
import { Table, Input, Button, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  useEffect(() => {
    // Obtener los usuarios del servidor
    const getUsers = async () => {
      try {
        const response = await axios.get("/api/v1/auth/all-users");
        setUsers(response.data.users);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    getUsers();
  }, []);

  
  // Función para configurar el filtro de búsqueda para cada columna
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Buscar ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Buscar
          </Button>
          <Button
            onClick={() => handleReset(clearFilters, dataIndex)}
            size="small"
            style={{ width: 90 }}
          >
            Limpiar
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
  });

  // Función para manejar la búsqueda
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  // Función para limpiar el filtro de búsqueda
  const handleReset = (clearFilters, dataIndex) => {
    clearFilters();
    setSearchText("");
  };

    // Columnas de la tabla
  const columns = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
      // Configuración del filtro de búsqueda
      ...getColumnSearchProps("name"),
    },
    {
      title: "Correo electrónico",
      dataIndex: "email",
      key: "email",
      // Configuración del filtro de búsqueda
      ...getColumnSearchProps("email"),
    },
    {
      title: "Teléfono",
      dataIndex: "phone",
      key: "phone",
      // Configuración del filtro de búsqueda
      ...getColumnSearchProps("phone"),
    },
    {
      title: "Dirección",
      dataIndex: "address",
      key: "address",
      // Configuración del filtro de búsqueda
      ...getColumnSearchProps("address"),
    },
    {
      title: "Rol",
      dataIndex: "role",
      key: "role",
      render: (role) => <span>{role === 0 ? "Cliente" : "Administrador"}</span>,
    },
  ];

  return (
    <Layout title={"Dashboard - Usuarios"}>
      <div className="container-fluid p-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1 className="mt-4 mb-4">Usuarios</h1>
            <Table
              columns={columns}
              dataSource={users}
              loading={loading}
              rowKey="_id"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Users;
