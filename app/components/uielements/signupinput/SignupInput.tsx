import React from "react"

type Props = {
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    error: string
    placeholder: string
    type: string
    label: string
}

const SignupInput = ({ label, type, value, onChange, error, placeholder }: Props) => (
    <div>
        <label className="block mb-2 text-sm text-signup-labelText">
            {label}
        </label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required
            className="w-full px-4 py-2 rounded-lg bg-signup-inputBg focus:bg-signup-inputFocus text-signup-inputText placeholder-signup-inputPlaceholder focus:outline-none"
        />
        {error && (
            <p className="text-signup-inputerrorText text-left text-sm p-1">
                {error}
            </p>
        )}
    </div>

)

export default SignupInput
