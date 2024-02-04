import {useState} from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import SearchInput from "../Form/SearchInput";
import useCategory from "../../hooks/useCategory";
import { useCart } from "../../context/cart";
import hella from "./img/logo192.png";
import { Badge } from "antd"; 
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import SearchIcon from '@mui/icons-material/Search';

const formatUserName = (name) => {
  const namesArray = name.split(" ");
  if (namesArray.length === 4) {
    // Si tiene dos nombres y dos apellidos, mostrar primer nombre y segundo apellido
    return `${namesArray[0]} ${namesArray[2]}`;
  } else {
    // Si no, mostrar el nombre tal cual
    return name;
  }
};

const Header = () => {
  const [showSearchInput, setShowSearchInput] = useState(false);  
  const [auth, setAuth] = useAuth();
  const [cart] = useCart();
  const categories = useCategory();

  // CERRAR SESION
  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    localStorage.removeItem("auth");
    toast.success("Sesion cerrada");
  };

  const man = "hombre"
  const women ="mujer"
  const boy = "niño"
  const girl = "niña"
 

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-class bg-body-tertiary pt-4 pb-2" >
        <div className="container-fluid">
          <button
            className="navbar-toggler iconHeader"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarTogglerDemo01"
            aria-controls="navbarTogglerDemo01"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
            
          </button>
             <div className="logo-container">
            <Link to={"/"} className="navbar-brand  title-header" style={{color: "#125E8A"}}>
            <img src={hella}  alt="logo-blanca" width="50px" height="50px" />
            Blanca Sánchez  
            </Link> 
             
            </div>

          <div className="collapse navbar-collapse" style={{zIndex: "10"}} id="navbarTogglerDemo01">
           
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0   ">
            
            <SearchInput   /> 
              <li className="nav-item">
              <Link to={`/gender/${man}`} className="nav-link">
              Hombres
              </Link>
              </li>
              <li className="nav-item">
              <Link to={`/gender/${women}`}  className="nav-link">
              Mujeres
              </Link>
              </li>
              <li className="nav-item">
              <Link to={`/gender/${boy}`} className="nav-link">
              Niños
              </Link>
              </li>
              <li className="nav-item">
              <Link to={`/gender/${girl}`}  className="nav-link">
              Niñas
              </Link>
              </li>
              
             
              {/*<li className="nav-item dropdown">
                <Link
                  className="nav-link dropdown-toggle"
                  to={"/categories"}
                  data-bs-toggle="dropdown"
                >
                  Categorias
                </Link>
                <ul className="dropdown-menu ">
                  <li>
                    <Link className="dropdown-item" to={"/categories"}>
                      Todas las categorias
                    </Link>
                  </li>
                  {categories?.map((c) => (
                    <li key={c._id}>
                      <Link
                        className="dropdown-item"
                        to={`/category/${c.slug}`}
                      >
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
                  </li>*/}

              {!auth?.user ? (
                <>
                  <li className="nav-item">
                    <NavLink to="/register" className="nav-link">
                      Registrar
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/login" className="nav-link">
                      Ingresar
                    </NavLink>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item dropdown">
                  <NavLink
                        className="nav-link dropdown-toggle" 
                       role="button"
                       data-bs-toggle="dropdown"
                       style={{ border: "none" }}
                                 >
                              
                       {formatUserName(auth?.user?.name)}
                        
                    </NavLink>
                    <ul className="dropdown-menu userDropDown">
                      <li>
                        <NavLink
                          to={`/dashboard/${
                            auth?.user?.role === 1 ? "admin" : "user"
                          }`}
                          className="dropdown-item"
                        >
                          Dashboard
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          onClick={handleLogout}
                          to="/login"
                          className="dropdown-item"
                        >
                          Cerrar Sesion
                        </NavLink>
                      </li>
                    </ul>
                  </li>
                  
                </>
              )}
             
            </ul>
          </div>
         <ul  >
         <li className="iconHeaderPrincipal" style={{listStyle: "none"}}>
              <Link to={"/"} className="navbar-brand text-success d-lg-none" >
            <img src={hella}  alt="logo-blanca" width="50px" height="50px" />

            </Link></li> 
          </ul> 
                        <ul>
  
            
            <li className="nav-item fixed-cart-icon " style={{marginRight: "14px"}}>
              <NavLink to="/cart" className="nav-link " style={{ marginLeft: "32px", marginRight: "9px" }}>
                      <Badge
                        count={cart?.length}
                        style={{ color: "#ffff", background: "#125E8A" }}
                        showZero
                        offset={[10, -5]}
                      >
                        
                        <LocalMallOutlinedIcon style={{ color: "#125E8A" }} />
                      </Badge>
                    </NavLink>
              </li>  

                       

          </ul>
         
        
        </div>
       
      </nav>

      
    </>
  );
};

export default Header;