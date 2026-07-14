import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email({ message: 'Please enter a valid email address.' }),
  password: z
    .string()
    .min(1, { message: 'Password is required.' })
    // You can add more complex password rules here later if needed:
    // .min(8, { message: 'Password must be at least 8 characters long.' })
});

export type LoginFormData = z.infer<typeof loginSchema>;
