import React, { useState } from "react";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "../../styles/AuthStyles.css";
import login from "./img/login.png";
import { useAuth } from "../../context/auth";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import iniciar from "../Auth/img/iniciar.webp"

const Login = () => {
  const [shown, setShown] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useAuth();
  const [emailError, setEmailError] = useState("");
  const switchShown = () => setShown(!shown);
  const onChange = ({ currentTarget }) => setPassword(currentTarget.value);
  const navigate = useNavigate();
  const location = useLocation();

  // FUNCIÓN DEL FORMULARIO
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setEmailError("Ingrese un email válido");
      return;
    } else {
      setEmailError("");
    }

    try {
      const res = await axios.post("/api/v1/auth/login", {
        email,
        password,
      });
      if (res && res.data.success) {
        setAuth({
          ...auth,
          user: res.data.user,
          token: res.data.token,
        });
        localStorage.setItem("auth", JSON.stringify(res.data));
        navigate(location.state || "/");
      } else {
        setEmailError(res.data.message);
      }
    } catch (error) {
      console.log(error);
      setEmailError("Ocurrió un error");
    }
  };

  return (  
    <Layout title="Ingresar - Blanca Sánchez">
       <section  style={{marginTop: '6rem'}} >
  <div className="container py-5 h-100">
    <div className="  d-flex justify-content-center align-items-center h-100">
      <div className=" ">
        <div className="card" style={{borderRadius: "1rem", border: "3px solid #125E8A "}}>
          <div className="row g-0">
          
            <div className=" d-flex align-items-center">
              <div className="card-body p-4 p-lg-5 text-black">
 
              <form onSubmit={handleSubmit}>
                  <h4 className="h3 fw-bold mb-3">Iniciar sesión</h4>

                  <div className="mb-3">
                    <label
                    className="form-label"
                      
                    >
                      <strong>Email</strong>
                    </label>

                    <input
                      type="text"
                      autoFocus
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-control"
                      id="exampleInputEmail1"
                      placeholder="Ingresa tu email"
                      required
                    />
                    {emailError && (
                      <small className="text-danger">{emailError}</small>
                    )}
                  </div>
                  <div className="mb-0 row">
  <label  className="form-label"  >
    <strong>Clave</strong>
  </label>

  <div className="col-12">
    <div style={{ position: "relative" }}>
      <input
        onChange={onChange}
        type={shown ? "text" : "password"}
        value={password}
        className="form-control"
        id="exampleInputPassword1"
        placeholder="Ingresa tu clave"
        required
      />
      <button
        type="button"
        style={{
          position: "absolute",
          right: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          backgroundColor: "transparent",
          border: "none",
          color: "#125E8A",
        }}
        onClick={switchShown}
      >
        {shown ? <FaEye /> : <FaEyeSlash />}
      </button>
    </div>
  </div>
</div>

                  <button type="submit" className="btn btn-primary ingresar mt-4">
                    Ingresar
                  </button>
                  <p className="mt-4">¿No estas registrado? pulsa <Link to="/register">aquí</Link> </p>
                  <p className="mt-4">¿Olvidaste tu clave? pulsa <Link to="/reset-password">aquí</Link> </p>
                </form>

              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
    </Layout>
  );
};

export default Login;
