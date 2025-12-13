import Image from "next/image";

function AuthLogo() {
    return (
        <div className="mb-10 z-50">
            <Image
            src="/sigmaos.png"
            alt="Next.js logo"
            width={200}
            height={40}
            priority
        />
        </div>
    )
}

export default AuthLogo