import { prisma } from "../db"
import { NotFoundError, ValidationError } from "../errors"
import { IProduct } from "../interface/IProduct"


const create = async (payload: IProduct, userId: string) => {

  const requiredFields: (keyof IProduct)[] = ['name', 'description', 'price', 'stock', 'cost'];
  const missingFields = requiredFields.filter(field => !payload[field]);
  if (missingFields.length > 0) {
    throw new ValidationError(`Los siguientes campos son obligatorios: ${missingFields.join(', ')}`);
  }

  // Validar que el precio y el costo sean números positivos
  if (payload.price <= 0) {
    throw new ValidationError('El precio debe ser un número positivo');
  }
  if (payload.cost <= 0) {
    throw new ValidationError('El costo debe ser un número positivo');
  }
  // Validar que el stock sea un número entero no negativo
  if (!Number.isInteger(payload.stock) || payload.stock < 0) {
    throw new ValidationError('El stock debe ser un número entero no negativo');
  }
  // Validar que el nombre y la descripción no estén vacíos
  if (payload.name.trim() === '') {
    throw new ValidationError('El nombre no puede estar vacío');
  }
  if (payload.description.trim() === '') {
    throw new ValidationError('La descripción no puede estar vacía');
  }
  // validar que no envien datos que no existen en el modelo
  const validFields = ['name', 'description', 'price', 'stock', 'cost'];
  const invalidFields = Object.keys(payload).filter(field => !validFields.includes(field));
  if (invalidFields.length > 0) {
    throw new ValidationError(`Los siguientes campos no son válidos: ${invalidFields.join(', ')}`);
  }
  // Validar que el usuario esté autenticado
  
  if(!userId) {
    throw new ValidationError('El usuario no está autenticado');
  }

  const product = await prisma.product.create({
    data: {
      ...payload,
      userId: userId,
    }
});

  return {
    product,
    message: 'Producto creado correctamente'
  }
}

const products = async (userId: string) => {
  const product = await prisma.product.findMany({
    where: {
      userId
    }
  })

  return {
    product,
    message: `Productos del usuario ${userId}`
  }
}

const update = async (userId: string, productId: string , payload: Partial<IProduct>) => {

  if(!userId) {
    throw new ValidationError('El usuario no está autenticado');
  }

  if(!productId) {
    throw new NotFoundError('El producto no existe');
  }
  
  const product = await prisma.product.update({
    where: {
      id: productId,
      userId,
    },
    data: {
      ...payload,
    },
  })

  return {
    product,
    message: 'Producto actualizado correctamente'
  }
}

export default { create, products, update}