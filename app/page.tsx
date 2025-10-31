'use client'
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const auth = localStorage.getItem("token")
    if (!auth) {
      router.push("/login")
    } else {
      router.push("/chats")
    }
  }, [])

  return <></>
}
