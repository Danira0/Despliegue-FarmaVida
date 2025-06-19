import { 
    getProveedores as getProveedoresService,
    getProveedorById as getProveedorByIdService,
    createProveedor as createProveedorService,
    updateProveedor as updateProveedorService,
    deleteProveedor as deleteProveedorService
} from '../SERVICES/labo.service.js';

export const getProveedores = async (req, res) => {
    try {
        const results = await getProveedoresService();
        res.status(200).json(results);
    } catch (error) {
        console.error('Error al obtener proveedores:', error);
        res.status(500).json({ message: 'Error al obtener proveedores', error: error.message });
    }
};

export const getProveedorById = async (req, res) => {
    const { id } = req.params;
    try {
        const proveedor = await getProveedorByIdService(id);
        if (!proveedor) {
            return res.status(404).json({ message: 'Proveedor no encontrado' });
        }
        res.status(200).json(proveedor);
    } catch (error) {
        console.error('Error al obtener proveedor por ID:', error);
        res.status(500).json({ message: 'Error al obtener proveedor por ID', error: error.message });
    }
};

export const createProveedor = async (req, res) => {
    const { nombre, direccion, ciudad, telefono, correo_electronico, pagina_web } = req.body;
    const imagen = req.file;
    
    try {
        const result = await createProveedorService(
            { nombre, direccion, ciudad, telefono, correo_electronico, pagina_web },
            imagen
        );
        res.status(201).json(result);
    } catch (error) {
        console.error('Error al crear proveedor:', error);
        res.status(500).json({ message: 'Error al crear proveedor', error: error.message });
    }
};

export const updateProveedor = async (req, res) => {
    const { id } = req.params;
    const { nombre, direccion, ciudad, telefono, correo_electronico, pagina_web } = req.body;
    const imagen = req.file;
    
    try {
        const result = await updateProveedorService(
            id,
            { nombre, direccion, ciudad, telefono, correo_electronico, pagina_web },
            imagen
        );
        res.status(200).json(result);
    } catch (error) {
        console.error('Error al actualizar proveedor:', error);
        res.status(500).json({ message: 'Error al actualizar proveedor', error: error.message });
    }
};

export const deleteProveedor = async (req, res) => {
    const { id } = req.params;
    try {
        await deleteProveedorService(id);
        res.status(200).json({ message: 'Proveedor eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar proveedor:', error);
        res.status(500).json({ message: 'Error al eliminar proveedor', error: error.message });
    }
};