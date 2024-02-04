import React, { useState, useEffect} from 'react';
import { Table, Select, Button  } from 'antd';
import { useNavigate } from "react-router-dom";
import AdminMenu from '../../components/Layout/AdminMenu';
import Layout from './../../components/Layout/Layout';
import axios from 'axios';
import toast from 'react-hot-toast';
 
import moment from 'moment';
import { Input} from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

const AdminOrders = () => {

  const navigate = useNavigate();
  const [status, setStatus] = useState([
    'No procesada',
    'Procesada',
    'Enviada',
    'Recibida',
    'Cancelada',
  ]);
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [searchText, setSearchText] = useState({
    client: '',
    orderId: '',
    email: '',
  })
  // Obtener las órdenes del servidor
  const getOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/v1/auth/all-orders'); // Realizar una solicitud GET para obtener las órdenes desde la ruta "/api/v1/auth/all-orders"
      setOrders(data); // Establecer las órdenes obtenidas en el estado "orders"
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error('Ocurrió un error al obtener las órdenes');
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders(); // Llamar a la función para obtener las órdenes al cargar el componente
  }, []);

  // Manejar el cambio de estado de una orden
  const handleChange = async (orderId, value) => {
    try {
      setLoading(true);
      await axios.put(`/api/v1/auth/order-status/${orderId}`, {
        status: value,
      }); // Realizar una solicitud PUT para actualizar el estado de la orden utilizando la ruta "/api/v1/auth/order-status/:orderId"
      getOrders(); // Volver a obtener las órdenes actualizadas después de cambiar el estado
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleSearch = (selectedKeys, dataIndex, confirm) => {
    confirm();
    setSearchText((prevSearchText) => ({
      ...prevSearchText,
      [dataIndex]: selectedKeys[0],
    }));
  };
  
  const handleReset = (clearFilters, dataIndex) => {
    clearFilters();
   navigate("/dashboard/admin/orders")
  };
 
  // Columnas de la tabla
  const columns = [
    {
      title: 'ID de Orden',
      dataIndex: '_id',
      key: 'orderId',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Buscar ID de Orden"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() =>
              handleSearch(selectedKeys, 'orderId', confirm)
            }
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, 'orderId', confirm)}
            icon={<SearchOutlined />}
            size="small"
            style={{ marginRight: 8 }}
          >
            Buscar
          </Button>
          <Button onClick={() => handleReset(clearFilters, 'orderId')} size="small">
            Limpiar
          </Button>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (value, record) =>
        record._id.toLowerCase().includes(value.toLowerCase()), // Filtrar por el ID de Orden
    },
    {
      title: 'Cliente',
      dataIndex: 'buyer',
      key: 'buyer',
      render: (buyer) => <span>{buyer?.name}</span>,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Buscar cliente"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() =>
              handleSearch(selectedKeys, 'client', confirm)
            }
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, 'client', confirm)}
            icon={<SearchOutlined />}
            size="small"
            style={{ marginRight: 8 }}
          >
            Buscar
          </Button>
          <Button onClick={() => handleReset(clearFilters, 'client')} size="small">
            Limpiar
          </Button>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (value, record) =>
        record.buyer?.name.toLowerCase().includes(value.toLowerCase()), // Filtrar por el nombre del cliente
    },
    {
      title: 'Correo',
      dataIndex: 'buyer',
      key: 'email',
      render: (buyer) => <span>{buyer?.email}</span>,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Buscar correo"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() =>
              handleSearch(selectedKeys, 'buyer.email', confirm) 
            }
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, 'buyer.email', confirm)} 
            icon={<SearchOutlined />}
            size="small"
            style={{ marginRight: 8 }}
          >
            Buscar
          </Button>
          <Button onClick={() => handleReset(clearFilters, 'buyer.email')} size="small">  
            Limpiar
          </Button>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (value, record) =>
        record.buyer?.email.toLowerCase().includes(value.toLowerCase()), // Filtrar por el correo del cliente
    },
    {
      title: 'Fecha',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt) => (
        <span>{moment(createdAt).format('YYYY-MM-DD HH:mm:ss')}</span> // Formatear y renderizar la fecha de creación de la orden
      ),
    },
    {
      title: 'Estado de pago',
      dataIndex: 'isPaid',
      key: 'isPaid',
      render: (isPaid) => <span>{isPaid ? 'Pagada' : 'Sin pagar'}</span>,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Select
            style={{ width: 120 }}
            value={selectedKeys[0]}
            onChange={(value) => setSelectedKeys([value])}
          >
            <Option value="">Todos</Option>
            <Option value="true">Pagada</Option>
            <Option value="false">Sin pagar</Option>
          </Select>
          <Button
            type="primary"
            onClick={() => {
              confirm();
            }}
            size="small"
            style={{ marginRight: 8 }}
          >
            Filtrar
          </Button>
          <Button onClick={clearFilters} size="small">
            Limpiar
          </Button>
        </div>
      ),
      onFilter: (value, record) => {
        if (value === 'true') {
          return record.isPaid;
        } else if (value === 'false') {
          return !record.isPaid;
        }
        return true;
      },
      // ...otras propiedades...
    },
    
    {
      title: 'Cambiar Estado',
      key: 'changeStatus',
      render: (text, record) => (
        <Select
          defaultValue={record.status}
          style={{ width: 120 }}
          className='status-select'
          onChange={(value) => handleChange(record._id, value)}
        >
          {status.map((s) => (
            <Option key={s} value={s}>
              {s}
            </Option>
          ))}
        </Select>
      ), // Renderizar un select para cambiar el estado de la orden
    },
    {
      title: 'Detalles',
      key: 'orderDetails',
      render: (text, record) => (
        <a href={ `/dashboard/admin/order/${record?._id} `}>Aqui</a>
      ),  
    },
  ];

  return (
    <Layout title={"Dashboard - Ordenes"}>
      <div className="row container-fluid  p-3 dashboard">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9">
          <h1 className='mt-4  mb-4'>Todas las órdenes</h1>
          <Table
            columns={columns}
            rowKey={(record) => record._id}
            dataSource={orders} 
            pagination={{
              
              pageSize: 10, // Cantidad de filas por página
              showSizeChanger: true, // Opción para cambiar la cantidad de filas por página
              pageSizeOptions: ['10', '20', '50'], // Opciones para seleccionar la cantidad de filas por página
            }}
            loading={loading}
          />
        </div>
      </div>
       
    </Layout>
  );
};

export default AdminOrders;
