import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Endpoint de ejemplo
router.get('/', authMiddleware,(req, res) => {
  res.json({ message: 'Listado de productos' });
});

export default router;
