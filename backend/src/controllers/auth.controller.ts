import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/auth.service';
import { z } from 'zod';

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['BRAND', 'CREATOR']),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, role } = registerSchema.parse(req.body);
        const { user, token } = await registerUser(email, password, role);
        res.status(201).json({ user: { id: user.id, email: user.email, role: user.role }, token });
    } catch (error: any) {
        res.status(400).json({ error: error.message || 'Registration failed' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = loginSchema.parse(req.body);
        const { user, token } = await loginUser(email, password);
        res.json({ user: { id: user.id, email: user.email, role: user.role }, token });
    } catch (error: any) {
        res.status(401).json({ error: error.message || 'Login failed' });
    }
};
