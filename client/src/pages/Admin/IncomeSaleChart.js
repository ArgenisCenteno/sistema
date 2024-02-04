import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import axios from 'axios';


  
const IncomeSaleChart = () => {
 
    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend
      );
    
      const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Grafica de ingresos mensuales',
          },
        },
      };
    
      const [orderData, setOrderData] = useState([]);
      const [labels, setLabels] = useState([]);
      const [monthlySales, setMonthlySales] = useState([]);
      const [totalSales, setTotalSales] = useState([]);
    
    
      useEffect(() => {
        const fetchData = async () => {
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
    
            setLabels(monthNames);
            setMonthlySales(monthlyOrderCounts);
            setTotalSales(monthlyTotalSales);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData();
      }, []);
    
      const datasets = [
        {
          label: 'Ingresos Mensuales',
          data: totalSales,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
       
      ];
    
      const data = {
        labels,
        datasets,
      };
  
      return (
        <div>
          <h4>Ingresos Mensuales</h4>
          <Line options={options} data={data} />
        </div>
      );
    };
    
 
export default IncomeSaleChart