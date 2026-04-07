import { createAuthClient } from "better-auth/react" // make sure to import from better-auth/react
import { inferAdditionalFields } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  //you can pass client configuration here
  baseURL: "http://localhost:3000",
  basePath: "api/auth",
  plugins: [
    //from docs better-auth
    // If your client and server are in separate projects, you'll need to manually specify the additional fields when creating the auth client.
    inferAdditionalFields({
      user: {
        tenantId: {
          type: "string",
        },
      },
    }),
  ],
})
