"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSocket } from "@/app/context/SocketContext"

export default function Signup() {
    const [username, setUsername] = useState("")
    const [usernameValidator, setUsernameValidator] = useState("")
    const [password, setPassword] = useState("")
    const [passwordValidator, setPasswordValidator] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [confirmPasswordValidator, setConfirmPasswordValidator] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const { socket } = useSocket();

    const router = useRouter()

    const disableCondition =
        usernameValidator !== "" ||
        passwordValidator !== "" ||
        confirmPasswordValidator !== "" ||
        username.trim() === "" ||
        password.trim() === "" ||
        confirmPassword.trim() === ""

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        socket?.emit(
            "signup",
            { username, password, confirmPassword },
            (response: any) => {
                if (response.error) {
                    setError(response.error)
                    setLoading(false)
                    return
                }
                setLoading(false)
                router.push("/login")
            }
        )
    }

    const handleUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value
        setUsername(input)
        setUsernameValidator(input.trim().length === 0 ? "Username can't be empty" : "")
    }

    const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value
        setPassword(input)
        setConfirmPassword("")
        setPasswordValidator(
            input.trim().length <= 7 ? "Password must be at least 8 characters" : ""
        )
    }

    const handleConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value
        setConfirmPassword(input)
        if (input.trim() === "") {
            setConfirmPasswordValidator("")
        } else if (input.trim() !== password) {
            setConfirmPasswordValidator("Passwords don't match")
        } else {
            setConfirmPasswordValidator("")
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-signup-bg text-signup-text px-4">
            {error && (
                <div className="absolute top-0 left-0 w-full bg-signup-errorbg text-signup-errorText px-4 py-3 flex justify-between items-center">
                    <p className="text-sm">{error}</p>
                    <button
                        onClick={() => setError("")}
                        className="text-signup-errorbuttonText font-bold text-lg leading-none hover:text-signup-errorbuttontextHover"
                    >
                        x
                    </button>
                </div>
            )}
            <div className="w-full max-w-md bg-signup-formBg rounded-2xl shadow-2xl p-8 border border-signup-formBorder relative">
                <div className="flex justify-center mb-6 mt-4">
                    <h1 className="text-2xl font-semibold tracking-wide">Signup</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    <div>
                        <label className="block mb-2 text-sm text-signup-labelText">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={handleUsername}
                            placeholder="Enter your username"
                            required
                            className="w-full px-4 py-2 rounded-lg bg-signup-inputBg focus:bg-signup-inputFocus text-signup-inputText placeholder-signup-inputPlaceholder focus:outline-none"
                        />
                        {usernameValidator && (
                            <p className="text-signup-inputerrorText text-left text-sm p-1">
                                {usernameValidator}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-2 text-sm text-signup-labelText">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={handlePassword}
                            placeholder="Enter your password"
                            required
                            className="w-full px-4 py-2 rounded-lg bg-signup-inputBg focus:bg-signup-inputFocus text-signup-inputText placeholder-signup-inputPlaceholder focus:outline-none"
                        />
                        {passwordValidator && (
                            <p className="text-signup-inputerrorText text-left text-sm p-1">
                                {passwordValidator}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-2 text-sm text-signup-labelText">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={handleConfirmPassword}
                            placeholder="Confirm your password"
                            required
                            className="w-full px-4 py-2 rounded-lg bg-signup-inputBg focus:bg-signup-inputFocus text-signup-inputText placeholder-signup-inputPlaceholder focus:outline-none"
                        />
                        {confirmPasswordValidator && (
                            <p className="text-signup-inputerrorText text-left text-sm p-1">
                                {confirmPasswordValidator}
                            </p>
                        )}
                    </div>

                    <button
                        disabled={disableCondition || loading}
                        type="submit"
                        className={`w-full py-2 rounded-lg font-semibold text-lg transition duration-200 ${disableCondition || loading
                            ? "bg-signup-buttondisabledBg cursor-not-allowed text-signup-buttondisabledText"
                            : "bg-signup-buttonBg hover:bg-signup-buttonbgHover text-signup-buttonText"
                            }`}
                    >
                        {loading ? "Signing up..." : "Sign Up"}
                    </button>
                </form>

                <p className="text-center text-sm text-signup-bodyText mt-6">
                    Already have an account?{" "}
                    <a href="/login" className="text-signup-bodyLink hover:underline">
                        Log in
                    </a>
                </p>
            </div>
        </div>
    )
}
