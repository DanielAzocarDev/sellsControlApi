import productService from './product.service';
import { Request, Response, NextFunction } from 'express';

const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await productService.products();
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
}

const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.getById(Number(req.params.id));
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
}

const updateProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.updateProduct(Number(req.params.id), req.body);
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
}

const deleteProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.softDeleteProduct(Number(req.params.id));
    res.status(200).json(product);
  }
  catch (error) {
    next(error);
  }
}

export default { createProduct, getProducts, getProductById, updateProductById, deleteProductById };
