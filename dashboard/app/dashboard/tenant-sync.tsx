"use client"

import { authClient } from "@/lib/auth-client"
import { useEffect } from "react"

export function TenantSync() {
  const {
    data: session,
    isPending, //loading state
    error, //error object
    refetch, //refetch the session
  } = authClient.useSession()

  useEffect(() => {
    if (session?.user?.tenantId) {
      localStorage.setItem("tenantId", session.user.tenantId)
    } else {
      localStorage.removeItem("tenantId")
    }
  }, [session])

  return null
}
