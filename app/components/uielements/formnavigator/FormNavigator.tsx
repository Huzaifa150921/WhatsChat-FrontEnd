

type Props = {
    formType: string;
    content: string;
    pageLink: string;
}

const FormNavigator = ({ formType, content, pageLink }: Props) => {
    return (
        <>
            <p className="text-center text-sm text-login-bodyText mt-6">
                {content}{" "}
                <a
                    href={pageLink}
                    className="text-login-bodytextLink hover:underline"
                >
                    {formType}
                </a>
            </p>
        </>
    )
}

export default FormNavigator