"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSocket } from "@/app/context/SocketContext"

export default function Login() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { connectSocket, disconnectSocket } = useSocket()

    const disableCondition = username.trim() === "" || password.trim() === ""

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            disconnectSocket()
            await connectSocket()


            const activeSocket = (window as any).__socket
            if (!activeSocket) throw new Error("Socket not initialized")

            await new Promise<void>((resolve, reject) => {
                const timeout = setTimeout(() => reject(new Error("Socket connection timeout")), 3000)

                if (activeSocket.connected) {
                    clearTimeout(timeout)
                    resolve()
                } else {
                    activeSocket.once("connect", () => {
                        clearTimeout(timeout)
                        resolve()
                    })
                    activeSocket.once("connect_error", (err: any) => {
                        clearTimeout(timeout)
                        reject(err)
                    })
                }
            })


            activeSocket.emit("login", { username, password }, (response: any) => {
                if (response?.error) {
                    setError(response.error)
                    setLoading(false)
                    return
                }

                if (!response?.token) {
                    setError("Invalid server response")
                    setLoading(false)
                    return
                }

                localStorage.setItem("token", response.token)
                localStorage.setItem("username", response.user.username)

                setLoading(false)
                router.push("/chats")
            })
        } catch (err: any) {
            setError(err?.message || "Connection failed")
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
                        ×
                    </button>
                </div>
            )}

            <div className="w-full max-w-md bg-login-formBg rounded-2xl shadow-2xl p-8 border border-login-formBorder relative">
                <div className="flex justify-center mb-6 mt-4">
                    <h1 className="text-2xl font-semibold tracking-wide">Login</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    <div>
                        <label className="block mb-2 text-sm text-login-labelText">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            required
                            className="w-full px-4 py-2 rounded-lg bg-login-inputbg focus:bg-login-inputFocus text-login-inputText placeholder-login-inputPlaceholder focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm text-login-labelText">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                            className="w-full px-4 py-2 rounded-lg bg-login-inputbg focus:bg-login-inputFocus text-login-inputText placeholder-login-inputPlaceholder focus:outline-none"
                        />
                    </div>

                    <button
                        disabled={disableCondition || loading}
                        type="submit"
                        className={`w-full py-2 rounded-lg font-semibold text-lg transition duration-200 ${disableCondition || loading
                            ? "bg-login-buttondisabledBg cursor-not-allowed text-login-buttondisabledText"
                            : "bg-login-buttonBg hover:bg-login-buttonbgHover text-login-buttonText"
                            }`}
                    >
                        {loading ? "Logging in..." : "Log In"}
                    </button>
                </form>

                <p className="text-center text-sm text-login-bodyText mt-6">
                    Don't have an account?{" "}
                    <a href="/signup" className="text-login-bodytextLink hover:underline">
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    )
}
