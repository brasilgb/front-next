import Image from "next/image";

function AuthLogo() {
    return (
        <div className="mb-10">
            <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={100}
            height={20}
            priority
        />
        </div>
    )
}

export default AuthLogo