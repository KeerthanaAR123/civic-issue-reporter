const { z } = require('zod');

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be 6+ characters')
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

const issueSchema = z.object({
  title: z.string().min(5, 'Title too short'),
  description: z.string().min(10, 'Description too short'),
  category: z.string(),
  address: z.string()
});

module.exports = { registerSchema, loginSchema, issueSchema };
