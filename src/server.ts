import express from 'express';
import usersRouter from './users';
import productsRouter from './products';
import salesRouter from './sales';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/sales', salesRouter);

app.get('/', (req, res) => {
  res.send('API de Control de Ventas funcionando');
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
