import { PrismaClient } from '../generated/prisma';
import { isValidEmail } from '../utils/isValidEmail';
import { isPasswordValid } from './helpers/isPasswordValid';

const prisma = new PrismaClient();

type User = {
  id: number;
  username: string;
  name: string;
  email: string
  password: string;
  phone: string;
  address: string;
  country: string;
  zipcode: string;
};

const register = async (data: Omit<User, 'id'>) => {

  const { email, password, username, address, country, name, phone, zipcode } = data;

  // Validate required fields dynamically
  const requiredFields: (keyof Omit<User, 'id'>)[] = ['username', 'address', 'country', 'name', 'phone', 'zipcode', 'email', 'password'];
  const missingFields = requiredFields.filter(field => !data[field]);

  if (missingFields.length > 0) {
    throw new Error(`Los siguientes campos son obligatorios: ${missingFields.join(', ')}`);
  }

  // Validate email existence only if provided
  if (email) {
      // Verificar si el email ya existe
      const existingUserByEmail = await prisma.user.findUnique({
        where: { email },
      });
      if (existingUserByEmail) {
        throw new Error('El email ya está registrado');
      }
      // Validate email format
      if (!isValidEmail(email)) {
        throw new Error('El email no es válido');
      }
  }

  // Verificar si el username ya existe
  const existingUserByUsername = await prisma.user.findUnique({
    where: { username },
  });
  if (existingUserByUsername) {
    throw new Error('El username ya está registrado');
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
