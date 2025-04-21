import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import productService from "./products.service";
import { ValidationError } from "../errors";


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

export default {
  createProduct,
  getProducts,
}