import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import orderModel from "../models/orderModel.js";

import nodemailer from "nodemailer"
import axios from "axios";
import fs from "fs";
import slugify from "slugify";
import braintree from "braintree";
import dotenv from "dotenv";
import cloudinary from "cloudinary";
 
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

 

export const createProductController = async (req, res) => {
  try {
    const { name, description, category, variations, keywords, gender } =
      req.fields;
    const { photo } = req.files;
    //VALIDACIONES
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Nombre es requerido" });
        case !gender:
        return res.status(500).send({ error: "Nombre es requerido" });
      case !description:
        return res.status(500).send({ error: "Marca es requerido" });
       
      case !category:
        return res.status(500).send({ error: "Categoria es requerido" });
      case variations:
        return res.status(500).send({ error: "La talla, precio y cantidad son obligatorias" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "La foto no puede pesar más de 1MB" });
    }

    const parsedVariations = JSON.parse(variations);
    const parsedKeywords = JSON.parse(keywords);
    const cloudinaryResult = await cloudinary.uploader.upload(photo.path, {
      folder: "productos", // Nombre de la carpeta donde se almacenarán las fotos en Cloudinary
      use_filename: true, // Utilizar el nombre original del archivo
    });
     
    const products = new productModel({ ...req.fields, slug: slugify(name),  variations: parsedVariations, keywords: parsedKeywords, photo: cloudinaryResult.secure_url});
    
    await products.save();
    res.status(201).send({
      success: true,
      message: "Producto creado correctamente",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error al crear producto",
    });
  }
};

//TRAER TODOS LOS PRODUCTOS
export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .select("-photo")
      .populate("category") 
      .limit(99)
      .sort({ name: 1 });
    res.status(200).send({
      success: true,
      counTotal: products.length,
      message: "ALlProducts ",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error al traer productos",
      error: error.message,
    });
  }
};
// OBTENER UN PRODUCTO EN PARTICULAR
export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug }) 
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Producto partícular",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error al traer prducto",
      error,
    });
  }
};

export const productPhotoController = async (req, res) => {
  try {
    
    const product = await productModel.findById(req.params.pid).select("photo");
    
    if (product.photo) {
      // Descargar la imagen desde Cloudinary
      const response = await axios.get(product.photo, { responseType: 'arraybuffer' });
      const imageBuffer = Buffer.from(response.data, 'binary');

      // Enviar la imagen como una respuesta binaria
      return res.status(200).send(imageBuffer);
    } else {
      // Si no hay foto disponible, puedes enviar una respuesta de error o una imagen de reemplazo por defecto
      return res.status(404).send({ message: "Foto no encontrada" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error al traer foto",
      error,
    });
  }
};

//ELIMINAR PRODUCTO
export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "Product Deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error,
    });
  }
};

//ACTUALIZAR PRODUCTO
export const updateProductController = async (req, res) => {
  try {
    const { name, description, category, variations } = req.fields;
    const { photo } = req.files;

    // Validación
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Nombre es requerido" });
      case !description:
        return res.status(500).send({ error: "Marca es requerido" });
      case !category:
        return res.status(500).send({ error: "Categoria es requerido" });
      case variations:
        return res.status(500).send({ error: "La talla, precio y cantidad son obligatorias" });
      case photo && photo.size > 1000000:
        return res.status(500).send({ error: "La foto no puede pesar más de 1MB" });
    }

    const parsedVariations = JSON.parse(variations);

    // Obtén el producto existente desde la base de datos
    let products = await productModel.findById(req.params.pid);

    if (!products) {
      return res.status(404).send({ error: "Producto no encontrado" });
    }

    // Verificar si hay una nueva imagen antes de actualizar el campo 'photo'
    if (photo) {
      // Sube la nueva foto a Cloudinary
      const result = await cloudinary.uploader.upload(photo.path, {
        folder: 'productos', // Establece el nombre de la carpeta deseada en Cloudinary
      });
      products.photo = result.secure_url;
    }

    // Actualizar los campos del producto
    products.name = name;
    products.description = description;
    products.category = category;
    products.variations = parsedVariations;
    products.slug = slugify(name);

    // Guardar los cambios en la base de datos
    await products.save();

    res.status(201).send({
      success: true,
      message: "Producto actualizado correctamente",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error al actualizar producto",
    });
  }
};

// FILTROS
export const productFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body; 
    let args = {};
    if (checked.length > 0) args.category =  checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Filtering Products",
      error,
    });
  }
};

// CONTAR PRODUCTOS
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error in product count",
      error,
      success: false,
    });
  }
};

// LISTA DE PRODUCTOS EN UNA PÁGINA
export const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})  
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(6)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
  }
};

//BUSCAR UN PRODUCTO 
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const resutls = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } }, 
          { keywords: { $in: [keyword] } },
        ],
      })
      .select("-photo");
    res.json(resutls);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error In Search Product API",
      error,
    });
  }
};

// PRODUCTOS SIMILARES
export const realtedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error while geting related product",
      error,
    });
  }
};

