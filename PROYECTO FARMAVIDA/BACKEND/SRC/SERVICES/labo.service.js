import db from '../CONFIG/db.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { 
    getProveedores as getProveedoresModel,
    getProveedorById as getProveedorByIdModel,
    createProveedor as createProveedorModel,
    updateProveedor as updateProveedorModel,
    deleteProveedor as deleteProveedorModel
} from '../MODELS/labo.models.js';


const __dirname = path.dirname(fileURLToPath(import.meta.url));


export const getProveedores = async () => {
    return await getProveedoresModel();
};

export const getProveedorById = async (id) => {
    if (!id) throw new Error('ID es obligatorio');
    const proveedor = await getProveedorByIdModel(id);
    if (!proveedor) throw new Error('Proveedor no encontrado');
    return proveedor;
};

export const createProveedor = async (proveedorData, imagen) => {
    const { nombre, direccion, ciudad, telefono, correo_electronico, pagina_web } = proveedorData;
    
    if (!nombre || !direccion || !ciudad || !telefono || !correo_electronico || !pagina_web) {
        throw new Error('Todos los campos son obligatorios');
    }

    const laboratorioId = await createProveedorModel(proveedorData);

    if (imagen) {
        const imagenPath = path.relative(path.join(__dirname, '../public'), imagen.path);
        
        await db.execute(
            'INSERT INTO imagen (imagen_producto, ID_Laboratorio) VALUES (?, ?)',
            [imagenPath, laboratorioId]
        );
    }
    
    return { 
        message: 'Proveedor creado exitosamente', 
        id: laboratorioId,
        imagen: imagen ? imagen.filename : null
    };
};

export const updateProveedor = async (id, proveedorData, imagen) => {
    const { nombre, direccion, ciudad, telefono, correo_electronico, pagina_web } = proveedorData;
    
    if (!id || !nombre || !direccion || !ciudad || !telefono || !correo_electronico || !pagina_web) {
        throw new Error('Todos los campos son obligatorios y el ID debe ser válido');
    }

    const proveedorExistente = await getProveedorByIdModel(id);
    if (!proveedorExistente) {
        throw new Error('Proveedor no encontrado');
    }

    const affectedRows = await updateProveedorModel(id, proveedorData);
    if (affectedRows === 0) {
        throw new Error('Error al actualizar proveedor');
    }

    if (imagen) {
        const imagenPath = path.relative(path.join(__dirname, '../public'), imagen.path);

        const [existingImage] = await db.query(
            'SELECT * FROM imagen WHERE ID_Laboratorio = ?', 
            [id]
        );

        if (existingImage.length > 0) {
            try {
                const oldImagePath = path.join(__dirname, '../public', existingImage[0].imagen_producto);
                fs.unlinkSync(oldImagePath);
            } catch (err) {
                console.error('Error al eliminar imagen anterior:', err);
            }

            await db.execute(
                'UPDATE imagen SET imagen_producto = ? WHERE ID_Laboratorio = ?',
                [imagenPath, id]
            );
        } else {
            await db.execute(
                'INSERT INTO imagen (imagen_producto, ID_Laboratorio) VALUES (?, ?)',
                [imagenPath, id]
            );
        }
    }


    return { 
        message: 'Proveedor actualizado exitosamente',
        imagen: imagen ? imagen.filename : null
    };
};

export const deleteProveedor = async (id) => {
    if (!id) throw new Error('ID es obligatorio');

    const proveedorExistente = await getProveedorByIdModel(id);
    if (!proveedorExistente) {
        throw new Error('Proveedor no encontrado');
    }

    await deleteProveedorModel(id);
};