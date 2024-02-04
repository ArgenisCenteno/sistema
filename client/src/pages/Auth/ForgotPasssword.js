import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../../styles/AuthStyles.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isButtonDisabled, setButtonDisabled] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('auth');
    if (isAuthenticated) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    if (remainingTime > 0 && isButtonDisabled) {
      const timer = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    } else if (remainingTime === 0 && isButtonDisabled) {
      setButtonDisabled(false);
    }
  }, [remainingTime, isButtonDisabled]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setButtonDisabled(true);
      setRemainingTime(45); // Iniciar el contador de 45 segundos
      const res = await axios.post("/api/v1/auth/forgot-password", {
        email
      });
      if (res && res.data.success) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Email inválido");
    }
  };

  return (
    <Layout title={"Cambiar clave"}>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <h4 className="title">Cambiar clave</h4>
          <div className="mb-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Ingresa tu email"
              required
            />
          </div>
          <button type="submit" className="btn btn-success" disabled={isButtonDisabled}>
            {isButtonDisabled ? `Enviado (${remainingTime}s)` : "Enviar email"}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default ForgotPassword;