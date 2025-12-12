import { ReactNode } from "react"
import { ThemeToggle } from "../theme-toogle";

interface AuthLayoutProps {
    children: ReactNode
}
const AuthLayout = ({ children }: AuthLayoutProps) => {

    return (
        <main className="flex flex-col min-h-screen w-full">
            <div className="absolute top-8 right-8 z-10">
                <ThemeToggle />
            </div>
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070')",
                }}
            />
            <div className="grow flex flex-col items-center justify-center bg-red-100">
                {children}
            </div>
        </main>
    )
}
export default AuthLayout;