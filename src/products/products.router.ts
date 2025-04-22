import { Router } from 'express';
import productController from './products.controller';
import { authMiddleware } from '../middlewares/authMiddleware';

const productRouter = Router();
productRouter.post('/', authMiddleware, productController.createProduct);
productRouter.get('/', authMiddleware, productController.getProducts);
productRouter.put('/:productId', authMiddleware, productController.updateProduct);
productRouter.put('/delete/:productId', authMiddleware, productController.softDeleteProduct);

export default productRouter;