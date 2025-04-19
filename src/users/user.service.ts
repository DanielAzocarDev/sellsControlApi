import { PrismaClient } from '../generated/prisma';
import { isValidEmail } from '../utils/isValidEmail';
import { isPasswordValid } from './helpers/isPasswordValid';

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

  const { email, password, username } = data;
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

  // Validate email format
  if (!isValidEmail(email)) {
    throw new Error('El email no es válido');
  }

  // Validate username and email existence
  if (!username && !email) {
    throw new Error('El username o email son obligatorios');
  }

  if(!password) {
    throw new Error('La contraseña es obligatoria');
  }
  if (!isPasswordValid(password)) {
    throw new Error('La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula y un número');
  }

  const user = await prisma.user.create({
    data
  });
  // No devolver la contraseña
  const { password: userPassword, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export default { register };
