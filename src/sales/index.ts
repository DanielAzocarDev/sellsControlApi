import { Router } from 'express';

const router = Router();

// Endpoint de ejemplo
router.get('/', (req, res) => {
  res.json({ message: 'Listado de ventas' });
});

export default router;
