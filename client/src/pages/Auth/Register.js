import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import registrar from "../Auth/img/registrar.jpg"
import register from "./img/registro.png";
import "../../styles/AuthStyles.css";

const Register = () => {
  const [shown, setShown] = useState(false);
  const [confirmedShown, setConfirmedShown] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmedPasswordError, setConfirmedPasswordError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [addressError, setAddressError] = useState("");

  const navigate = useNavigate();

  // FUNCIÓN PARA EL FORMULARIO
  const handleSubmit = async (e) => {
    e.preventDefault();

     // Verificar nombre y apellido
  const nameParts = name.trim().split(" ");
  if (nameParts.length < 2) {
    setNameError("Ingrese un nombre y un apellido");
    return;
  } else {
    setNameError("");
  }

    // Validar nombre
    if (!name) {
      setNameError("El nombre es requerido");
      return;
    } else {
      setNameError("");
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setEmailError("Ingrese un email válido");
      return;
    } else {
      setEmailError("");
    }

    // Validar password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-_@$!%*#?&.,¡¿])[A-Za-z\d\-_@$!%*#?&.,¡¿.]{8,}$/;

    if (!password || !passwordRegex.test(password)) {
      setPasswordError(
        "La clave debe tener al menos 8 caracteres y contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial (- _ @ $ ! % * # ? &)"
      );
      return;
    } else {
      setPasswordError("");
    }

    // Validar confirmación de contraseña
    if (password !== confirmedPassword) {
      setConfirmedPasswordError("Las contraseñas no coinciden");
      return;
    } else {
      setConfirmedPasswordError("");
    }

    // Validar teléfono
    const phoneRegex = /^\d{11}$/;
    if (!phone || !phoneRegex.test(phone)) {
      setPhoneError("Ingrese un número de teléfono válido");
      return;
    } else {
      setPhoneError("");
    }

    // Validar dirección
    if (!address) {
      setAddressError("La dirección es requerida");
      return;
    } else {
      setAddressError("");
    }

    try {
      const res = await axios.post("/api/v1/auth/register", {
        name,
        email,
        password,
        phone,
        address,
      });
      if (res && res.data.success) {
        toast.success("Usuario creado correctamente");
        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Ha ocurrido un error");
    }
  };

  useEffect(() => {
    validatePassword();
  }, [password]);

  // Validar password
  const validatePassword = () => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-_@$!%*#?&.,¡¿])[A-Za-z\d\-_@$!%*#?&.,¡¿.]{8,}$/;

    if (!password || !passwordRegex.test(password)) {
      setPasswordError(
        "La clave debe tener al menos 8 caracteres y contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial (- _ @ $ ! % * # ? &)"
      );
    } else {
      setPasswordError("");
    } 
  };

  return (
    <Layout title="Registro - Blanca Sánchez"  style={{ width: "100vw" }}>
      <section  >
  <div className="container py-5 h-100">
    <div className="row d-flex justify-content-center align-items-center h-100">
      <div className="col col-xl-10">
        <div className="card" style={{borderRadius: "1rem", border: "3px solid #125E8A "}}>
          <div className="row g-0">
          <div className="col-md-7 col-lg-6 d-none d-md-block">
              <img src={registrar} width="100%" height="100%" 
                alt="register form" style={{borderRadius: "1rem 0 0 1rem"}} />
            </div>
            <div className="col-md-5 col-lg-6 d-flex align-items-center">
              <div className="card-body p-4 p-lg-5 text-black">
 
              <form onSubmit={handleSubmit}>
              <div className="d-flex align-items-center mb-3 pb-1">
                     
                    <span className="h1 fw-bold mb-0">Registrarse</span>
                  </div>

                  <h5 className="fw-normal mb-3 pb-3" style={{letterSpacing: "1px"}}>Ingresa tus datos</h5>
                  <div className="mb-3">
                    <label className="form-label">
                      <strong>Nombre Completo</strong>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="form-control"
                      id="exampleInputEmail1"
                      placeholder="Ingresa tu nombre"
                      required
                      autoFocus
                    />
                    {nameError && (
                      <small className="text-danger">{nameError}</small>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      <strong>Email</strong>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-control"
                      id="exampleInputEmail2"
                      placeholder="Ingresa tu email"
                      required
                    />
                    {emailError && (
                      <small className="text-danger">{emailError}</small>
                    )}
                  </div>
                  <div className="mb-3 row">
                    <label className="form-label">
                      <strong>Clave</strong>
                    </label>
                    <div className="col-12" style={{ position: "relative" }}>
                      <input
                        onChange={(e) => setPassword(e.target.value)}
                        type={shown ? "text" : "password"}
                        value={password}
                        className="form-control"
                        id="exampleInputPassword3"
                        placeholder="Ingresa tu clave"
                        required
                      />
                      <button
                        type="button"
                        style={{
                          backgroundColor: "transparent",
                          
                          border: "none",
                          color: "#125E8A",
                          marginRight: "8px",
                          position: "absolute",
                          right: "14px",
                          top: "50%",
                          transform: "translateY(-50%)",
                        }}
                        onClick={() => setShown(!shown)}
                      >
                        {shown ? <FaEye /> : <FaEyeSlash />}
                      </button>
                    </div>
                    {passwordError && (
                      <small
                        className="text-danger"
                        style={{ display: "block", marginTop: "4px" }}
                      >
                        {passwordError}
                      </small>
                    )}
                  </div>
                  <div className="mb-3 row">
                    <label className="form-label">
                      <strong>Confirmar Clave</strong>
                    </label>
                    <div className="col-12" style={{ position: "relative" }}>
                      <input
                        onChange={(e) => setConfirmedPassword(e.target.value)}
                        type={confirmedShown ? "text" : "password"}
                        value={confirmedPassword}
                        className="form-control"
                        id="exampleInputPassword4"
                        placeholder="Confirmar clave"
                        required
                      />
                      <button
                        type="button"
                        style={{
                          backgroundColor: "transparent",
                         
                          border: "none",
                          color: "#125E8A",
                          marginRight: "8px",
                          position: "absolute",
                          right: "14px",
                          top: "50%",
                          transform: "translateY(-50%)",
                        }}
                        onClick={() => setConfirmedShown(!confirmedShown)}
                      >
                        {confirmedShown ? <FaEye /> : <FaEyeSlash />}
                      </button>
                    </div>
                    {confirmedPasswordError && (
                      <small
                        className="text-danger"
                        style={{ display: "block", marginTop: "4px" }}
                      >
                        {confirmedPasswordError}
                      </small>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      <strong>Teléfono</strong>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="form-control"
                      id="exampleInputEmail4"
                      placeholder="Ingresa tu teléfono"
                      maxLength="11"
                      required
                    />
                    {phoneError && (
                      <small className="text-danger">{phoneError}</small>
                    )}
                     {phone.length !== 11 && (
                    <small className="text-danger">
                      El número de telefono debe tener 11 digitos
                    </small>
                  )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      <strong>Dirección</strong>
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="form-control"
                      id="exampleInputEmail6"
                      placeholder="Ingresa tu dirección"
                      required
                    />
                    {addressError && (
                      <small className="text-danger">{addressError}</small>
                    )}
                  </div>
                  <button type="submit" className="btn btn-primary ingresar">
                    Registrar
                  </button>
                  <p className="mt-4">¿Ya estas registrado? pulsa <Link to="/login">aquí</Link> </p>

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

export default Register;
