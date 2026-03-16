import { createAuthClient } from "better-auth/react" // make sure to import from better-auth/react

export const authClient = createAuthClient({
  //you can pass client configuration here
  baseURL: "http://localhost:3000",
  basePath: "/auth",
  fetchOptions: {
    onError: (error) => {
      if (error.response.status === 429) {
        console.warn("Too many requests. Please try again later.")
      }
      console.error("Auth Client Error:", error)
    },
  },
})
