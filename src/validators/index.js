const { z } = require("zod");

// Auth Schemas
const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
    password: z.string().min(6).max(100),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1, "Password is required"),
  }),
});

// Profile Schemas
const createProfileSchema = z.object({
  body: z.object({
    username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens"),
    displayName: z.string().min(2).max(50).optional(),
    headline: z.string().max(100).optional(),
    bio: z.string().max(2000).optional(),
    location: z.string().max(100).optional(),
    portfolioWebsite: z.string().max(200).optional(),
    skills: z.array(z.object({ name: z.string() })).optional(),
    projects: z.array(z.any()).optional(),
    socialLinks: z.array(z.any()).optional(),
  }),
});

const updateProfileSchema = z.object({
  body: createProfileSchema.shape.body.partial()
});

// Contact Schema
const contactSchema = z.object({
  body: z.object({
    username: z.string().min(1),
    name: z.string().min(2).max(50),
    email: z.string().email(),
    message: z.string().min(10).max(1000),
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
  createProfileSchema,
  updateProfileSchema,
  contactSchema,
};
