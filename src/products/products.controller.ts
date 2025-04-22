import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import productService from "./products.service";
import { NotFoundError, ValidationError } from "../errors";


const createProduct = async (req: AuthRequest, res: Response) => {

  const userId = req.user?.id; // Obtener el userId del token
  if (!userId) {
    res.status(401).json({ error: 'Usuario no autenticado' });
    return;
  }
  try {
    const product = await productService.create(req.body, userId);
    res.status(201).json(product);
  } catch (error: any) {
    if (error instanceof ValidationError) {
      res.status(400).json({ error: error.message });
    } else {
      console.error('Error al crear el producto:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}

const getProducts = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ error: 'Usuario no autenticado' });
    return;
  }

  try {
    const products = await productService.products(userId);
    res.status(200).json(products);
  } catch (error: any) {
    if (error instanceof ValidationError) {
      res.status(400).json({ error: error.message });
    } else {
      console.error('Error al obtener los productos:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}

const updateProduct = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { productId } = req.params;
  const payload = req.body;
  if (!userId) {
    res.status(401).json({ error: 'Usuario no autenticado' });
    return;
  }
  try {
    const product = await productService.update(userId, productId, payload);
    res.status(200).json(product);
  } catch (error: any) {
    if (error instanceof ValidationError) {
      res.status(400).json({ error: error.message });
    } else if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
    } else {
      console.error('Error al actualizar el producto:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}

const softDeleteProduct = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { productId } = req.params;
  if (!userId) {
    res.status(401).json({ error: 'Usuario no autenticado' });
    return;
  }
  try {
    const product = await productService.softDelete(userId, productId);
    res.status(200).json(product);
  }catch (error: any) {
    if (error instanceof ValidationError) {
      res.status(400).json({ error: error.message });
    } else if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
    } else {
      console.error('Error al eliminar el producto:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}

export default {
  createProduct,
  getProducts,
  updateProduct,
  softDeleteProduct
}