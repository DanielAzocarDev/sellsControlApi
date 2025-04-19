import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

type User = {
  id: number;
  username: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  country: string;
  zipcode: string;
};

const register = async (data: Omit<User, 'id'>) => {
  // Verificar si el email o username ya existen
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: data.email },
        { username: data.username }
      ]
    }
  });
  if (existingUser) {
    throw new Error('El email o username ya está registrado');
  }
  const user = await prisma.user.create({
    data
  });
  // No devolver la contraseña
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export default { register };
