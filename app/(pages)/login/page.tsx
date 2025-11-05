"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSocket } from "@/app/context/SocketContext"
import LoginInput from "@/app/components/uielements/logininput/LoginInput"
import Button from "@/app/components/uielements/button/Button"
import FormNavigator from "@/app/components/uielements/formnavigator/FormNavigator"

export default function Login() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { connectSocket } = useSocket()

    const disableCondition = username.trim() === "" || password.trim() === ""

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            })

            const data = await res.json()
            if (!res.ok || data.error) throw new Error(data.error || "Login failed")

            const { token, user } = data
            localStorage.setItem("token", token)
            localStorage.setItem("username", user.username)

            await connectSocket(token)

            router.push("/chats")
        } catch (err: any) {
            setError(err.message || "Connection failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-login-bg text-login-text px-4">
            {error && (
                <div className="absolute top-0 left-0 w-full bg-login-errorBg text-login-errorText px-4 py-3 flex justify-between items-center">
                    <p className="text-sm">{error}</p>
                    <button
                        onClick={() => setError("")}
                        className="text-login-errorbuttonText font-bold text-lg leading-none hover:text-login-errorbuttontextHover"
                    >
                        x
                    </button>
                </div>
            )}

            <div className="w-full max-w-md bg-login-formBg rounded-2xl shadow-2xl p-8 border border-login-formBorder relative">
                <div className="flex justify-center mb-6 mt-4">
                    <h1 className="text-2xl font-semibold tracking-wide">Login</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    <LoginInput label="Username" placeholder="Enter your username" onChange={(e) => setUsername(e.target.value)} type="text" value={username} />

                    <LoginInput label="Password" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} type="password" value={password} />

                    <Button buttonText="Log In" loadingText="Logging in..." disableCondition={disableCondition || loading} loading={loading} />


                </form>


                <FormNavigator content="Don't have an account?" pageLink="/signup" formType="Sign up" />

            </div>
        </div>
    )
}
