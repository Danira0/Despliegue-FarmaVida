import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "jwtsecret";


export const authRequired = (req, res, next) => {
  // Obtener el token de múltiples fuentes
  const token = 
    req.cookies?.token || 
    req.headers['authorization']?.split(' ')[1] || 
    req.body?.token ||
    req.query?.token;

  if (!token) {
    console.log('[AUTH] No token found in request');
    return res.status(401).json({ 
      success: false,
      message: "Acceso denegado: Token no proporcionado" 
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Verificar estructura básica del payload
    if (!decoded.usuarioId && !decoded.ID_Usuario) {
      throw new Error("Token inválido: Falta identificación de usuario");
    }

    req.user = {
      ID_Usuario: decoded.usuarioId || decoded.ID_Usuario,
      ROLID_ROL: decoded.ROLID_ROL || decoded.rolId || decoded.roleId,
      email: decoded.email,
      nombre_usuario: decoded.nombre_usuario,
    };

    console.log(`[AUTH] Usuario autenticado: ${req.user.ID_Usuario} Rol: ${req.user.ROLID_ROL}`);
    next();
  } catch (error) {
    console.error('[AUTH] Error de verificación de token:', error.message);
    
    let status = 401;
    let message = "Token inválido";

    if (error.name === 'TokenExpiredError') {
      status = 403;
      message = "Token expirado";
    } else if (error.name === 'JsonWebTokenError') {
      message = "Token malformado";
    }

    return res.status(status).json({ 
      success: false,
      message: `Error de autenticación: ${message}`,
      error: error.message 
    });
  }
};

export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Usuario no autenticado"
    });
  }

  if (req.user.ROLID_ROL === 1) {
    console.log(`[AUTH] Acceso admin concedido a: ${req.user.ID_Usuario}`);
    return next();
  }

  console.warn(`[AUTH] Intento de acceso admin no autorizado. Usuario: ${req.user.ID_Usuario} Rol: ${req.user.ROLID_ROL}`);
  res.status(403).json({ 
    success: false,
    message: "Acceso denegado: Se requiere rol de administrador",
    requiredRole: 1,
    currentRole: req.user.ROLID_ROL
  });
};

/**
 * Middleware para verificar rol de empleado (ROLID_ROL = 2)
 */
export const isEmployee = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Usuario no autenticado"
    });
  }

  if (req.user.ROLID_ROL === 2) {
    console.log(`[AUTH] Acceso empleado concedido a: ${req.user.ID_Usuario}`);
    return next();
  }

  console.warn(`[AUTH] Intento de acceso empleado no autorizado. Usuario: ${req.user.ID_Usuario} Rol: ${req.user.ROLID_ROL}`);
  res.status(403).json({ 
    success: false,
    message: "Acceso denegado: Se requiere rol de empleado",
    requiredRole: 2,
    currentRole: req.user.ROLID_ROL
  });
};

/**
 * Middleware para verificar admin o empleado (ROLID_ROL = 1 o 2)
 */
export const isAdminOrEmployee = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Usuario no autenticado"
    });
  }

  if ([1, 2].includes(req.user.ROLID_ROL)) {
    console.log(`[AUTH] Acceso concedido (admin/empleado) a: ${req.user.ID_Usuario}`);
    return next();
  }

  console.warn(`[AUTH] Intento de acceso no autorizado. Usuario: ${req.user.ID_Usuario} Rol: ${req.user.ROLID_ROL}`);
  res.status(403).json({ 
    success: false,
    message: "Acceso denegado: Se requiere rol de administrador o empleado",
    requiredRoles: [1, 2],
    currentRole: req.user.ROLID_ROL
  });
};

/**
 * Middleware para verificar roles personalizados
 * @param {number[]} allowedRoles - Array de roles permitidos
 */
export const checkRoles = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Usuario no autenticado"
      });
    }

    if (allowedRoles.includes(req.user.ROLID_ROL)) {
      console.log(`[AUTH] Acceso concedido para roles ${allowedRoles} a: ${req.user.ID_Usuario}`);
      return next();
    }

    console.warn(`[AUTH] Intento de acceso no autorizado. Usuario: ${req.user.ID_Usuario} Rol: ${req.user.ROLID_ROL}`);
    res.status(403).json({ 
      success: false,
      message: `Acceso denegado: Se requiere uno de estos roles: ${allowedRoles.join(', ')}`,
      requiredRoles: allowedRoles,
      currentRole: req.user.ROLID_ROL
    });
  };
};