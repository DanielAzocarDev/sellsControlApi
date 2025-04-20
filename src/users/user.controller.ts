import { Request, Response } from 'express';
import userService from './user.service';
import { AuthenticationError, ValidationError } from '../errors';
import { generateToken } from '../utils/jwt';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.register(req.body);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { usernameOrEmail, password } = req.body;
    const user = await userService.login(usernameOrEmail, password);
    // Generar token JWT
    const token = generateToken({ userId: user.id.toString(), email: user.email });
    res.status(200).json({ user, token });
  } catch (error: any) {
    if (error instanceof AuthenticationError) {
      res.status(401).json({ error: error.message }); // Unauthorized
    } else if (error instanceof ValidationError) {
      res.status(400).json({ error: error.message }); // Bad Request for validation errors
    } else {
      res.status(500).json({ error: 'Error interno del servidor' }); // Internal Server Error for other errors
    }
  }
};
