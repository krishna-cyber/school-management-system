"use client"
import React from "react"
import { DropdownMenuItem } from "./ui/dropdown-menu"
import { LogOutIcon } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { redirect } from "next/navigation"

const SignOutDropdownItem = () => {
  return (
    <DropdownMenuItem
      onClick={async () => {
        await authClient.signOut({
          fetchOptions: {
            onSuccess() {
              localStorage.removeItem("tenantId")
            },
          },
        })
        redirect("/")
      }}
      variant="destructive"
      className="px-4 py-2.5 text-base"
    >
      <LogOutIcon className="size-5" />
      <span>Logout</span>
    </DropdownMenuItem>
  )
}

export default SignOutDropdownItem
