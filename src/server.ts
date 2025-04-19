import express, { ErrorRequestHandler } from 'express'; // Importar ErrorRequestHandler
import usersRouter from './users';
import productsRouter from './products';
import salesRouter from './sales';
import { errorHandler } from './middlewares/errorHandler'; // Importar el manejador de errores

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/sales', salesRouter);

app.get('/', (req, res) => {
  res.send('API de Control de Ventas funcionando');
});

// Registrar el middleware de manejo de errores DESPUÉS de todas las rutas
app.use(errorHandler as ErrorRequestHandler); // Castear al tipo correcto

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
