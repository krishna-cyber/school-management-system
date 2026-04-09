import axios from "axios"
import { authClient } from "./auth-client"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
})

//add x-tenant-id header to all requests
api.interceptors.request.use((config) => {
  const tenantId =
    typeof window !== "undefined" ? localStorage.getItem("tenantId") : null
  authClient.getSession().then((session) => {
    console.log("Session data:", session) // Log the session data to verify its structure
  })
  if (tenantId) {
    config.headers["x-tenant-id"] = tenantId
  }
  return config
})

export default api
