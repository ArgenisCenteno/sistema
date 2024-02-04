import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "./../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { Select } from "antd";
import { useNavigate } from "react-router-dom";
const { Option } = Select;

const CreateProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [quantities, setQuantities] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [photo, setPhoto] = useState("");
  const [sizes, setSizes] = useState(["S"]);
  const [prices, setPrices] = useState([]);
  const [formValid, setFormValid] = useState(false);
  const [priceError, setPriceError] = useState("");
  const [gender, setGender] = useState("unisex");
  const [clothingType, setClothingType] = useState("");  

  // Obtener todas las categorías
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Ha ocurrido un error al consultar las categorias");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  // Agregar una nueva talla
  const handleAddVariation = () => {
    setSizes([...sizes, ""]);
    setPrices([...prices, 0]);
    setQuantities([...quantities, 0]);
  };

  // Remover elementos de las variaciones
  const handleRemoveVariation = (index) => {
    const updatedSizes = [...sizes];
    const updatedPrices = [...prices];
    const updatedQuantities = [...quantities];
    updatedSizes.splice(index, 1);
    updatedPrices.splice(index, 1);
    updatedQuantities.splice(index, 1);
    setSizes(updatedSizes);
    setPrices(updatedPrices);
    setQuantities(updatedQuantities);
  };

  // Modificar la talla
  const handleSizeChange = (e, index) => {
    const updatedSizes = [...sizes];
    updatedSizes[index] = e.target.value;
    setSizes(updatedSizes);
  };

  // Modificar el precio
  const handlePriceChange = (e, index) => {
    const newPrice = Number(e.target.value);
    if (newPrice >= 0) {
      const updatedPrices = [...prices];
      updatedPrices[index] = newPrice;
      setPrices(updatedPrices);
      setPriceError("");
    } else {
      setPriceError("El precio no puede ser negativo");
    }
  };
  const generateKeywordsFromTypeAndGender = (clothingType, gender) => {
    // Función para convertir una palabra a plural
    const toPlural = (word) => {
      // Implementa aquí la lógica para convertir a plural
      // Por ejemplo, si el tipo de prenda está en singular, podrías agregar una "s" al final para convertirlo a plural
      if (!word.endsWith("s")) {
        return word + "s";
      }
      return word;
    };
  
    // Función para convertir una palabra a singular
    const toSingular = (word) => { 
      if (word.endsWith("es")) {
        if (word === "shores") {
          return "short";
        }
        if (word === "liquis") {
          return "liqui liqui";
        }
        return word.slice(0, -2);
      }else{
        return word.slice(0, -1);
      }
      return word;
    };
  
    const singularClothingType = toSingular(clothingType);
    const pluralClothingType = toPlural(clothingType);
  
    const keywords = [singularClothingType, pluralClothingType];
  
    if (gender === "hombre") {
      keywords.push(`${singularClothingType} para caballeros`);
       keywords.push(`${singularClothingType} de hombres`);
       keywords.push(`${singularClothingType} para hombres`);
    keywords.push(`${singularClothingType} de caballeros`);
    keywords.push(`${singularClothingType} de hombre`);
    keywords.push(`${singularClothingType} de caballero`);
    keywords.push(`${singularClothingType} para hombre`);
    keywords.push(`${singularClothingType} para caballero`);
    keywords.push(`${singularClothingType} hombres`);
    keywords.push(`${singularClothingType} caballeros`);
    keywords.push(`${singularClothingType} hombre`);
    keywords.push(`${singularClothingType} de caballero`);
 
    //PLURAL

    keywords.push(`${pluralClothingType} para caballeros`);
       keywords.push(`${pluralClothingType} de hombres`);
    keywords.push(`${pluralClothingType} de caballeros`);
    keywords.push(`${pluralClothingType} para hombres`);
    keywords.push(`${pluralClothingType} de hombre`);
    keywords.push(`${pluralClothingType} de caballero`);
    keywords.push(`${pluralClothingType} para hombre`);
    keywords.push(`${pluralClothingType} para caballero`);
    keywords.push(`${pluralClothingType} hombres`);
    keywords.push(`${pluralClothingType} caballeros`);
    keywords.push(`${pluralClothingType} hombre`);
    keywords.push(`${pluralClothingType} de caballero`);
      
      
    } else if (gender === "mujer") {
      keywords.push(`${singularClothingType} para damas`);
       keywords.push(`${singularClothingType} de mujeres`);
    keywords.push(`${singularClothingType} de damas`);
    keywords.push(`${singularClothingType} de mujer`);
    keywords.push(`${singularClothingType} de dama`);
    keywords.push(`${singularClothingType} para mujeres`);
    keywords.push(`${singularClothingType} para mujer`);
    keywords.push(`${singularClothingType} para dama`);
    keywords.push(`${singularClothingType} mujeres`);
    keywords.push(`${singularClothingType} damas`);
    keywords.push(`${singularClothingType} mujer`);
    keywords.push(`${singularClothingType} de dama`);
    keywords.push(`${singularClothingType} de mujeres`);
 
    //PLURAL

    keywords.push(`${pluralClothingType} para damas`);
       keywords.push(`${pluralClothingType} de mujer`);
    keywords.push(`${pluralClothingType} de damas`);
    keywords.push(`${pluralClothingType} de mujer`);
    keywords.push(`${pluralClothingType} de dama`);
    keywords.push(`${pluralClothingType} para mujer`);
    keywords.push(`${pluralClothingType} para mujeres`);
    keywords.push(`${pluralClothingType} para dama`);
    keywords.push(`${pluralClothingType} mujeres`);
    keywords.push(`${pluralClothingType} damas`);
    keywords.push(`${pluralClothingType} hombre`);
    keywords.push(`${pluralClothingType} de dama`);
    keywords.push(`${singularClothingType} de mujeres`);
     
    }
   
  
    return keywords;
  };

 // Actualizar palabras clave cuando la categoría o el género cambie
  // Actualizar palabras clave cuando el tipo de prenda cambie
  useEffect(() => {
    if (clothingType && gender) {
      const generatedKeywords = generateKeywordsFromTypeAndGender(clothingType, gender);
      setKeywords(generatedKeywords);
    }
  }, [clothingType, gender]);
  // Modificar la cantidad
  const handleQuantityChange = (e, index) => {
    const updatedQuantities = [...quantities];
    updatedQuantities[index] = Number(e.target.value);
    setQuantities(updatedQuantities);
  };

  // Validar el formulario
  useEffect(() => {
    const hasSizes = sizes.length > 0;
    const hasValidPrices = prices.every((price) => price > 0);
    const hasValidQuantities = quantities.every((quantity) => quantity >= 0);
    const isFormValid =
      hasSizes && hasValidPrices && hasValidQuantities && name !== "" && description !== "" && category !== "";
    setFormValid(isFormValid);
  }, [sizes, prices, quantities, name, description, category]);

  // Agregar una nueva palabra clave
  const handleAddKeyword = () => {
    setKeywords([...keywords, ""]);
  };

  // Modificar una palabra clave
  const handleKeywordChange = (e, index) => {
    const updatedKeywords = [...keywords];
    updatedKeywords[index] = e.target.value;
    setKeywords(updatedKeywords);
  };

  // Remover una palabra clave
  const handleRemoveKeyword = (index) => {
    const updatedKeywords = [...keywords];
    updatedKeywords.splice(index, 1);
    setKeywords(updatedKeywords);
  };

  // Crear producto
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const variations = sizes.map((size, index) => ({
        size: size,
        price: prices[index],
        quantity: quantities[index],
      }));

      const productData = new FormData();
      productData.append("name", name);
      productData.append("gender", gender);
      productData.append("description", description);
      productData.append("variations", JSON.stringify(variations));
      productData.append("photo", photo);
      productData.append("category", category); 
      productData.append("keywords", JSON.stringify(keywords));

      const { data } = await axios.post("/api/v1/product/create-product", productData);

      if (data?.success) {
        toast.success(data?.message);
      } else {
        toast.danger("Verifique los campos para crear el producto");
        navigate("/dashboard/admin/create-product");
      }
    } catch (error) {
      console.log(error);
      toast.error("Complete los campos en el formulario");
    }
  };

  const clothingOptions = [
    "blusas",
    "bikinis",
    "blazer",
    "bluma",
    "boxers",
    "batas",
    "camisas",
    "cardigan",
    "chaquetas",
    "collares",
    "flux",
    "faldas",
    "franelas",
    "gorras",
    "leggins",
    "liqui liqui",
    "medias",
    "minifaldas",
    "monos",
    "pantalones",
    "pijamas",
    "pulsera",
    "sandalias",
    "sombreros",
    "smoking",
    "shores",
    "sostenes",
    "sujetadores",
    "sueteres",
    "tangas",
    "tops",
    "trajes de baño",
    "vestidos",
    "zapatos",
    "zarcillo",
  ];

  const sortedClothingOptions = [...clothingOptions].sort((a, b) =>
    a.localeCompare(b)
  );

  return (
    <Layout title={"Dashboard - Crear Producto"}>
      <div className="container-fluid   p-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Crear Producto</h1>
            <div className="m-1 w-75">
              <p>
                <strong>Categoría</strong>
              </p>
              <Select
                bordered={false}
                placeholder="Selecciona una categoria"
                size="large"
                showSearch
                className="form-select mb-3"
                onChange={(value) => {
                  setCategory(value);
                }}
              >
                {categories?.map((c) => (
                  <Option key={c._id} value={c._id}>
                    {c.name}
                  </Option>
                ))}
              </Select>
              <div className="mb-3">
          <p>
            <strong>Género</strong>
          </p>
          <select
            className="form-control"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
             <option value="" >Elija el genero</option>
            <option value="hombre">Hombre</option>
            <option value="mujer">Mujer</option>
            <option value="niño">Niño</option>
            <option value="niña">Niña</option>
          </select>
        </div>
        <div className="mb-3">
          <p>
            <strong>Tipo de prenda</strong>
          </p>
          <select
      className="form-control"
      value={clothingType}
      onChange={(e) => setClothingType(e.target.value)}
    >
      <option value="selected">Tipo de prenda</option>
      {sortedClothingOptions.map((option) => (
        <option key={option} value={option}>
          {option.charAt(0).toUpperCase() + option.slice(1)}
        </option>
      ))}
    </select>
        </div>
              <div className="mb-3">
                <p>
                  <strong>Imagen</strong>
                </p>
                <label className="btn btn-outline-success col-md-12">
                  {photo ? photo.name : "Subir imagen"}
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    onChange={(e) => setPhoto(e.target.files[0])}
                    hidden
                    required
                  />
                </label>
              </div>
              <div className="mb-3">
                {photo && (
                  <div className="text-center">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt="product_photo"
                      height={"200px"}
                      className="img img-responsive"
                    />
                  </div>
                )}
              </div>
              <div className="mb-3">
                <p>
                  <strong>Nombre del producto</strong>
                </p>
                <input
                  type="text"
                  value={name}
                  placeholder="Ingresa un nombre"
                  className="form-control"
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <p>
                  <strong>Descripción</strong>
                </p>
                <input
                  type="text"
                  value={description}
                  placeholder="Ingresa una descripción"
                  className="form-control"
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              {sizes.map((size, index) => (
                <div key={index} className="row mb-3 d-flex justify-content-left">
                  <div className="col-4 col-sm-3">
                    <p>
                      <strong>{`Talla: ${size}`}</strong>
                    </p>
                    <input
                      type="text"
                      value={size}
                      placeholder="Ingresa la talla"
                      className="form-control"
                      onChange={(e) => handleSizeChange(e, index)}
                      required
                    />
                  </div>
                  <div className="col-4 col-sm-3">
                    <p>
                      <strong>Precio: {prices[index] !== undefined ? ` ${prices[index]} $` : ""}</strong>
                    </p>
                    <input
                      type="number"
                      step="any"
                      value={prices[index]}
                      className="form-control"
                      min="0"
                      onChange={(e) => handlePriceChange(e, index)}
                      required
                    />
                    {priceError && <p className="text-danger">{priceError}</p>}
                  </div>
                  <div className="col-4 col-sm-3">
                    <p>
                      <strong>Cantidad: {quantities[index] !== undefined ? ` ${quantities[index]}` : ""}</strong>
                    </p>
                    <input
                      type="number"
                      min="0"
                      value={quantities[index]}
                      placeholder="Cantidad"
                      className="form-control"
                      onChange={(e) => handleQuantityChange(e, index)}
                      required
                    />
                  </div>
                  {sizes.length > 1 && (
                    <div className="col-4 col-sm-3 align-self-center">
                      <p>
                        <strong>Quitar</strong>
                      </p>
                      <button className="btn btn-danger" onClick={() => handleRemoveVariation(index)}>
                        X
                      </button>
                    </div>
                  )}
                </div>
              ))}
              <div className="mb-3">
                <button className="btn btn-success" onClick={handleAddVariation}>
                  Agregar Talla
                </button>
              </div>
              <div className="mb-3">
                <p>
                  <strong>Palabras clave</strong>
                </p>
                {keywords.map((keyword, index) => (
                  <div key={index} className="row mb-3">
                    <div className="col-10">
                      <input
                        type="text"
                        value={keyword}
                        placeholder="Ingresa una palabra clave"
                        className="form-control"
                        onChange={(e) => handleKeywordChange(e, index)}
                      />
                    </div>
                    {keywords.length > 1 && (
                      <div className="col-2 align-self-center">
                        <button className="btn btn-danger" onClick={() => handleRemoveKeyword(index)}>
                          X
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                <div>
                  <button className="btn btn-success" onClick={handleAddKeyword}>
                    Agregar Palabra Clave
                  </button>
                </div>
              </div>
              <div className="mb-3">
                <button className="btn btn-primary" onClick={handleCreate} disabled={!formValid}>
                  Crear Producto
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateProduct;
