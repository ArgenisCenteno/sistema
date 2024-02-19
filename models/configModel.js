import mongoose from "mongoose";

const configSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    default: "empresa@gmail.com"
  },
  tasa: {
    type: Number,
    default: 0
  },
  telefono: {
    type: String,
    required: true,
    unique: true,
    default: "04149090821"
  },
  banco: {
    type: String,
    required: true,
    unique: true,
   default: "Banco Banco"
  },
  documento: {
    type: String,
    required: true,
    unique: true,
    default: "10301620"
  }, 
});

export default mongoose.model("Configuracion", configSchema);
