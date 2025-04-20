import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../errors'; // Importar la clase base de error

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err); // Loguear el error para depuración

  if (err instanceof HttpError) {
    // Si es un error HTTP conocido, usar su statusCode y mensaje
    res.status(err.statusCode).json({
      status: 'error',
      statusCode: err.statusCode,
      message: err.message,
    });
    return; // Salir después de manejar el error
  }

  // Para errores inesperados o no manejados, devolver un error 500 genérico
  res.status(500).json({
    status: 'error',
    statusCode: 500,
    message: 'Internal Server Error',
  });
  // No es necesario un return aquí, ya que es el final de la función
};
