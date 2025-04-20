import { prisma } from '../db';
import { ValidationError } from '../errors';
import { PresentationTypeEnum } from './presentationType.enum';

export interface CreateProductDto {
  name: string;
  cost: number;
  salePrice: number;
  units: number;
  sku: string;
  presentation: PresentationTypeEnum;
  stock: number;
  updatedAt?: Date;
}

const create = async (data: CreateProductDto) => {
  const requiredFields: (keyof CreateProductDto)[] = [
    'name', 'cost', 'salePrice', 'units', 'sku', 'presentation', 'stock'
  ];
  const missingFields = requiredFields.filter(field => !data[field] && data[field] !== 0);
  if (missingFields.length > 0) {
    throw new ValidationError(`Missing required fields: ${missingFields.join(', ')}`);
  }

  // Validar que la presentación sea válida
  if (!Object.values(PresentationTypeEnum).includes(data.presentation)) {
    throw new ValidationError('Invalid presentation type');
  }

  // Validar unicidad de SKU
  const existingProduct = await prisma.product.findUnique({ where: { sku: data.sku } });
  if (existingProduct) {
    throw new ValidationError('SKU already exists');
  }

  return prisma.product.create({ data });
};

const products = async () => {
  return await prisma.product.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: 'desc' }});
};

const getById = async (id: number) => {
  const product = await prisma.product.findUnique({
    where: { id },
  })
  if (!product) {
    throw new ValidationError('Product not found');
  }
  return product;
}

const updateProduct = async (id: number, data: Partial<CreateProductDto>) => {
  const product = await prisma.product.findUnique({
    where: { id },
  });
  if (!product) {
    throw new ValidationError('Product not found');
  }
  const updatedProduct = await prisma.product.update({
    where: { id },
    data: {
      ...data,
    },
  });
  return updatedProduct;
  };

  const softDeleteProduct = async (id: number) => {
    const product = await prisma.product.findUnique({
      where: { id },
    });
    if (!product) {
      throw new ValidationError('Product not found');
    }
    await prisma.product.update({
      where: { id },
      data: { deletedAt: new Date(), deleted: true },
    });
    return { message: 'Product deleted successfully' };
  };

  const deleteProduct = async (id: number) => {
    const product = await prisma.product.findUnique({
      where: { id },
    });
    if (!product) {
      throw new ValidationError('Product not found');
    }
    await prisma.product.delete({
      where: { id },
    });
    return { message: 'Product deleted successfully' };
  };

export default { create, products, getById, updateProduct, softDeleteProduct, deleteProduct };
