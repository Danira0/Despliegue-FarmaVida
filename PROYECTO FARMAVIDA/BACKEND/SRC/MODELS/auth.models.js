import db from '../CONFIG/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const getAllUsersFromDB = async () => {
    const query = `
      SELECT u.*, r.descripcion AS rol_descripcion 
      FROM usuario u
      JOIN rol r ON u.ROLID_ROL = r.ID_ROL
    `;
    try {
      const [results] = await db.execute(query);
      return results;
    } catch (error) {
      console.error("Error al obtener todos los usuarios:", error);
      throw error;
    }
};

export const getUserByIdFromDB = async (userId) => {
    const query = `
      SELECT u.*, r.descripcion AS rol_descripcion 
      FROM usuario u
      JOIN rol r ON u.ROLID_ROL = r.ID_ROL
      WHERE u.ID_Usuario = ?
    `;
    try {
      const [results] = await db.execute(query, [userId]);
      return results[0] || null;
    } catch (error) {
      console.error("Error al obtener usuario por ID:", error);
      throw error;
    }
};

export const updateUserInDB = async (userId, userData) => {
    const { nombre, apellido, correo, nombre_usuario, ROLID_ROL } = userData;
    const query = `
      UPDATE usuario 
      SET nombre = ?, apellido = ?, correo = ?, nombre_usuario = ?, ROLID_ROL = ?
      WHERE ID_Usuario = ?
    `;
    try {
      const [result] = await db.execute(query, [
        nombre, apellido, correo, nombre_usuario, ROLID_ROL, userId
      ]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      throw error;
    }
};

export const deleteUserFromDB = async (userId) => {
    const query = 'DELETE FROM usuario WHERE ID_Usuario = ?';
    try {
      const [result] = await db.execute(query, [userId]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      throw error;
    }
};

export const createUser = async (userData) => {
  const { nombre, apellido, correo, nombre_usuario, contrasena_usuario, ROLID_ROL } = userData;
  const query = `
    INSERT INTO usuario (nombre, apellido, correo, nombre_usuario, contrasena_usuario, ROLID_ROL, fecha_registro)
    VALUES (?, ?, ?, ?, ?, ?, NOW())`;

  try {
    const [result] = await db.execute(query, [
      nombre, apellido, correo, nombre_usuario, contrasena_usuario, ROLID_ROL
    ]);
    return { id: result.insertId };
  } catch (error) {
    console.error("Error al crear usuario:", error);
    throw error;
  }
};

export const getUserByEmail = async (correo) => {
  const query = 'SELECT * FROM usuario WHERE correo = ?';
  try {
    const [results] = await db.execute(query, [correo]);
    return results[0] || null;
  } catch (error) {
    console.error("Error al buscar usuario por email:", error);
    throw error;
  }
};

export const checkUserExistsByEmail = async (correo) => {
  const query = 'SELECT 1 FROM usuario WHERE correo = ?';
  try {
    const [results] = await db.execute(query, [correo]);
    return results.length > 0;
  } catch (error) {
    console.error("Error al verificar usuario por email:", error);
    throw error;
  }
};

export const findUserByUsername = async (nombre_usuario) => {
    const query = `
      SELECT usuario.*, rol.descripcion AS rol  
      FROM usuario 
      JOIN rol ON usuario.ROLID_ROL = rol.ID_ROL 
      WHERE usuario.nombre_usuario = ?`;
    
    try {
      const [results] = await db.execute(query, [nombre_usuario]);
      return results[0] || null;
    } catch (error) {
      console.error("Error en findUserByUsername:", error);
      throw error;
    }
};

export const verifyPassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = (payload) => {
    return new Promise((resolve, reject) => {
      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' }, (err, token) => {
        if (err) {
          console.error("Error al generar token:", err);
          reject(err);
        } else {
          resolve(token);
        }
      });
    });
};

export const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          console.error("Error al verificar token:", err);
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });
};

