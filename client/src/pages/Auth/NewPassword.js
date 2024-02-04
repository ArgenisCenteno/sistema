import React, { useState, useEffect } from "react";
import { useParams, useNavigate} from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../../styles/AuthStyles.css";
import Layout from "../../components/Layout/Layout";

const NewPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [shown, setShown] = useState(false);
  const [confirmedShown, setConfirmedShown] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmedPasswordError, setConfirmedPasswordError] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);


  useEffect(() => {
    // Aquí puedes agregar la lógica para validar el token en el servidor
    axios
      .post("/api/v1/auth/validate-token", { token })
      .then((response) => {
        if (response.data.success) {
          // Token válido, puedes mostrar un mensaje de éxito o redirigir al usuario a otra página
          toast.success("Token válido. Puedes cambiar tu contraseña.");
        } else {
          // Token inválido, redirige al usuario a una página de error o inicio de sesión
          toast.error("Token inválido o ya no se puede usar");
          navigate("/login");
        }
      })
      .catch((error) => {
        // Ocurrió un error al hacer la petición, redirige al usuario a una página de error o inicio de sesión
        navigate("/login");
      });
  }, [token, navigate]);


  useEffect(() => {
    validatePassword();
    validateConfirmedPassword();
  }, []);

  useEffect(() => {
    setIsFormValid(
      passwordError === "" &&
      confirmedPasswordError === "" &&
      password !== "" &&
      confirmedPassword !== ""
    );
  }, [passwordError, confirmedPasswordError, password, confirmedPassword]);
  
  useEffect(() => {
    validateConfirmedPassword();
  }, [confirmedPassword]);


  const validatePassword = () => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-_@$!%*#?&.,¡¿])[A-Za-z\d\-_@$!%*#?&.,¡¿.]{8,}$/;
  
    if (!password || !passwordRegex.test(password)) {
      setPasswordError(
        "La clave debe tener al menos 8 caracteres y contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial (- _ @ $ ! % * # ? &)"
      );
    } else {
      setPasswordError("");
    }
  
    if (password !== confirmedPassword && confirmedPassword.trim() !== "") {
      setConfirmedPasswordError("Las contraseñas no coinciden");
    } else {
      setConfirmedPasswordError("");
    }
  };

  const validateConfirmedPassword = () => {
    validatePassword(); // Primero validamos la contraseña principal para asegurarnos de que los errores estén actualizados
    if (password !== confirmedPassword && confirmedPassword.trim() !== "") {
      setConfirmedPasswordError("Las contraseñas no coinciden");
    } else {
      setConfirmedPasswordError("");
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwordError || confirmedPasswordError) {
      // Si hay errores, no se envía el formulario
      return;
    }

    try {
      const res = await axios.post("/api/v1/auth/reset-password", {
        token,
        password,
      });
      if (res && res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
        // Redirigir al usuario a la página de inicio de sesión u otra página de tu elección
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error inesperado");
    }
  };

  return (
    <Layout title="Registrar - Hella Store"  style={{ width: "100vw" }}>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <h4 className="title">Cambiar clave</h4>
          <div className="mb-0 row">
            <label style={{ fontSize: "12px", marginBottom: "6px" }}>
              <strong>Clave</strong>
            </label>
            <div className="col-9" style={{ position: "relative" }}>
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
                  color: "#059669",
                  marginRight: "8px",
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
                onClick={() => setShown(!shown)}
              >
                {shown ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
          </div>
          <div className="mb-0 row">
            <label style={{ fontSize: "12px", marginBottom: "6px", marginTop: "6px" }}>
              <strong>Confirmar Clave</strong>
            </label>
            <div className="col-9" style={{ position: "relative" }}>
              <input
                onChange={(e) => setConfirmedPassword(e.target.value)}
                type={confirmedShown ? "text" : "password"}
                defaultValue={confirmedPassword}
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
                  color: "#059669",
                  marginRight: "8px",
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
                onClick={() => setConfirmedShown(!confirmedShown)}
              >
                {confirmedShown ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
          </div>
          {confirmedPasswordError && (
            <small className="text-danger" style={{ display: "block", marginTop: "4px" }}>
              {confirmedPasswordError}
            </small>
          )}
          {passwordError && (
            <small className="text-danger" style={{ display: "block", marginTop: "4px" }}>
              {passwordError}
            </small>
          )}
          <button type="submit" className="btn btn-success mt-4" disabled={!isFormValid}>
            Guardar cambios
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default NewPassword;
