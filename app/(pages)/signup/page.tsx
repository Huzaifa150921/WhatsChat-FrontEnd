"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Button from "@/app/components/uielements/button/Button"
import FormNavigator from "@/app/components/uielements/formnavigator/FormNavigator"
import SignupInput from "@/app/components/uielements/signupinput/SignupInput"

export default function Signup() {
    const [username, setUsername] = useState("")
    const [displayName, setdisplayName] = useState("")
    const [usernameValidator, setUsernameValidator] = useState("")
    const [nameValidator, setnameValidator] = useState("")
    const [password, setPassword] = useState("")
    const [passwordValidator, setPasswordValidator] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [confirmPasswordValidator, setConfirmPasswordValidator] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const disableCondition =
        usernameValidator !== "" ||
        nameValidator !== "" ||
        passwordValidator !== "" ||
        confirmPasswordValidator !== "" ||
        displayName.trim() === "" ||
        username.trim() === "" ||
        password.trim() === "" ||
        confirmPassword.trim() === ""

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/signup`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        displayName,
                        username,
                        password,
                        confirmPassword,
                    }),
                }
            )
            const data = await res.json()
            if (
                !res.ok ||
                data.error
            )
                throw new Error(
                    data.error || "Signup failed"
                )

            setLoading(false)
            router.push("/login")
        } catch (err: any) {
            setError(
                err.message || "Something went wrong. Please try again."
            )
            setLoading(false)
        }
    }

    const handleUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value
        setUsername(input)
        setUsernameValidator(
            input.trim().length === 0
                ? "Username can't be empty"
                : ""
        )
    }

    const handlename = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value
        setdisplayName(input)
        setnameValidator(
            input.trim().length === 0
                ? "Name can't be empty"
                : ""
        )
    }

    const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value
        setPassword(input)
        setConfirmPassword("")
        setPasswordValidator(
            input.trim().length <= 7
                ? "Password must be at least 8 characters"
                : ""
        )
    }

    const handleConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value
        setConfirmPassword(input)
        if (input.trim() === "") {
            setConfirmPasswordValidator("")
        } else if (input.trim() !== password) {
            setConfirmPasswordValidator(
                "Passwords don't match"
            )
        } else {
            setConfirmPasswordValidator("")
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-signup-bg text-signup-text px-4">
            {error && (
                <div className="absolute top-0 left-0 w-full bg-signup-errorbg text-signup-errorText px-4 py-3 flex justify-between items-center">
                    <p className="text-sm">
                        {error}
                    </p>
                    <button
                        onClick={() =>
                            setError("")
                        }
                        className="text-signup-errorbuttonText font-bold text-lg leading-none hover:text-signup-errorbuttontextHover"
                    >
                        x
                    </button>
                </div>
            )}

            <div className="w-full max-w-md bg-signup-formBg rounded-2xl shadow-2xl p-8 border border-signup-formBorder relative">
                <div className="flex justify-center mb-6 mt-4">
                    <h1 className="text-2xl font-semibold tracking-wide">
                        Signup
                    </h1>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 mt-4"
                >


                    <SignupInput error={usernameValidator} label="Username" onChange={handleUsername} placeholder="Enter your username" type="text" value={username} />

                    <SignupInput error={nameValidator} label="Name" onChange={handlename} placeholder="Enter your nickname" type="text" value={displayName} />

                    <SignupInput error={passwordValidator} label="Password" onChange={handlePassword} placeholder="Enter your password" type="password" value={password} />

                    <SignupInput error={confirmPasswordValidator} label="Confirm Password" onChange={handleConfirmPassword} placeholder="Confirm your password" type="password" value={confirmPassword} />


                    <Button buttonText="Sign Up" disableCondition={disableCondition ||
                        loading} loading={loading} loadingText="Signing up..." />

                </form>


                <FormNavigator content="Already have an account?" formType="Log in" pageLink="/login" />

            </div>
        </div>
    )
}
