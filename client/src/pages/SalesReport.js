import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Layout from '../components/Layout/Layout';
import AdminMenu from '../components/Layout/AdminMenu';
import axios from 'axios';
import 'jspdf-autotable';
import { Table } from 'antd';

const SalesReport = () => {
  const [orders, setOrders] = useState([]);
  const [dateRange, setDateRange] = useState('today');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [monthlyOrderCounts, setMonthlyOrderCounts] = useState([]);
  const [monthlyTotalSales, setMonthlyTotalSales] = useState([]);
  const [labels, setLabels] = useState([]);
  const [dailyOrderCounts, setDailyOrderCounts] = useState([]);
  const [dailyTotalSales, setDailyTotalSales] = useState([]);
  useEffect(() => {
    fetchOrders(dateRange);
  }, []);

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };
  
  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const fetchOrders = async (dateRange) => {
    try {
      const response = await axios.get(`/api/v1/product/getFilterOrders/${dateRange}`);
       
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } 
  };

  const fetchWeeklyOrders = async () => {
    try {
      const response = await axios.get('/api/v1/auth/order-daily');
      const orders = response.data;
      setOrders(response.data);
      // Restablecer los datos diarios
      const dailyOrderCounts = new Array(7).fill(0);
      const dailyTotalSales = new Array(7).fill(0);
  
      orders.forEach(order => {
        const dayIndex = new Date(order.createdAt).getDay();
        dailyOrderCounts[dayIndex]++;
        dailyTotalSales[dayIndex] += order.total;
      });
  
      setDailyOrderCounts(dailyOrderCounts); // Make sure to create a new array to trigger re-render
    setDailyTotalSales(dailyTotalSales); // Make sure to create a new array to trigger re-render
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Importar y usar la función getFilteredOrders
  const getFilteredOrders = async (range) => {
    try {
      console.log(range)
      const response = await axios.get('/api/v1/auth/order-daily');
       
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching filtered orders:', error);
      throw error;
    }
  };
   
  const fetchMonthlyOrders = async () => {
    try {
      const response = await axios.get('/api/v1/product/getFilterOrders/thisYear');
      const orders = response.data;
  
      // Procesar los datos para obtener ventas mensuales
      const monthlySalesData = new Array(12).fill(0);
      const monthlyOrderCounts = new Array(12).fill(0);
      const monthlyTotalSales = new Array(12).fill(0);
  
      orders.forEach(order => {
        const monthIndex = new Date(order.createdAt).getMonth();
        monthlySalesData[monthIndex] += order.total;
        monthlyOrderCounts[monthIndex]++;
        monthlyTotalSales[monthIndex] += order.total;
      });
  
      const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ];
 
      setOrders(orders)
      setLabels(monthNames);
      setMonthlyOrderCounts(monthlyOrderCounts);
      setMonthlyTotalSales(monthlyTotalSales);
      
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const generateSalesReport = async () => {
    try {
      let filteredOrders = [];
  
      if (dateRange === 'custom') {
        console.log("custom");
        //const {data} = await getFilteredOrders(dateRange, startDate, endDate);
      } else {
        const response = await axios.get(`/api/v1/product/getFilterOrders/${dateRange}`);
        filteredOrders = response.data;
        console.log(filteredOrders = response.data)
      }
  
      
      const doc = new jsPDF();
      doc.text('Reporte de Ventas', 10, 10);
  
      const tableData = [];
      let totalSales = 0;
      let totalOrders = 0;
  
      filteredOrders.forEach(order => {
        const rowData = [
          order._id,
          order.buyer.name,
          new Date(order.createdAt).toLocaleDateString(),
          `$${order.total.toFixed(2)}` // Formatear el total como moneda
        ];
        tableData.push(rowData);
        totalSales += order.total;
        totalOrders += 1;
      });
  
      // Agregar encabezados de columnas
      const headers = [['ID Orden','Comprador', 'Fecha', 'Total']];
      doc.autoTable({
        startY: 20,
        head: headers,
        body: tableData,
        theme: 'grid'
      });
  
      // Agregar fila con el total de ventas
      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 10,
        body: [['Total de Ventas', '', `$${totalSales.toFixed(2)}`]],
        theme: 'grid',
        tableWidth: 'auto'
      });

       // Generar la tabla de órdenes por mes
    if (dateRange === "thisYear") {
      doc.addPage();
      doc.text('Órdenes por Mes', 10, 10);

      const monthlyTableData = [];
      labels.forEach((month, index) => {
        const rowData = [
          month,
          monthlyOrderCounts[index],
          `$${monthlyTotalSales[index].toFixed(2)}`
        ];
        monthlyTableData.push(rowData);
      });

      const monthlyTableHeaders = [['Mes', 'Cantidad de Órdenes', 'Total de Ordenes']];
      doc.autoTable({
        startY: 20,
        head: monthlyTableHeaders,
        body: monthlyTableData,
        theme: 'grid'
      });
    }

    if (dateRange === "thisWeek") {
      // Agregar una tabla de órdenes por día de la semana
      doc.addPage();
      doc.text('Órdenes por Día de la Semana', 10, 10);
    
      const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    
      const weeklyTableData = daysOfWeek.map((day, index) => ([
        day,
        dailyOrderCounts[index], dailyTotalSales[index] !== undefined ? `$${dailyTotalSales[index].toFixed(2)}` : '$0.00'
      ]));
    
      const weeklyTableHeaders = [['Día', 'Cantidad de Órdenes', 'Total de Ordenes']];
    
      doc.autoTable({
        startY: 20,
        head: weeklyTableHeaders,
        body: weeklyTableData,
        theme: 'grid'
      });

      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 10,
        body: [
          ['Total de Ordenes', `$${totalOrders.toString()}`],
          ['Monto de Órdenes', totalSales.toFixed(2)],  // Agregar esta línea para mostrar el total de órdenes
       
        ],
        theme: 'grid',
        tableWidth: 'auto'
      });
    }


  
      // Guardar el PDF y descargar
      const pdfFileName = 'reporte_ventas.pdf';
      doc.save(pdfFileName);
  
    } catch (error) {
      console.error('Error generating sales report:', error);
    }
  };
  
  const handleDateRangeChange = (e) => {
    const selectedDateRange = e.target.value;
    setDateRange(selectedDateRange);
    if (selectedDateRange === 'thisYear') {
      // Llamar a la función para obtener órdenes por mes
      fetchMonthlyOrders();
    } else if (selectedDateRange === 'thisWeek') {
      // Llamar a la función para obtener órdenes por día
      fetchWeeklyOrders();
    } else {
      fetchOrders(selectedDateRange);
    }
  };

  const handleGenerateReport = async () => {
    if (dateRange === 'custom') {
      if (!startDate || !endDate) {
        console.error('Debe seleccionar ambas fechas');
        return;
      }
    }
  
    // Llamar a la función para generar el reporte
    generateSalesReport();
  }

  const columns = [
   
    {
      title: 'ID Orden',
      dataIndex: '_id',
    },
    {
      title: 'Fecha',
      dataIndex: 'createdAt',
    },
    {
      title: 'Total',
      dataIndex: 'total',
    },
   
  ];

    return (
      <Layout title="Reportes de ordenes">
      <div className='container-fluid p-3 dashboard '>
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
         
          <div className="col-md-9 ">
          <h1 className='mt-4 mb-4'>Reporte de órdenes</h1>
            <div>
            <div style={{display: "flex", justifyContent: "center"}}>
            <select
                value={dateRange}
                onChange={handleDateRangeChange}
                className="form-select m-1"
              >
               
                <option value="today">Hoy</option>
                <option value="yesterday">Ayer</option>
                <option value="thisWeek">Esta semana</option> 
                <option value="thisMonth">Este mes</option>
                <option value="thisYear">Este año</option>
                {/* ... otras opciones ... */}
              </select>
              
              <button className='btn btn-success btn-sm' onClick={handleGenerateReport}>Generar Reporte</button>
            </div>
             
              <div>
             
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
        {dateRange === 'thisYear' && (
  <div>
    <h2>Totales de Órdenes por Mes</h2>
    <Table
      columns={[
        { title: 'Mes', dataIndex: 'month' },
        { title: 'Cantidad de Órdenes', dataIndex: 'orderCount' },
        { title: 'Total de Ventas', dataIndex: 'totalSales' }
      ]}
      dataSource={labels.map((month, index) => ({
        key: month,
        month,
        orderCount: monthlyOrderCounts[index],
        totalSales: `$${monthlyTotalSales[index].toFixed(2)}`
      }))}
      pagination={false}
    />
  </div>
)}
{dateRange === 'thisWeek' && (
  <div>
    <h2>Totales de Órdenes por Día</h2>
    <Table
      columns={[
        { title: 'Día', dataIndex: 'day' },
        { title: 'Cantidad de Órdenes', dataIndex: 'orderCount' },
        { title: 'Total de Ventas', dataIndex: 'totalSales' }
      ]}
      dataSource={[
        {key: '1', day: 'Lunes', orderCount: dailyOrderCounts[1], totalSales: dailyTotalSales[1] !== undefined ? `$${dailyTotalSales[1].toFixed(2)}` : '' },
        {key: '2', day: 'Martes', orderCount: dailyOrderCounts[2], totalSales: dailyTotalSales[2] !== undefined ? `$${dailyTotalSales[2].toFixed(2)}` : '' },
        {key: '3', day: 'Miércoles', orderCount: dailyOrderCounts[3], totalSales: dailyTotalSales[3] !== undefined ? `$${dailyTotalSales[3].toFixed(2)}` : '' },
        {key: '4', day: 'Jueves', orderCount: dailyOrderCounts[4], totalSales: dailyTotalSales[4] !== undefined ? `$${dailyTotalSales[4].toFixed(2)}` : '' },
        {key: '5', day: 'Viernes', orderCount: dailyOrderCounts[5], totalSales: dailyTotalSales[5] !== undefined ? `$${dailyTotalSales[5].toFixed(2)}` : '' },
        {key: '6', day: 'Sábado', orderCount: dailyOrderCounts[6], totalSales: dailyTotalSales[6] !== undefined ? `$${dailyTotalSales[6].toFixed(2)}` : '' },
        {key: '7', day: 'Domingo', orderCount: dailyOrderCounts[0], totalSales: dailyTotalSales[0] !== undefined ? `$${dailyTotalSales[0].toFixed(2)}` : '' },
      ]}
      pagination={false}
    />
  </div>
)}
 
        </div>
        </div>
      </div>
    </Layout>
    );
}

export default SalesReport;