// oBTENER PRODUCTO POR CATEGORÍA
export const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productModel.find({ category }).populate("category");
    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error While Getting products",
    });
  }
};

 
 

export const createOrderController = async (req, res) => {
  try {
    const { cart, formData, userId } = req.body;
    let total = 0;
    let subTotal = 0;

    cart.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;

      subTotal += itemTotal;
    });

    total += formData.tasaEnvio;
    total = Number(total.toFixed(2));
    subTotal = Number(subTotal.toFixed(2));

    const order = new orderModel({
      products: cart,
      buyer: userId,
      address: formData,
      total: total,
      subtotal: subTotal,
      isPaid: false,
    });

    // Guardar la orden en la base de datos
    await order.save();

    // Actualizar la cantidad de productos en la base de datos
    await Promise.all(
      cart.map(async (item) => {
        const product = await productModel.findOneAndUpdate(
          {
            _id: item._id,
            "variations": {
              $elemMatch: { size: item.size },
            },
          },
          {
            $inc: {
              "variations.$.quantity": -item.quantity,
              sale: +item.quantity,
            },
          },
          { new: true }
        );
      })
    );

    res.status(201).json({ message: 'Orden creada correctamente', order });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const getPaypalBearerToken = async(req, res)  => {
    
  const PAYPAL_CLIENT = process.env.REACT_APP_PAYPAL_CLIENT_ID;
  const PAYPAL_SECRET = process.env.REACT_APP_PAYPAL_SECRET_KEY;

  const base64Token = Buffer.from(`${ PAYPAL_CLIENT }:${ PAYPAL_SECRET }`, 'utf-8').toString('base64');
  const body = new URLSearchParams('grant_type=client_credentials');


  try {
      
      const { data} = await axios.post( process.env.PAYPAL_OAUTH_URL || '', body, {
          headers: {
              'Authorization': `Basic ${ base64Token }`,
              'Content-Type': 'application/x-www-form-urlencoded'
          }
      });

      return data.access_token;


  } catch (error) {
      if ( axios.isAxiosError(error) ) {
          console.log(error.response?.data);
      } else {
          console.log(error);
      }

      return null;
  }


}

const sendEmailToAdmin = async (orderId, mountTotal) => {
  try {
    // Configura el transporte de nodemailer
    const transporter = nodemailer.createTransport({
      // Configura los detalles del servidor de correo saliente (SMTP)
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true para SSL 
      auth: {
        user:  process.env.EMAIL_SMTP ,
        pass: process.env.PASSWORD_EMAIL_SMTP,
      },
    });
    
   
    // Configura el contenido del correo electrónico
    const mailOptions = {
      from: process.env.EMAIL_SMTP,
      to:  process.env.ADMIN_EMAIL ,
      subject: "Nueva Orden Pagada", 
      html: `<p>La orden con ID ${orderId} ha sido pagada correctamente, con un Monto total de $${mountTotal} . Puedes ver los detalles en el panel de administración:</p><p> <a href="https://blancasanchez.onrender.com/dashboard/admin/order/${orderId}">Aquí</a>.</p>`,

    };

    // Envía el correo electrónico
    const info = await transporter.sendMail(mailOptions);
    console.log("Correo electrónico enviado:", info.messageId);
  } catch (error) {
    console.log("Error al enviar el correo electrónico:", error);
  }
};


export const paypalPayController = async (req, res) =>{
  const paypalBearerToken = await getPaypalBearerToken();

  if ( !paypalBearerToken ) {
      return res.status(400).json({ message: 'No se pudo confirmar el token de paypal' })
  }

  const { transactionId , orderId } = req.body;


  const { data } = await axios.get( `${ process.env.PAYPAL_ORDERS_URL }/${ transactionId }`, {
      headers: {
          'Authorization': `Bearer ${ paypalBearerToken }`
      }
  });

  if ( data.status !== 'COMPLETED' ) {
      return res.status(401).json({ message: 'Orden no reconocida' });
  }

 
  const dbOrder = await orderModel.findById(orderId);

  if ( !dbOrder ) {
      await db.disconnect();
      return res.status(400).json({ message: 'Orden no existe en nuestra base de datos' });
  }
  
  
  if ( dbOrder.total !== Number(data.purchase_units[0].amount.value) ) {
      await db.disconnect();
      return res.status(400).json({ message: 'Los montos de PayPal y nuestra orden no son iguales' });
  }

  const mountTotal = dbOrder.total;
  dbOrder.payment = {
    transactionId,
    paymentMethod: "Paypal"
  };
  dbOrder.isPaid = true;
  await dbOrder.save(); 

  // Envía el correo electrónico al administrador con el enlace a la orden
  await sendEmailToAdmin(orderId, mountTotal);

  return res.status(200).json({ message: 'Orden pagada' });
}

