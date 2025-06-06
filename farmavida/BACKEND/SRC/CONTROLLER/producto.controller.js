import * as productoService from '../SERVICES/producto.service.js';

export const getProductos = async (req, res) => {
  try {
    const { nombre, tipo } = req.query;
    const productos = await productoService.getProductos(nombre, tipo);
    res.status(200).json(productos);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({
      message: "Error al obtener los productos",
      error: error.message,
    });
  }
};

export const getProductoById = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await productoService.getProductoById(id);
    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.status(200).json(producto);
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    res.status(500).json({
      message: "Error al obtener el producto",
      error: error.message,
    });
  }
};

export const getNombresLaboratorios = async (req, res) => {
  try {
    const laboratorios = await productoService.getNombresLaboratorios();
    res.status(200).json(laboratorios);
  } catch (error) {
    console.error("Error al obtener nombres de laboratorios:", error);
    res.status(500).json({
      message: "Error al obtener los nombres de laboratorios",
      error: error.message,
    });
  }
};

export const createProducto = async (req, res) => {
  const producto = req.body;
  const imagen = req.file;

  try {
    const result = await productoService.createProducto(producto, imagen);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error al crear el producto:", error);
    res.status(error.status || 500).json({
      message: error.message || "Error al crear el producto",
      error: error.details || error.message,
    });
  }
};

export const updateProducto = async (req, res) => {
  const { id } = req.params;
  const producto = req.body;
  const imagen = req.file;

  try {
    const result = await productoService.updateProducto(id, producto, imagen);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    res.status(error.status || 500).json({
      message: error.message || "Error al actualizar el producto",
      error: error.details || error.message,
    });
  }
};

export const updateProductoStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { cantidad_unidades, cantidad_frascos } = req.body;
    
    const result = await productoService.updateProductoStock(id, cantidad_unidades, cantidad_frascos);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error al actualizar el stock del producto:", error);
    res.status(error.status || 500).json({
      message: error.message || "Error al actualizar el stock del producto",
      error: error.details || error.message,
    });
  }
};

export const deleteProducto = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await productoService.deleteProducto(id);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    res.status(error.status || 500).json({
      message: error.message || "Error al eliminar el producto",
      error: error.details || error.message,
    });
  }
};

export const getFechavenci = async (req, res) => {
  try {
    const result = await productoService.checkCaducidad();
    res.status(200).json({
      message: result.message,
      expiringMedicines: result.expiringMedicines,
    });
} catch (error) {
  console.error("Error al verificar la fecha de vencimiento", error);
  res.status(500).json({
    message: "Error al verificar la fecha de vencimiento",
    })
  }
}

export const verificarStock = async (req, res) => {
  try {
    const result = await productoService.verificarStockYEnviarAlerta();
    res.status(200).json(result);
  } catch (error) {
    console.error("Error en la verificación de stock:", error);
    res.status(500).json({ message: "Error al verificar el stock", error: error.message });
  }
};