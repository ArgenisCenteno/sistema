import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import AdminMenu from '../../components/Layout/AdminMenu';
import Layout from './../../components/Layout/Layout';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
 
  // Obtener todos los productos
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/v1/product/get-product', {
        params: {
          page: pagination.current,
          limit: pagination.pageSize,
        },
      });
      setProducts(data.products);
      setPagination(prevPagination => ({
        ...prevPagination,
        total: data.counTotal,
      }));
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error('Ocurrió un error al traer los productos');
      setLoading(false);
    }
  };

  // Ciclo de vida
  useEffect(() => {
    getAllProducts();
  }, [pagination.current, pagination.pageSize]);

  // Manejar cambios en la tabla de paginación y orden
  const handleTableChange = (pagination, filters, sorter) => {
    setPagination(pagination);
  };

  // Definir las columnas de la tabla
  const columns = [
    {
      title: 'Imagen',
      dataIndex: 'image',
      render: (image, record) => (
        <img src={`/api/v1/product/product-photo/${record._id}`} height="333px" className="card-img-top-dashboard" alt={record.name} />
      ),
    },
    {
      title: 'Nombre',
      dataIndex: 'name',
    },
    {
      title: 'Genero',
      dataIndex: 'gender',
    },
    {
      title: 'Ventas',
      dataIndex: 'sale',
    },
    {
      title: 'Acciones',
      dataIndex: '_id',
      render: (_id, record) => (
        <Link to={`/dashboard/admin/product/${record.slug}`} className="product-link">
          <button className="btn btn-success">Ver</button>
        </Link>
      ),
    },
  ];

  return (
    <Layout>
      <div className="row container-fluid   p-3 dashboard">
        <div className="col-md-3">
          <AdminMenu />
        </div>

        <div className="col-md-8">
          <h1 className='mt-4 mb-4'>Todos los productos</h1>
          <Table
            columns={columns}
            rowKey={(record) => record._id}
            dataSource={products}
            pagination={pagination}
            loading={loading}
            onChange={handleTableChange}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Products;
