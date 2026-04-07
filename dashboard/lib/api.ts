import axios from "axios"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
})

//add x-tenant-id header to all requests
api.interceptors.request.use((config) => {
  const tenantId = localStorage.getItem("tenantId")
  if (tenantId) {
    config.headers["x-tenant-id"] = tenantId
  }
  return config
})

export default api
