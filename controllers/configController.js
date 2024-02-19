import configModel from "../models/configModel.js";


export const createConfigSystem = async(req, res) =>{
    try {

        const {email, telefono, tasa, banco, documento } = req.fields;
        console.log(email, telefono, tasa, banco, documento )

        const config = await new configModel({ 
            tasa: tasa,
            email: email,
            telefono: telefono,
            banco: banco,
            documento: documento
        }).save()

        res.status(201).send({
            success: true,
            message: "Configuración generada correctamente",
            config,
          });
        
    } catch (error) {

        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error al crear configuracion",
          });        
    }
}
export const updateConfigSystem = async (req, res) => {
  try {
      // Extraer los datos del cuerpo de la solicitud
      const { email, telefono, tasa, banco, documento } = req.fields;

      // Buscar la configuración existente en la base de datos por algún identificador único
      const existingConfig = await configModel.findOne({});

      if (!existingConfig) {
          return res.status(404).send({
              success: false,
              message: "No se encontró ninguna configuración existente en la base de datos",
          });
      }

      // Actualizar los campos de la configuración existente con los nuevos valores
      existingConfig.email = email;
      existingConfig.telefono = telefono;
      existingConfig.tasa = tasa;
      existingConfig.banco = banco;
      existingConfig.documento = documento;

      // Guardar los cambios actualizados en la base de datos
      const updatedConfig = await existingConfig.save();

      // Enviar una respuesta exitosa con los detalles de la configuración actualizada
      res.status(200).send({
          success: true,
          message: "Configuración actualizada correctamente",
          config: updatedConfig,
      });
  } catch (error) {
      // Manejar cualquier error que ocurra durante el proceso de actualización
      console.log(error);
      res.status(500).send({
          success: false,
          error,
          message: "Error al actualizar la configuración",
      });
  }
};
export const getConfigSystem = async (req, res) => {
  try {
      // Buscar la configuración existente en la base de datos
      const existingConfig = await configModel.findOne({});

      if (!existingConfig) {
          return res.status(404).send({
              success: false,
              message: "No se encontró ninguna configuración existente en la base de datos",
          });
      }

      // Enviar una respuesta exitosa con los detalles de la configuración encontrada
      res.status(200).send({
          success: true,
          message: "Configuración encontrada correctamente",
          config: existingConfig,
      });
  } catch (error) {
      // Manejar cualquier error que ocurra durante el proceso de búsqueda
      console.log(error);
      res.status(500).send({
          success: false,
          error,
          message: "Error al obtener la configuración",
      });
  }
};