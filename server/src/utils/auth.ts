// src/auth/auth.ts  ← plain file, NOT a NestJS service
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const client = new MongoClient(
	process.env.DATABASE_CONNECTION_STRING as string,
);
const db = client.db();

export const auth = betterAuth({
	secret: process.env.BETTER_AUTH_JWT_SECRET as string,
	baseURL: process.env.BETTER_AUTH_BASE_URL as string,
	database: mongodbAdapter(db),
	emailAndPassword: { enabled: true, minPasswordLength: 6 },
	session: {
		cookieCache: {
			enabled: true,
		},
	},
	user: {
		fields: {
			image: "logo",
		},
		additionalFields: {
			tenantId: {
				type: "string",
				required: true,
			},
			contact: {
				type: "string[]",
				required: false,
			},
			address: {
				type: "string",
				required: true,
			},
		},
	},
	advanced: {
		disableOriginCheck: true, // For development only. Make sure to enable CSRF protection in production!
	},
	trustedOrigins: [process.env.NEXT_JS_DASHBOARD_URL as string], // ✅ Next.js port
	experimental: { joins: true },
});
