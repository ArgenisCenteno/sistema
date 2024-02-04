import {useState, useEffect} from "react";
import Banner from "./Banner";
import Header from "./Header";
import NavbarCategories from "./NavbarCategories"
import { Helmet } from "react-helmet";
import { Toaster } from "react-hot-toast"; 
const Layout = ({ children, title, description, keywords, author }) => {

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);


  return (
    <div >
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
        <title>{title}</title>
      </Helmet>
      <Header   />
     
      <main >
      {!isOnline && (
          <div className="alert alert-danger text-center">
            No hay conexión a internet. Por favor, verifica tu conexión y vuelve a intentarlo.
          </div>
        )}
        <Toaster />

        {children}
      </main>
      <Banner />
    </div>
  );
};

Layout.defaultProps = {
  title: "Blanca Sánchez",
  description: "Proyecto de Desarrollo Web",
  keywords: "React",
  author: "Grupo",
};

export default Layout;
