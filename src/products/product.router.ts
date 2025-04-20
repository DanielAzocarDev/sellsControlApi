import { Router } from 'express';
import productController from './product.controller';
import { authMiddleware } from '../middlewares/authMiddleware';

const productRouter = Router();

productRouter.post('/', authMiddleware, productController.createProduct);

productRouter.get('/', authMiddleware, productController.getProducts);

productRouter.get('/:id', authMiddleware, productController.getProductById);

productRouter.put('/:id', authMiddleware, productController.updateProductById);

productRouter.delete('/delete/:id', authMiddleware, productController.deleteProductById);

export default productRouter;
