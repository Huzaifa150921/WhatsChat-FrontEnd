"use client"
import React from "react"

type Props = {
    label: string
    type: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    placeholder: string

}

export default function LoginInput({ label, type, value, onChange, placeholder }: Props) {
    return (
        <div>
            <label className="block mb-2 text-sm text-login-labelText">
                {label}
            </label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required
                className="w-full px-4 py-2 rounded-lg bg-login-inputbg focus:bg-login-inputFocus text-login-inputText placeholder-login-inputPlaceholder focus:outline-none"
            />
        </div>
    )
}
