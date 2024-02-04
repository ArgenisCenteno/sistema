import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "./../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";
const { Option } = Select;

const UpdateProduct = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [photo, setPhoto] = useState("");
  const [id, setId] = useState("");
  const [variations, setVariations] = useState([]);
  const [priceError, setPriceError] = useState(false);

  // OBTENER PRODUCTO
  const getSingleProduct = async () => {
    try {
      const { data } = await axios.get(`/api/v1/product/get-product/${params.slug}`);
      setName(data.product.name);
      setId(data.product._id);
      setDescription(data.product.description);
      setPrice(data.product.price);
      setQuantity(data.product.quantity);
      setShipping(data.product.shipping);
      setCategory(data.product.category._id);
      setVariations(data.product.variations);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSingleProduct();
  }, []);

  // OBTENER CATEGORIAS
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al traer las categorias");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  // FUNCION PARA ACTUALIZAR PRODUCTO
  const handleUpdate = async (e) => {
    e.preventDefault();

    // Validar el campo de precio
    if (parseFloat(price) < 0) {
      toast.error("El precio no puede ser negativo");
      return;
    }

    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);
      productData.append("category", category);
      productData.append("variations", JSON.stringify(variations));

      photo && productData.append("photo", photo);

      const { data } = await axios.put(`/api/v1/product/update-product/${id}`, productData);

      if (data?.success) {
        toast.success(data?.message);
      } else {
        navigate(`/dashboard/admin/products`);
        toast.error("Error al actualizar producto");
      }
    } catch (error) {
      console.log(error);
      toast.error("Ocurrió un error inesperado");
    }
  };

  //Agrega variaciones, estas son: tallas, precio y cantidad
  const addVariation = () => {
    const newVariation = { size: "", price: "", quantity: "" };
    setVariations([...variations, newVariation]);
  };

  //Remover variaciones 
  const removeVariation = (index) => {
    const updatedVariations = [...variations];
    updatedVariations.splice(index, 1);
    setVariations(updatedVariations);
  };
  //Actualizar los valores de las variaciones
  const handleVariationChange = (e, index, field) => {
    const updatedVariations = [...variations];
    updatedVariations[index][field] = e.target.value;
    setVariations(updatedVariations);
  };

  //Validar que los precios ingresados no contengan negativos
  const handlePriceBlur = (e) => {
    const value = e.target.value;
    if (value < 0) {
      setPriceError(true);
    } else {
      setPriceError(false);
    }
  };

  // ELIMINAR PRODUCTO
  const handleDelete = async () => {
    try {
      let answer = window.prompt("Estás seguro de querer eliminar este producto?");
      if (!answer) return;
      const { data } = await axios.delete(`/api/v1/product/delete-product/${id}`);
      toast.success("Producto eliminado correctamente");
      navigate("/dashboard/admin/products");
    } catch (error) {
      console.log(error);
      toast.error("Error inesperado");
    }
  };

  return (
    <Layout title={"Dashboard - Actualizar producto"}>
      <div className="container-fluid p-3 updateProduct">
        <div className="row">
          <div className="col-md-3 mt-8">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Actualizar Producto</h1>
            <div className="m-1 w-75">
              <div className="mb-3">
                <p>
                  <strong>Categoría</strong>
                </p>
                <Select
                  bordered={false}
                  placeholder="Seleccione una categoria"
                  size="large"
                  showSearch
                  className="form-select mb-3"
                  onChange={(value) => {
                    setCategory(value);
                  }}
                  value={category}
                  showArrow={false}
                >
                  {categories?.map((c) => (
                    <Option key={c._id} value={c._id}>
                      {c.name}
                    </Option>
                  ))}
                </Select>
              </div>
              <div className="mb-3">
                <p>
                  <strong>Imagen</strong>
                </p>
                <label className="btn btn-outline-secondary col-md-12">
                  {photo ? photo.name : "Subir imagen"}
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    onChange={(e) => setPhoto(e.target.files[0])}
                    hidden
                  />
                </label>
              </div>
              <div className="mb-3">
                {photo ? (
                  <div className="text-center">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt="product_photo"
                      height={"200px"}
                      className="img img-responsive"
                    />
                  </div>
                ) : (
                  <div className="text-center">
                    <img
                      src={`/api/v1/product/product-photo/${id}`}
                      alt="product_photo"
                      height={"200px"}
                      className="img img-responsive"
                    />
                  </div>
                )}
              </div>
              <div className="mb-3">
                <div className="row">
                  <div className="col">
                    <p>
                      <strong>Nombre</strong>
                    </p>
                    <input
                      type="text"
                      value={name}
                      placeholder="Ingrese un nombre"
                      className="form-control"
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="col">
                    <p>
                      <strong>Descripción</strong>
                    </p>
                    <textarea
                      type="text"
                      value={description}
                      placeholder="Ingrese una descripción"
                      className="form-control"
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {variations.map((variation, index) => (
                <div key={index} className="row mb-3 d-flex justify-content-between variations-update">
                  <div className="col">
                    <p>
                      <strong>{`Talla: ${variation.size}`}</strong>
                    </p>
                    <input
                      type="text"
                      value={variation.size}
                      placeholder="Talla"
                      className="form-control"
                      onChange={(e) => handleVariationChange(e, index, "size")}
                    />
                  </div>
                  <div className="col">
                    <p>
                      <strong>{`Precio: ${variation.price} $`}</strong>
                    </p>
                    <input
                      type="number"
                      step="any"
                      value={variation.price}
                      placeholder="Precio"
                      className={`form-control ${priceError ? "is-invalid" : ""}`}
                      onBlur={handlePriceBlur}
                      onChange={(e) => handleVariationChange(e, index, "price")}
                    />
                    {priceError && <div className="invalid-feedback">El precio no puede ser negativo.</div>}
                  </div>
                  <div className="col">
                    <p>
                      <strong>{`Cantidad: ${variation.quantity}`}</strong>
                    </p>
                    <input
                      type="number"
                      value={variation.quantity}
                      placeholder="Cantidad"
                      className="form-control"
                      onChange={(e) => handleVariationChange(e, index, "quantity")}
                      min="0"
                    />
                  </div>
                  {variations.length > 1 && (
                    <div className="col align-self-center">
                      <p>
                        <strong>Quitar</strong>
                      </p>
                      <button className="btn btn-danger" onClick={() => removeVariation(index)}>
                        Remover
                      </button>
                    </div>
                  )}
                </div>
              ))}

              <div className="mb-3">
                <button className="btn btn-success text-white" onClick={addVariation}>
                  Agregar Variación
                </button>
              </div>

              <div className="mb-3">
                <button className="btn btn-primary" onClick={handleUpdate}>
                  Actualizar Producto
                </button>
              </div>
              <div className="mb-3">
                <button className="btn btn-danger" onClick={handleDelete}>
                  Eliminar Producto
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UpdateProduct;
