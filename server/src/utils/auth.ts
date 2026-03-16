// src/auth/auth.ts  ← plain file, NOT a NestJS service
import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.DATABASE_CONNECTION_STRING!);
const db = client.db();

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_JWT_SECRET!,
  baseURL: process.env.BETTER_AUTH_BASE_URL!,
  database: mongodbAdapter(db),
  emailAndPassword: { enabled: true, minPasswordLength: 6 },
  user: {
    fields: {
      image: 'logo',
    },
    additionalFields: {
      tenantId: {
        type: 'string',
        required: true,
      },
      contact: {
        type: 'string[]',
        required: false,
      },
      address: {
        type: 'string',
        required: true,
      },
    },
  },
  advanced: {
    disableOriginCheck: true, // For development only. Make sure to enable CSRF protection in production!
  },
  trustedOrigins: ['http://localhost:3001'], // ✅ Next.js port
  experimental: { joins: true },
});