export const payWithBank = async (req, res) =>{
  
  const { banco, monto, codigoReferencia, tipoTransaccion , orderId } = req.body;
 
 console.log(banco, monto, codigoReferencia, tipoTransaccion , orderId)
  const dbOrder = await orderModel.findById(orderId);

  if ( !dbOrder ) {
      await db.disconnect();
      return res.status(400).json({ message: 'Orden no existe en nuestra base de datos' });
  }
  
   

  const mountTotal = dbOrder.total;
  dbOrder.payment = {
    transactionId: codigoReferencia,
    paymentMethod:  tipoTransaccion,
    bank: banco,
    total: monto
  };
  dbOrder.isPaid = false;
  await dbOrder.save(); 

  // Envía el correo electrónico al administrador con el enlace a la orden
  await sendEmailToAdmin(orderId, mountTotal);

  return res.status(200).json({ message: 'Orden pagada' });
}


export const getDailyOrders = async (req, res) => {
  try {
    const currentDate = new Date();
    const currentDayOfWeek = currentDate.getDay();
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDayOfWeek + 1); // Ajustar al lunes de la semana actual
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(currentDate);
    endOfWeek.setDate(currentDate.getDate() + (6 - currentDayOfWeek + 1)); // Ajustar al domingo de la semana actual
    endOfWeek.setHours(23, 59, 59, 999);

    const weeklyOrders = await orderModel.find({
      createdAt: { $gte: startOfWeek, $lte: endOfWeek }
    });
 

    if (!weeklyOrders || weeklyOrders.length === 0) {
      console.log("No se encontraron pedidos semanales");
      return res.status(404).json({ message: "No se encontraron pedidos semanales" });
    }

    // No es necesario el envoltorio "send" aquí, simplemente envía la respuesta con los pedidos
    res.status(200).json(weeklyOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


 

export const getMonthlyOrders = async (req, res) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);

    const monthlyOrders = await orderModel.find({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth }
    });

    res.status(200).json(monthlyOrders); // Eliminado el envoltorio "send"
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getTopSaleProducts = async (req, res) => {
  try {
    const topSaleProducts = await productModel.find()
      .sort({ sale: -1 }) // Ordena en orden descendente por el valor "sale"
      .limit(8); // Limita los resultados a 8 productos

    res.json(topSaleProducts);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos de mayor venta.' });
  }
} 
  
export const getProductByGender = async (req, res) => {
  const { name } = req.params;

  try {
    const products = await productModel.find({gender: name }).select("-photo");;
    console.log(products)
    if (products.length === 0) {
      return res.status(404).json({ message: 'No se encontraron productos para este género.' });
    }
   
    res.json(products);
  } catch (error) {
    console.error('Error al buscar productos por género:', error);
    res.status(500).json({ message: 'Error del servidor al buscar productos.' });
  }
};


export const getFilteredOrders = async (req, res) => {
  const { dateRange } = req.params;
  
  
  const currentDate = new Date();
  let startDate, endDate;
  
  switch (dateRange) {
    case 'today':
      startDate = new Date(currentDate);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(currentDate);
      endDate.setHours(23, 59, 59, 999);
      break;
    case 'yesterday':
      startDate = new Date(currentDate);
      startDate.setDate(currentDate.getDate() - 1);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(currentDate);
      endDate.setDate(currentDate.getDate() - 1);
      endDate.setHours(23, 59, 59, 999);
      break;
    case 'thisWeek':
      startDate = new Date(currentDate);
      startDate.setDate(currentDate.getDate() - currentDate.getDay());
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(currentDate);
      endDate.setDate(currentDate.getDate() + (6 - currentDate.getDay()));
      endDate.setHours(23, 59, 59, 999);
      break;
    case 'thisMonth':
      startDate = new Date(currentDate);
      startDate.setDate(1); // Primer día del mes
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(currentDate);
      endDate.setMonth(currentDate.getMonth() + 1); // Siguiente mes
      endDate.setDate(0); // Último día del mes anterior (último día del mes actual)
      endDate.setHours(23, 59, 59, 999);
      break;
    case 'thisYear':
      startDate = new Date(currentDate);
      startDate.setMonth(0); // Primer mes del año
      startDate.setDate(1); // Primer día del mes
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(currentDate);
      endDate.setMonth(11); // Último mes del año
      endDate.setDate(31); // Último día del mes
      endDate.setHours(23, 59, 59, 999);
      break;
    default:
      startDate = new Date(0); // Fecha inicial (minValue)
      endDate = new Date(currentDate); // Fecha actual
  }
  

  try {
    const filteredOrders = await orderModel.find({
      createdAt: { $gte: startDate, $lte: endDate }
    }).populate('buyer' ) ; 
    console.log(filteredOrders)
    res.json(filteredOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const getWeeklyOrders = async (req, res) => {
  try {
    const currentDate = new Date();
    const startDate = new Date(currentDate);
    startDate.setDate(currentDate.getDate() - currentDate.getDay());
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(currentDate);
    endDate.setDate(currentDate.getDate() + (6 - currentDate.getDay()));
    endDate.setHours(23, 59, 59, 999);

    const weeklyOrders = await orderModel.find({
      createdAt: { $gte: startDate, $lte: endDate }
    });

    if (!weeklyOrders || weeklyOrders.length === 0) {
      console.log("No se encontraron pedidos semanales");
      return res.status(404).json({ message: "No se encontraron pedidos semanales" });
    }

    res.status(200).json(weeklyOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};