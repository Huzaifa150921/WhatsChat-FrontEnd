
type Props = {
    disableCondition: boolean
    loading: boolean
    buttonText: string
    loadingText?: string
}

const Button = ({ disableCondition, loading, buttonText, loadingText }: Props) => {
    return (
        <button
            disabled={disableCondition || loading}
            type="submit"
            className={`w-full py-2 rounded-lg font-semibold text-lg transition duration-200 ${disableCondition || loading
                ? "bg-login-buttondisabledBg cursor-not-allowed text-login-buttondisabledText"
                : "bg-login-buttonBg hover:bg-login-buttonbgHover text-login-buttonText"
                }`}
        >
            {loading ? loadingText : buttonText}
        </button>
    )
}

export default Button