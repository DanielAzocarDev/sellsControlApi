import { PrismaClient } from '../generated/prisma';
import { isValidEmail } from '../utils/isValidEmail';
import { isPasswordValid } from './helpers/isPasswordValid';
import { ValidationError, AuthenticationError } from '../errors';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const saltRounds = 10; // Cost factor for hashing

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
    throw new ValidationError(`Los siguientes campos son obligatorios: ${missingFields.join(', ')}`);
  }

  // Validate email existence only if provided
  if (email) {
      // Verificar si el email ya existe
      const existingUserByEmail = await prisma.user.findUnique({
        where: { email },
      });
      if (existingUserByEmail) {
        throw new ValidationError('El email ya está registrado');
      }
      // Validate email format
      if (!isValidEmail(email)) {
        throw new ValidationError('El email no es válido');
      }
  }

  // Verificar si el username ya existe
  const existingUserByUsername = await prisma.user.findUnique({
    where: { username },
  });
  if (existingUserByUsername) {
    throw new ValidationError('El username ya está registrado');
  }


  if(!password) {
    throw new ValidationError('La contraseña es obligatoria');
  }
  if (!isPasswordValid(password)) {
    throw new ValidationError('La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula y un número');
  }

  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const user = await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword // Store the hashed password
    }
  });
  // No devolver la contraseña
  const { password: userPassword, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

const login = async (usernameOrEmail: string, passwordAttempt: string) => {
  if (!usernameOrEmail || !passwordAttempt) {
    throw new ValidationError('El nombre de usuario/email y la contraseña son obligatorios');
  }

  // Find user by username or email
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { username: usernameOrEmail },
        { email: usernameOrEmail }
      ]
    }
  });

  if (!user) {
    throw new AuthenticationError('Credenciales inválidas'); // User not found
  }

  // Compare the provided password with the stored hash
  const isMatch = await bcrypt.compare(passwordAttempt, user.password);

  if (!isMatch) {
    throw new AuthenticationError('Credenciales inválidas'); // Password doesn't match
  }

  // Return user data without the password
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};


export default { register, login };
