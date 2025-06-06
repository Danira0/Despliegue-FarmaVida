import db from '../CONFIG/db.js';

export const getProveedores = async () => {
    const query = `
        SELECT l.*, i.imagen_producto 
        FROM laboratorio l
        LEFT JOIN imagen i ON l.ID_Laboratorio = i.ID_Laboratorio
    `;
    const [results] = await db.promise().execute(query);
    return results;
};

export const getProveedorById = async (ID_Laboratorio) => {
    const query = `
        SELECT l.*, i.imagen_producto 
        FROM laboratorio l
        LEFT JOIN imagen i ON l.ID_Laboratorio = i.ID_Laboratorio
        WHERE l.ID_Laboratorio = ?
    `;
    const [results] = await db.promise().execute(query, [ID_Laboratorio]);
    return results.length > 0 ? results[0] : null;
};

export const createProveedor = async (proveedor) => {
    const { nombre, direccion, ciudad, telefono, correo_electronico, pagina_web } = proveedor;
    const query = `
        INSERT INTO laboratorio 
        (nombre, direccion, ciudad, telefono, correo_electronico, pagina_web) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.promise().execute(query, 
        [nombre, direccion, ciudad, telefono, correo_electronico, pagina_web]);
    return result.insertId;
};

export const updateProveedor = async (ID_Laboratorio, proveedor) => {
    const { nombre, direccion, ciudad, telefono, correo_electronico, pagina_web } = proveedor;
    const query = `
        UPDATE laboratorio 
        SET nombre = ?, direccion = ?, ciudad = ?, telefono = ?, 
            correo_electronico = ?, pagina_web = ? 
        WHERE ID_Laboratorio = ?
    `;
    const [result] = await db.promise().execute(query, 
        [nombre, direccion, ciudad, telefono, correo_electronico, pagina_web, ID_Laboratorio]);
    return result.affectedRows;
};

export const deleteProveedor = async (ID_Laboratorio) => {
    try {
        await db.promise().execute(
            'DELETE FROM imagen WHERE ID_Laboratorio = ?',
            [ID_Laboratorio]
        );
        
        await db.promise().execute(
            'UPDATE producto SET LaboratorioID_Laboratorio = NULL WHERE LaboratorioID_Laboratorio = ?',
            [ID_Laboratorio]
        );
        
        const query = 'DELETE FROM laboratorio WHERE ID_Laboratorio = ?';
        const [result] = await db.promise().execute(query, [ID_Laboratorio]);
        
        return result.affectedRows;
    } catch (error) {
        throw error;
    }
};
