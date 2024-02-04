import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import categoryModel from "../models/categoryModel.js";
import productModel from "../models/productModel.js";

import { comparePassword, hashPassword } from "./../helpers/authHelper.js";
import JWT from "jsonwebtoken";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt"

//REGISTRAR USUARIO
export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;
    //VALIDAR CAMPOS
    if (!name) {
      return res.send({ error: "Nombre es requerido" });
    }
    if (!email) {
      return res.send({ message: "Email es requerido" });
    }
    if (!password) {
      return res.send({ message: "Clave es requerida" });
    }
    if (!phone) {
      return res.send({ message: "Telefono es requerido" });
    }
    if (!address) {
      return res.send({ message: "Dirección es requerida" });
    }
     
    //VALIDAR USUARIO
    const exisitingUser = await userModel.findOne({ email });
    //CONSULTAR SI ESTE USUARIO YA EXISTE
    if (exisitingUser) {
      return res.status(200).send({
        success: false,
        message: "Este usuario ya está registrado",
      });
    }
    //ENCRIPTAR CONTRASEÑA
    const hashedPassword = await hashPassword(password);
    //GUARDAR
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword, 
    }).save();

    res.status(201).send({
      success: true,
      message: "Usuario registrado correctamente",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error al registrar",
      error,
    });
  }
};

//INICIAR SESIÓN
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //VALIDAR QUE LOS CAMPOS NO VENGAN VACÍOS
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Email o contraseña invalida",
      });
    }
    //CONSULTAR SI EL USUARIO EXISTE 
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email o contraseña invalida",
      });
    }

    //Comparar contraseña
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Clave invalida",
      });
    }
    //GENERAR TOKEN
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "Inicio de sesión",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

export const updatePasswordController = async (req, res) => {
  try {
    const { email, password, currentPassword } = req.body;

    // Verificar que exista un usuario con ese email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Verificar que la contraseña actual sea correcta
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Contraseña actual incorrecta" });
    }

     
    // Encriptar la nueva contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Actualizar la contraseña en la base de datos
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Contraseña actualizada correctamente",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Ha ocurrido un error al actualizar la contraseña" });
  }
};

//TEST DE PRUEBA
export const testController = (req, res) => {
  try {
    res.send("Protección de ruta");
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};

//ACTUALIZAR PERFIL
export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await userModel.findById(req.user._id);
    //CONTRASEÑA
    if (password && password.length < 6) {
      return res.json({ error: "La clave debe tener más de 6 caracteres" });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Perfil actualizado correctamente",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error al actualizar perfil",
      error,
    });
  }
};

//OBTENER ORDEN
export const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name email phone") 
      .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error al traer ordenes",
      error,
    });
  }
};

//OBTENER UNA ORDEN POR ID
export const getOrderByIdController = async (req, res) =>{
  try {
    const order = await orderModel.findOne({ _id: req.params.id }); 
    res.status(200).send({
      success: true,
      message: "Orden por ID",
      order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error al traer la orden",
      error,
    });
  }
}

//OBNERER ORDENES
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name email phone" ) 
      .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error al traer ordenes", 
      error,
    });
  }
};

//ESTADO DE LA ORDEN
export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updateing Order",
      error,
    });
  }
};

//ESTADO DE PAGO DE LA ORDEN
export const orderStatusPaidController = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    // Realizamos una actualización directa en la base de datos para establecer isPaid como true
    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { isPaid: true },
      { new: true }
    );
    
    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Orden no encontrada",
      });
    }

    res.json({
      success: true,
      message: "El estado de pago de la orden ha sido actualizado a 'Pagada'",
      order: updatedOrder,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar el estado de pago de la orden",
      error,
    });
  }
}; 

export const getAllUsersController = async (req, res) => {
  try {
    const users = await userModel.find({}).select("-password");
    res.json({
      success: true,
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error al obtener la lista de usuarios",
      error,
    });
  }
};
 
export const getTotalProductsController = async (req, res) => {
  try {
    const total = await productModel.countDocuments();
    res.json({ total });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while fetching total products",
      error,
    });
  }
};
 
   
export const getTotalCategoriesController = async (req, res) => {
  try {
    const total = await categoryModel.countDocuments();
    res.json({ total });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while fetching total categories",
      error,
    });
  }
};

export const getTotalUsersController = async (req, res) => {
  try {
    const total = await userModel.countDocuments();
    res.json({ total });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while fetching total users",
      error,
    });
  }
};

export const getTotalOrders = async (req, res) => {
  try {
    const total = await orderModel.countDocuments();
    res.json({ total });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while fetching total orders",
      error,
    });
  }
};

export const validateToken = async (req, res) => {
  const { token } = req.body;
  try {
    // Verificar el token con la misma clave secreta que se utilizó para firmarlo
    const decodedToken = JWT.verify(token, process.env.JWT_SECRET);

    // El token es válido
    res.json({ success: true });
  } catch (error) {
    // El token no es válido o ha expirado
    res.json({ success: false });
  }
  
};

export const forgoutPasswordController = async (req, res) => {
  const { email } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(404).send({
      success: false,
      message: "Email no registrado",
    });
  }else{
    // Crear el token JWT con un tiempo de expiración (por ejemplo, 1 hora)
  const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });

  // Configurar el transporte de nodemailer
  const transporter = nodemailer.createTransport({
    // Configura aquí el servicio de correo que utilizarás (por ejemplo, Gmail)
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true para SSL 
    auth: {
      user:  process.env.EMAIL_SMTP ,
      pass: process.env.PASSWORD_EMAIL_SMTP,
    },
  });

  // URL del enlace para resetear la contraseña, debes definir esta ruta en tu servidor
  const resetPasswordLink = `https://blanca-sanchez.hop.sh/new-password/${token}`;

  // Enviar el correo con el enlace de reseteo de contraseña
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_SMTP,
      to: email,
      subject: "Cambiar clave",
      html: `<p>Click <a href="${resetPasswordLink}">aquí</a> para cambiar clave. Este enlace expira en 15 minutos, no se puede usar luego de 
      transcurrido ese tiempo.</p>`,
    });
    res.json({ success: true, message: "Enlace de recuperación de clave enviado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to send reset password link." });
  }
  }

};

export const resetPasswordController = async (req, res) => {
  const { token, password } = req.body;

  // Verificar el token con el mismo secreto utilizado para firmarlo en el controlador 'validateToken'
  try {
    const decodedToken = JWT.verify(token, process.env.JWT_SECRET);

    // El token es válido, podemos obtener el ID del usuario desde el token decodificado
    const userId = decodedToken._id;

    // Buscar al usuario por su ID
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    // Hashear la nueva contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Actualizar la contraseña del usuario en la base de datos
    user.password = hashedPassword; 
    await user.save();

    res.status(200).json({
      success: true,
      message: "Contraseña actualizada correctamente",
    });
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      // El token no es válido
      return res.status(400).json({
        success: false,
        message: "Token inválido o expirado",
      });
    }

    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar la contraseña",
      error,
    });
  }
};
