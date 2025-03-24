import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in the environment variables.');
}

const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Verifica se o usuário já existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'Email já cadastrado' });
      return;
    }

    // Cria novo usuário
    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({ message: 'Usuário registrado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: 'Invalid Credentials' });
      return;
    }

    // Como está utilizando senha, você precisará de um método para compará-la
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid Credentials' });
      return;
    }

    // Gerando token JWT
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
