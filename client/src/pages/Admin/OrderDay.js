import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

const OrderDay = () => {
  const [orderData, setOrderData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/v1/auth/order-daily');

        // Verifica si response.data contiene la información necesaria
        if (response.data && Array.isArray(response.data)) {
          setOrderData(response.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Procesa los datos para obtener las órdenes por día de la semana
  const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const orderCountsByDay = [0, 0, 0, 0, 0, 0, 0]; // Inicializa el contador para cada día de la semana

  orderData.forEach(order => {
    const createdAt = new Date(order.createdAt);
    const dayIndex = createdAt.getDay(); // Obtiene el índice del día de la semana (0 = Domingo, 1 = Lunes, ...)
    orderCountsByDay[dayIndex] += 1; // Incrementa el contador para el día correspondiente
  });

  const chartData = {
    labels: daysOfWeek,
    datasets: [
      {
        label: 'Órdenes Diarias',
        data: orderCountsByDay,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        stepSize: 1,
      },
    },
  };

  return (
    <div>
      <h2>Órdenes por Día de la Semana</h2>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default OrderDay;
