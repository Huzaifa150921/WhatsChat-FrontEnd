"use client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Loader from "./components/uielements/loaders/splashloader/SplashLoader"

export default function Home() {
  const router = useRouter()


  useEffect(() => {
    const timer = setTimeout(() => {
      const auth = localStorage.getItem("token")
      if (!auth) {
        router.push("/login")
      } else {
        router.push("/chats")
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="h-screen w-full bg-dashboard-bg relative">

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-dashboard-loadingText">
        <Loader />
      </div>
    </div>
  )
}