export const updateUserApprovalStatus = async (userId, status) => {
    const query = 'UPDATE usuario SET aprobado = ? WHERE ID_Usuario = ?';
    try {
      const [result] = await db.execute(query, [status, userId]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error al actualizar estado de aprobación:", error);
      throw error;
    }
};

export const checkUserApprovalStatus = async (userId) => {
    const query = 'SELECT aprobado FROM usuario WHERE ID_Usuario = ?';
    try {
      const [results] = await db.execute(query, [userId]);
      return results[0]?.aprobado || false;
    } catch (error) {
      console.error("Error al verificar estado de aprobación:", error);
      throw error;
    }
};

export const savePasswordResetToken = async (userId, token, tokenExpires, code = null, codeExpires = null) => {
  const query = `
    UPDATE usuario 
    SET reset_token = ?, 
        reset_token_expires = ?,
        reset_code = ?,
        reset_code_expires = ?
    WHERE ID_Usuario = ?
  `;
  await db.execute(query, [token, tokenExpires, code, codeExpires, userId]);
  return true;
};

export const getUserByResetToken = async (token) => {
  const query = 'SELECT * FROM usuario WHERE reset_token = ? AND reset_token_expires > NOW()';
  const [results] = await db.execute(query, [token]);
  return results[0] || null;
};

export const updateUserPassword = async (userId, hashedPassword) => {
    if (!userId || isNaN(Number(userId))) {
      throw new Error('ID de usuario inválido');
    }
  
    if (!hashedPassword || typeof hashedPassword !== 'string') {
      throw new Error('Hash de contraseña inválido');
    }
  
    const query = 'UPDATE usuario SET contrasena_usuario = ?, reset_token = NULL, reset_token_expires = NULL WHERE ID_Usuario = ?';
    
    try {
      const [result] = await db.execute(query, [hashedPassword, userId]);
      if (result.affectedRows === 0) {
        throw new Error('No se encontró el usuario para actualizar');
      }
      return true;
    } catch (error) {
      console.error("Error al actualizar contraseña:", error);
      throw new Error('Error de base de datos al actualizar la contraseña');
    }
};

/* CREAR ADMI */
export const getAdmi = async () => {
  const query = `
    SELECT u.*, i.imagen_producto as imagen_perfil 
    FROM usuario u
    LEFT JOIN imagen i ON u.ID_Usuario = i.ID_Usuario
    WHERE u.ROLID_ROL = 1
  `;
  const [result] = await db.execute(query);
  return result;
};

export const createAdmi = async ({ nombre, apellido, correo, nombre_usuario, contrasena_usuario, ROLID_ROL }) => {
  if (ROLID_ROL !== 1) {
    throw new Error("Solo se pueden registrar administradores");
  }

  const createUserQuery = `
   INSERT INTO usuario (nombre, apellido, correo, nombre_usuario, contrasena_usuario, ROLID_ROL, fecha_registro)
    VALUES (?, ?, ?, ?, ?, ?, NOW())
  `;

  try {
    const [result] = await db.execute(createUserQuery, [
      nombre, 
      apellido, 
      correo, 
      nombre_usuario, 
      contrasena_usuario, 
      ROLID_ROL
    ]);
    return { usuarioId: result.insertId };
  } catch (error) {
    console.error("Error al crear administrador:", error);
    throw new Error("No se pudo crear el administrador.");
  }
};

export const updateAdmi = async (ID_Usuario, { nombre, apellido, correo, nombre_usuario, contrasena_usuario, ROLID_ROL }) => {
  if (ROLID_ROL !== 1) {
    throw new Error("Solo se pueden actualizar administradores");
  }

  const query = `
    UPDATE usuario 
    SET nombre = ?, apellido = ?, correo = ?, nombre_usuario = ?, contrasena_usuario = ?
    WHERE ID_Usuario = ? AND ROLID_ROL = 1
  `;

  try {
    const [result] = await db.execute(query, [
      nombre, 
      apellido, 
      correo, 
      nombre_usuario, 
      contrasena_usuario, 
      ID_Usuario
    ]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error al actualizar el administrador:", error);
    throw new Error("No se pudo actualizar el administrador.");
  }
};

export const deleteAdmi = async (ID_Usuario) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    
    // 1. Eliminar imágenes relacionadas
    await connection.execute("DELETE FROM imagen WHERE ID_Usuario = ?", [ID_Usuario]);
    await connection.execute(
      "UPDATE movimiento SET UsuarioID_Usuario = NULL WHERE UsuarioID_Usuario = ?", 
      [ID_Usuario]
    );
        
    // 3. Finalmente eliminar el usuario administrador
    const [result] = await connection.execute(
      "DELETE FROM usuario WHERE ID_Usuario = ? AND ROLID_ROL = 1", 
      [ID_Usuario]
    );
    
    await connection.commit();
    connection.release();
    return result.affectedRows > 0;
  } catch (error) {
    await connection.rollback();
    connection.release();
    console.error("Error al eliminar el administrador:", error);
    throw new Error("No se pudo eliminar el administrador.");
  }
};

export const getEmpleadosModel = async () => {
  const query = "SELECT * FROM usuario WHERE ROLID_ROL = 2";
  const [result] = await db.execute(query);
  return result;
};

export const createEmpleModel = async ({
  nombre,
  apellido,
  correo,
  nombre_usuario,
  contrasena_usuario,
  ROLID_ROL
}) => {
  const checkUserQuery = 'SELECT * FROM usuario WHERE correo = ?';
  const [existingUser] = await db.execute(checkUserQuery, [correo]);

  if (existingUser.length > 0) {
    throw new Error('El correo ya está en uso');
  }

  const query = `INSERT INTO usuario 
  (nombre, apellido, correo, nombre_usuario, contrasena_usuario, ROLID_ROL, fecha_registro) 
  VALUES (?, ?, ?, ?, ?, ?, NOW())`;

  const [result] = await db.execute(query, [
    nombre,
    apellido,
    correo,
    nombre_usuario,
    contrasena_usuario,
    ROLID_ROL
  ]);

  return { usuarioId: result.insertId };
};

export const updateEmpleModel = async (ID_Usuario, {
  nombre,
  apellido,
  correo,
  nombre_usuario,
  contrasena_usuario
}) => {
  const query = `UPDATE usuario SET
    nombre = ?,
    apellido = ?,
    correo = ?,
    nombre_usuario = ?,
    contrasena_usuario = ?
    WHERE ID_Usuario = ? AND ROLID_ROL = 2`;

  const [result] = await db.execute(query, [
    nombre,
    apellido,
    correo,
    nombre_usuario,
    contrasena_usuario,
    ID_Usuario
  ]);

  return result.affectedRows > 0;
};

export const deleteEmpleModel = async (ID_Usuario) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    await connection.execute("DELETE FROM imagen WHERE ID_Usuario = ?", [ID_Usuario]);
    await connection.execute(
      "UPDATE movimiento SET UsuarioID_Usuario = NULL WHERE UsuarioID_Usuario = ?", 
      [ID_Usuario]
    );
    
    const [result] = await connection.execute(
      "DELETE FROM usuario WHERE ID_Usuario = ? AND ROLID_ROL = 2", 
      [ID_Usuario]
    );
    
    await connection.commit();
    connection.release();
    return result.affectedRows > 0;
  } catch (error) {
    await connection.rollback();
    connection.release();
    console.error("Error al eliminar el empleado:", error);
    throw new Error("No se pudo eliminar el empleado.");
  }
};