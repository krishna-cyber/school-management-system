import { inferAdditionalFields } from "better-auth/client/plugins"
import { nextCookies } from "better-auth/next-js"
import { createAuthClient } from "better-auth/react" // make sure to import from better-auth/react

export const authClient = createAuthClient({
  //you can pass client configuration here
  baseURL: process.env.NEXT_PUBLIC_API_URL, // ✅ Next.js API route
  fetchOptions: {
    credentials: "include",
  },
  plugins: [
    // If your client and server are in separate projects, you'll need to manually specify the additional fields when creating the auth client.
    inferAdditionalFields({
      user: {
        tenantId: {
          type: "string",
        },
      },
    }),
    nextCookies(), // make sure this is the last plugin in the array
  ],
})
