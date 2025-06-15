import {
  registerUser, approveUser, denyUser, checkApproval, loginUser, logoutUser,
  getAllUsers, getUserById, updateUser, deleteUser,
  requestPasswordResetService, verifyResetCodeService, resetPasswordService,
  getAdmi as getAdmiService, createAdmi as createAdmiService,
  updateAdmi as updateAdmiService, deleteAdmi as deleteAdmiService,
  getEmpleadosService, createEmpleService, updateEmpleService, deleteEmpleService
} from '../SERVICES/auth.service.js';

export const getUsers = async (req, res) => {
  try {
    const result = await getAllUsers();
    res.status(result.status).json(result);
  } catch (error) {
    res.status(500).json({ 
      message: 'Hubo un problema al obtener los usuarios.', 
      error: error.message 
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await getUserById(id);
    res.status(result.status).json(result);
  } catch (error) {
    res.status(500).json({ 
      message: 'Hubo un problema al obtener el usuario.', 
      error: error.message 
    });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await updateUser(id, req.body);
    res.status(result.status).json(result);
  } catch (error) {
    res.status(500).json({ 
      message: 'Hubo un problema al actualizar el usuario.', 
      error: error.message 
    });
  }
};

export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteUser(id);
    res.status(result.status).json(result);
  } catch (error) {
    res.status(500).json({ 
      message: 'Hubo un problema al eliminar el usuario.', 
      error: error.message 
    });
  }
};

export const register = async (req, res) => {
  try {
    const result = await registerUser(req.body);
    res.status(result.status).json(result);
  } catch (error) {
    res.status(500).json({ 
      message: 'Hubo un problema al procesar la solicitud.', 
      error: error.message 
    });
  }
};

export const approve = async (req, res) => {
  try {
    const result = await approveUser(req.query);
    res.status(result.status).json(result);
  } catch (error) {
    res.status(500).json({ 
      message: 'Hubo un problema al aprobar al usuario.', 
      error: error.message 
    });
  }
};

export const deny = async (req, res) => {
  try {
    const result = await denyUser(req.query);
    res.status(result.status).json(result);
  } catch (error) {
    res.status(500).json({ 
      message: 'Hubo un problema al denegar al usuario.', 
      error: error.message 
    });
  }
};

export const checkUserApproval = async (req, res) => {
  try {
    const result = await checkApproval(req.query);
    res.status(result.status).json(result);
  } catch (error) {
    res.status(500).json({ 
      message: 'Hubo un problema al verificar la aprobación.', 
      error: error.message 
    });
  }
};

