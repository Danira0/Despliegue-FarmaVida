import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import {
  createUser as createUserModel,
  getUserByEmail,
  checkUserExistsByEmail,
  findUserByUsername,
  getAllUsersFromDB,
  getUserByIdFromDB,
  updateUserInDB,
  deleteUserFromDB,
  savePasswordResetToken,
  getUserByResetToken,
  updateUserPassword,
  getAdmi as getAdmiModel,
  createAdmi as createAdmiModel,
  updateAdmi as updateAdmiModel,
  deleteAdmi as deleteAdmiModel,
  getEmpleadosModel,
  createEmpleModel,
  updateEmpleModel,
  deleteEmpleModel,
} from "../MODELS/auth.models.js";

const JWT_SECRET = process.env.JWT_SECRET || "jwtsecret";
const EMAIL_USER = process.env.EMAIL_USER || "daniracyber@gmail.com";
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || "qtgw kigb jcsw lpzo";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});

export const getAllUsers = async () => {
  try {
    const users = await getAllUsersFromDB();
    return {
      status: 200,
      data: users,
      message: "Usuarios obtenidos exitosamente",
    };
  } catch (error) {
    throw error;
  }
};

export const getUserById = async (userId) => {
  try {
    const user = await getUserByIdFromDB(userId);
    if (!user) {
      return {
        status: 404,
        message: "Usuario no encontrado",
      };
    }
    return {
      status: 200,
      data: user,
      message: "Usuario obtenido exitosamente",
    };
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const updated = await updateUserInDB(userId, userData);
    if (!updated) {
      return {
        status: 404,
        message: "Usuario no encontrado",
      };
    }
    return {
      status: 200,
      message: "Usuario actualizado exitosamente",
    };
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const deleted = await deleteUserFromDB(userId);
    if (!deleted) {
      return {
        status: 404,
        message: "Usuario no encontrado",
      };
    }
    return {
      status: 200,
      message: "Usuario eliminado exitosamente",
    };
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (userData) => {
  const {
    nombre,
    apellido,
    correo,
    nombre_usuario,
    contrasena_usuario,
    ROLID_ROL,
  } = userData;

  if (
    !nombre ||
    !apellido ||
    !correo ||
    !nombre_usuario ||
    !contrasena_usuario ||
    ![1, 2].includes(Number(ROLID_ROL))
  ) {
    return { status: 400, message: "Campos requeridos faltantes o inválidos" };
  }

  const existingUser = await checkUserExistsByEmail(correo);
  if (existingUser) {
    return { status: 400, message: "El correo ya está en uso" };
  }

  const rolDescripcion = Number(ROLID_ROL) === 1 ? "Administrador" : "Empleado";

  const adminMailOptions = {
    from: `"Farmavida" <${EMAIL_USER}>`,
    to: EMAIL_USER,
    subject: "Nuevo Usuario Registrado - Farmavida",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
        <h2 style="text-align: center; color: #23539E;">Notificación de Registro</h2>
        <p style="font-size: 16px; color: #333;">
          Se ha registrado un nuevo usuario con los siguientes datos:
        </p>
        <ul style="font-size: 16px; color: #333;">
          <li><strong>Nombre:</strong> ${nombre} ${apellido}</li>
          <li><strong>Correo:</strong> ${correo}</li>
          <li><strong>Rol:</strong> ${rolDescripcion}</li>
        </ul>
        <p style="font-size: 16px; color: #333;">
          Por favor, selecciona una opción para aprobar o denegar este registro:
        </p>
        <div style="text-align: center; margin: 20px 0;">
           <a href="http://localhost:4000/api/auth/approve?correo=${correo}&nombre=${nombre}&apellido=${apellido}&nombre_usuario=${nombre_usuario}&ROLID_ROL=${ROLID_ROL}&contrasena_usuario=${contrasena_usuario}" style="margin-right: 10px; text-decoration: none; padding: 10px 20px; background-color: #4CAF50; color: white; border-radius: 5px;">Aprobar</a>
                <a href="http://localhost:4000/api/auth/deny?correo=${correo}" style="text-decoration: none; padding: 10px 20px; background-color: #f44336; color: white; border-radius: 5px;">Denegar</a>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(adminMailOptions);
  return {
    status: 200,
    message: "Notificación enviada al administrador para aprobación.",
  };
};

export const approveUser = async ({
  correo,
  nombre,
  apellido,
  nombre_usuario,
  ROLID_ROL,
  contrasena_usuario,
}) => {
  if (
    !correo ||
    !nombre ||
    !apellido ||
    !nombre_usuario ||
    !ROLID_ROL ||
    !contrasena_usuario
  ) {
    return {
      status: 400,
      message: "Información incompleta para aprobar al usuario.",
    };
  }

  try {
    const hashedPassword = await bcrypt.hash(contrasena_usuario, 10);

    await createUserModel({
      nombre,
      apellido,
      correo,
      nombre_usuario,
      contrasena_usuario: hashedPassword,
      ROLID_ROL,
    });

    const userMailOptions = {
      from: `"Farmavida" <${EMAIL_USER}>`,
      to: correo,
      subject: "Registro Aprobado - Farmavida",
      html: `
        <p>¡Hola!</p>
        <p>Tu registro en Farmavida ha sido aprobado por el administrador. Ahora puedes acceder al sistema.</p>
        <p>Saludos,</p>
        <p>Drogueria Farmavida</p>
      `,
    };

    await transporter.sendMail(userMailOptions);

    return {
      status: 200,
      message: "El usuario ha sido aprobado y notificado.",
    };
  } catch (error) {
    console.error("Error al aprobar al usuario:", error);
    return {
      status: 500,
      message: "Hubo un problema al aprobar al usuario.",
      error: error.message,
    };
  }
};

export const denyUser = async ({ correo }) => {
  try {
    const userMailOptions = {
      from: `"Farmavida" <${EMAIL_USER}>`,
      to: correo,
      subject: "Registro Denegado - Farmavida",
      html: `
        <p>¡Hola!</p>
        <p>Lamentamos informarte que tu registro en Farmavida ha sido denegado.</p>
        <p>Si tienes preguntas, por favor contáctanos.</p>
        <p>Saludos,</p>
        <p>El equipo de Farmavida</p>
      `,
    };

    await transporter.sendMail(userMailOptions);

    return {
      status: 200,
      message: "El usuario ha sido denegado y notificado.",
    };
  } catch (error) {
    console.error("Error al denegar al usuario:", error);
    return {
      status: 500,
      message: "Hubo un problema al denegar al usuario.",
      error: error.message,
    };
  }
};

export const checkApproval = async ({ correo }) => {
  if (!correo) {
    return { status: 400, message: "Correo electrónico es requerido." };
  }

  try {
    const user = await getUserByEmail(correo);
    if (!user) {
      return { status: 404, message: "Usuario no encontrado." };
    }
    return { status: 200, aprobado: user.aprobado };
  } catch (error) {
    console.error("Error al verificar la aprobación del usuario:", error);
    return {
      status: 500,
      message: "Hubo un problema al verificar la aprobación.",
      error: error.message,
    };
  }
};

export const loginUser = async (username, password, requestedRole) => {
  try {
    const usuario = await findUserByUsername(username);

    if (!usuario) {
      return { status: 404, message: "Usuario no encontrado." };
    }

    if (Number(requestedRole) !== usuario.ROLID_ROL) {
      return {
        status: 403,
        message: "No tienes permiso para acceder con este rol.",
      };
    }

    const passwordMatch = await bcrypt.compare(
      password,
      usuario.contrasena_usuario
    );

    if (!passwordMatch) {
      return { status: 401, message: "Contraseña incorrecta." };
    }

    const payload = {
      usuarioId: usuario.ID_Usuario,
      nombre: usuario.nombre,
      rol: usuario.rol,
      rolId: usuario.ROLID_ROL,
    };

    const token = await jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });

    return {
      status: 200,
      message: "Login exitoso.",
      token,
      user: {
        id: usuario.ID_Usuario,
        nombre: usuario.nombre,
        rol: usuario.rol,
        rolId: usuario.ROLID_ROL,
      },
    };
  } catch (error) {
    console.error("Error en loginUser:", error);
    throw error;
  }
};

export const logoutUser = (res) => {
  res.cookie("token", "", {
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
};

export const requestPasswordResetService = async (correo) => {
  if (!correo) {
    return { status: 400, message: "El correo electrónico es requerido." };
  }

  try {
    const user = await getUserByEmail(correo);

    if (!user) {
      return {
        status: 200,
        message:
          "Si el correo existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña.",
      };
    }

    // Generar token con propósito específico
    const resetToken = jwt.sign(
      { userId: user.ID_Usuario, purpose: "password_reset" },
      JWT_SECRET,
      { expiresIn: "30m" }
    );

    // Generar código de verificación
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const expirationDate = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos

    // Guardar en la base de datos
    await savePasswordResetToken(
      user.ID_Usuario,
      resetToken,
      expirationDate,
      verificationCode,
      expirationDate
    );

    const mailOptions = {
      from: "Farmavida <${EMAIL_USER}>",
      to: user.correo,
      subject: "Restablecimiento de Contraseña - Farmavida",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
          <h2 style="text-align: center; color: #23539E;">Restablecer Contraseña</h2>
          <p style="font-size: 16px; color: #333;">
            Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.
          </p>
          <p style="font-size: 16px; color: #333;">
            Utiliza el siguiente código de verificación para continuar con el proceso:
          </p>
          <div style="text-align: center; margin: 20px 0; font-size: 24px; font-weight: bold; color: #23539E;">
            ${verificationCode}
          </div>
          <p style="font-size: 14px; color: #777;">
            Este código expirará en 30 minutos. Si no solicitaste este cambio, por favor ignora este mensaje.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return {
      status: 200,
      message:
        "Se ha enviado un código de verificación a tu correo electrónico.",
      token: resetToken,
    };
  } catch (error) {
    console.error("Error en requestPasswordResetService:", error);
    throw error;
  }
};

export const verifyResetCodeService = async (token, code) => {
  if (!token || !code) {
    return { status: 400, message: "Token y código son requeridos." };
  }

  try {
    const user = await getUserByResetToken(token);
    if (!user) {
      return { status: 400, message: "Token inválido o expirado." };
    }

    if (user.reset_code !== code) {
      return { status: 400, message: "Código de verificación incorrecto." };
    }

    if (new Date(user.reset_code_expires) < new Date()) {
      return { status: 400, message: "El código de verificación ha expirado." };
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const passwordResetToken = jwt.sign(
      { userId: user.ID_Usuario, purpose: "password_reset" },
      JWT_SECRET,
      { expiresIn: "30m" }
    );

    const newExpiration = new Date(Date.now() + 30 * 60 * 1000);
    await savePasswordResetToken(
      user.ID_Usuario,
      passwordResetToken,
      newExpiration,
      null,
      null
    );

    return {
      status: 200,
      message: "Código verificado correctamente.",
      resetToken: passwordResetToken,
    };
  } catch (error) {
    console.error("Error en verifyResetCodeService:", error);

    if (error.name === "TokenExpiredError") {
      return {
        status: 400,
        message: "El token ha expirado. Por favor, solicita un nuevo código.",
      };
    }

    if (error.name === "JsonWebTokenError") {
      return { status: 400, message: "Token inválido." };
    }

    throw error;
  }
};

export const resetPasswordService = async (token, newPassword) => {
  try {
    if (!token || typeof token !== "string" || token.trim() === "") {
      return { status: 400, message: "Token inválido." };
    }

    if (
      !newPassword ||
      typeof newPassword !== "string" ||
      newPassword.trim().length < 8
    ) {
      return {
        status: 400,
        message: "La nueva contraseña debe tener al menos 8 caracteres.",
      };
    }

    // Verificar el token en la base de datos primero
    const user = await getUserByResetToken(token);
    if (!user) {
      return { status: 400, message: "Token inválido o expirado." };
    }

    // Luego verificar la firma JWT
    const decoded = jwt.verify(token, JWT_SECRET);

    // Validar que el token sea específico para reinicio de contraseña
    if (decoded.purpose !== "password_reset") {
      return {
        status: 400,
        message: "Token no autorizado para esta operación.",
      };
    }

    // Validar que la nueva contraseña sea diferente
    const isSamePassword = await bcrypt.compare(
      newPassword,
      user.contrasena_usuario
    );
    if (isSamePassword) {
      return {
        status: 400,
        message: "La nueva contraseña no puede ser igual a la anterior.",
      };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar la contraseña
    const updated = await updateUserPassword(user.ID_Usuario, hashedPassword);
    if (!updated) {
      throw new Error(
        "No se pudo actualizar la contraseña en la base de datos"
      );
    }

    return { status: 200, message: "Contraseña actualizada exitosamente." };
  } catch (error) {
    console.error("Error en resetPasswordService:", error);

    if (error.name === "TokenExpiredError") {
      return {
        status: 400,
        message: "El token ha expirado. Por favor, solicita un nuevo código.",
      };
    }

    if (error.name === "JsonWebTokenError") {
      return { status: 400, message: "Token inválido." };
    }
    throw error;
  }
};

/* CREAR ADMINISTRADOR */
export const getAdmi = async () => {
  try {
    const result = await getAdmiModel();
    return result;
  } catch (error) {
    console.error("Error en el servicio al obtener administradores:", error);
    throw error;
  }
};

export const createAdmi = async ({
  nombre,
  apellido,
  correo,
  nombre_usuario,
  contrasena_usuario,
  ROLID_ROL,
  imagen,
}) => {
  try {
    if (
      !nombre ||
      !apellido ||
      !correo ||
      !nombre_usuario ||
      !contrasena_usuario ||
      ROLID_ROL !== 1
    ) {
      throw new Error(
        "Todos los campos son obligatorios y el rol debe ser Administrador"
      );
    }

    const hashedPassword = await bcrypt.hash(contrasena_usuario, 10);
    const { usuarioId } = await createAdmiModel({
      nombre,
      apellido,
      correo,
      nombre_usuario,
      contrasena_usuario: hashedPassword,
      ROLID_ROL,
    });

    if (imagen) {
      await handleAdmiImage(usuarioId, imagen, nombre, apellido);
    }

    return {
      message: "Administrador creado correctamente",
      usuarioId,
    };
  } catch (error) {
    console.error("Error en el servicio al crear administrador:", error);
    throw error;
  }
};

export const updateAdmi = async (
  id,
  {
    nombre,
    apellido,
    correo,
    nombre_usuario,
    contrasena_usuario,
    ROLID_ROL,
    imagen,
  }
) => {
  try {
    if (
      !nombre ||
      !apellido ||
      !correo ||
      !nombre_usuario ||
      !contrasena_usuario ||
      ROLID_ROL !== 1
    ) {
      throw new Error(
        "Todos los campos son obligatorios y el rol debe ser Administrador"
      );
    }

    const hashedPassword = await bcrypt.hash(contrasena_usuario, 10);
    const updated = await updateAdmiModel(id, {
      nombre,
      apellido,
      correo,
      nombre_usuario,
      contrasena_usuario: hashedPassword,
      ROLID_ROL,
    });

    if (!updated) {
      throw new Error("Error al actualizar datos del Administrador");
    }

    if (imagen) {
      await handleAdmiImage(id, imagen, nombre, apellido);
    }

    return { message: "Administrador actualizado exitosamente" };
  } catch (error) {
    console.error("Error en el servicio al actualizar administrador:", error);
    throw error;
  }
};

export const deleteAdmi = async (id) => {
  try {
    if (!id) {
      throw new Error("El ID es obligatorio");
    }

    const deleted = await deleteAdmiModel(id);
    if (!deleted) {
      throw new Error("Error al eliminar el Administrador");
    }

    return { message: "Administrador eliminado exitosamente" };
  } catch (error) {
    console.error("Error en el servicio al eliminar administrador:", error);
    throw error;
  }
};

export const getEmpleadosService = async () => {
  try {
    const result = await getEmpleadosModel();
    return result;
  } catch (error) {
    console.error("Error en el servicio al obtener empleados:", error);
    throw error;
  }
};

export const createEmpleService = async ({
  nombre,
  apellido,
  correo,
  nombre_usuario,
  contrasena_usuario,
  ROLID_ROL,
}) => {
  try {
    if (
      !nombre ||
      !apellido ||
      !correo ||
      !nombre_usuario ||
      !contrasena_usuario
    ) {
      throw new Error("Todos los campos son obligatorios");
    }

    if (ROLID_ROL !== 2) {
      throw new Error("Solo se pueden registrar empleados");
    }

    const hashedPassword = await bcrypt.hash(contrasena_usuario, 10);
    const { usuarioId } = await createEmpleModel({
      nombre,
      apellido,
      correo,
      nombre_usuario,
      contrasena_usuario: hashedPassword,
      ROLID_ROL,
    });

    return {
      message: "Empleado creado correctamente",
      usuarioId,
    };
  } catch (error) {
    console.error("Error en el servicio al crear empleado:", error);
    throw error;
  }
};

export const updateEmpleService = async (
  id,
  { nombre, apellido, correo, nombre_usuario, contrasena_usuario }
) => {
  try {
    if (
      !nombre ||
      !apellido ||
      !correo ||
      !nombre_usuario ||
      !contrasena_usuario
    ) {
      throw new Error("Todos los campos son obligatorios");
    }

    const hashedPassword = await bcrypt.hash(contrasena_usuario, 10);
    const updated = await updateEmpleModel(id, {
      nombre,
      apellido,
      correo,
      nombre_usuario,
      contrasena_usuario: hashedPassword,
    });

    if (!updated) {
      throw new Error("Error al actualizar datos del empleado");
    }

    return { message: "Empleado actualizado exitosamente" };
  } catch (error) {
    console.error("Error en el servicio al actualizar empleado:", error);
    throw error;
  }
};

export const deleteEmpleService = async (id) => {
  try {
    if (!id) {
      throw new Error("El ID es obligatorio");
    }

    const deleted = await deleteEmpleModel(id);
    if (!deleted) {
      throw new Error("Error al eliminar el Empleado");
    }

    return { message: "Empleado eliminado exitosamente" };
  } catch (error) {
    console.error("Error en el servicio al eliminar empleado:", error);
    throw error;
  }
};