export const login = async (req, res) => {
  try {
    const { nombre_usuario, contrasena_usuario, requestedRole } = req.body;
    
    if (!nombre_usuario || !contrasena_usuario || !requestedRole) {
      return res.status(400).json({ 
        message: 'Nombre de usuario, contraseña y rol son requeridos.' 
      });
    }

    const result = await loginUser(nombre_usuario, contrasena_usuario, requestedRole);
    
    if (result.token) {
      res.cookie('token', result.token, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
    }
    
    res.status(result.status).json(result);
  } catch (error) {
    res.status(500).json({ 
      message: 'Hubo un problema al procesar la solicitud.', 
      error: error.message 
    });
  }
};

export const logout = (req, res) => {
  try {
    logoutUser(res);
    res.status(200).json({ message: 'Sesión cerrada exitosamente.' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Hubo un problema al cerrar la sesión.', 
      error: error.message 
    });
  }
};

export const requestPasswordReset = async (req, res) => {
  try {
    const { correo } = req.body;
    const result = await requestPasswordResetService(correo);
    res.status(result.status).json(result);
  } catch (error) {
    console.error('Error en requestPasswordReset:', error);
    res.status(500).json({ 
      message: 'Hubo un problema al procesar tu solicitud.', 
      error: error.message 
    });
  }
};

export const verifyResetCode = async (req, res) => {
  try {
    const { token, code } = req.body;
    const result = await verifyResetCodeService(token, code);
    res.status(result.status).json(result);
  } catch (error) {
    console.error('Error en verifyResetCode:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'El token ha expirado. Por favor, solicita un nuevo código.' });
    }
    res.status(500).json({ 
      message: 'Hubo un problema al verificar el código.', 
      error: error.message 
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || typeof newPassword !== 'string' || newPassword.trim().length < 8) {
      return res.status(400).json({ 
        message: 'Se requiere un token válido y una nueva contraseña de al menos 8 caracteres.' 
      });
    }

    const result = await resetPasswordService(token, newPassword.trim());
    
    if (result.status === 200) {
      return res.status(200).json({
        message: 'Contraseña actualizada exitosamente.'
      });
    }
    
    res.status(result.status).json(result);
  } catch (error) {
    console.error('Error en resetPassword:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'El token ha expirado. Por favor, solicita un nuevo código.' });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({ message: 'Token inválido o mal formado.' });
    }
    
    res.status(500).json({ 
      message: 'Hubo un problema al actualizar la contraseña.', 
      error: error.message 
    });
  }
};

/*Gestion de Administrador */
export const getAdmi = async (req, res) => {
  try {
    const result = await getAdmiService();
    res.status(200).json(result); 
  } catch (error) {
    console.error("Error al obtener el Administrador", error);
    res.status(500).json({
      message: "Error al obtener el Administrador",
      error: error.message,
    });
  }
};

export const createAdmi = async (req, res) => {
  try {
    const { nombre, apellido, correo, nombre_usuario, contrasena_usuario, ROLID_ROL } = req.body;
    const imagen = req.file;
    
    const result = await createAdmiService({
      nombre, 
      apellido, 
      correo, 
      nombre_usuario, 
      contrasena_usuario, 
      ROLID_ROL,
      imagen
    });
    
    res.status(201).json(result);
  } catch (error) {
    console.error("Error al crear el Administrador:", error);
    res.status(500).json({ 
      message: "Error al crear al Administrador", 
      error: error.message 
    });
  }
};

export const updateAdmi = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, correo, nombre_usuario, contrasena_usuario, ROLID_ROL } = req.body;
    const imagen = req.file;
    
    const result = await updateAdmiService(id, {
      nombre, 
      apellido, 
      correo, 
      nombre_usuario, 
      contrasena_usuario, 
      ROLID_ROL,
      imagen
    });
    
    res.status(200).json(result);
  } catch (error) {
    console.error("Error al actualizar el Administrador:", error);
    res.status(500).json({ 
      message: "Error al actualizar el Administrador", 
      error: error.message 
    });
  }
};

export const deleteAdmi = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteAdmiService(id);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error al eliminar el Administrador:", error);
    res.status(500).json({ 
      message: "Error al eliminar el Administrador", 
      error: error.message 
    });
  }
};

/* Gestion de Usuario Empleado */

export const getEmpleados = async (req, res) => {
  try {
    const result = await getEmpleadosService();
    res.status(200).json(result);
  } catch (error) {
    console.error("Error al obtener el Empleado", error);
    res.status(500).json({ error: error.message });
  }
};

export const createEmple = async (req, res) => {
  const { nombre, apellido, correo, nombre_usuario, contrasena_usuario, ROLID_ROL } = req.body;
  
  try {
    const result = await createEmpleService({
      nombre,
      apellido,
      correo,
      nombre_usuario,
      contrasena_usuario,
      ROLID_ROL
    });
    res.status(201).json(result);
  } catch (error) {
    console.error("Error al crear el Empleado:", error);
    res.status(500).json({ 
      message: "Error al crear el Empleado", 
      error: error.message 
    });
  }
};

export const updateEmple = async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, correo, nombre_usuario, contrasena_usuario } = req.body;

  try {
    const result = await updateEmpleService(id, {
      nombre,
      apellido,
      correo,
      nombre_usuario,
      contrasena_usuario
    });
    res.status(200).json(result);
  } catch (error) {
    console.error("Error al actualizar el Empleado:", error);
    res.status(500).json({ 
      message: "Error al actualizar el Empleado", 
      error: error.message 
    });
  }
};

export const deleteEmple = async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await deleteEmpleService(id);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error al eliminar el Empleado:", error);
    res.status(500).json({ 
      message: "Error al eliminar el Empleado", 
      error: error.message 
    });
  }
};

