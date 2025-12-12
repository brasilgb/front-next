import { ReactNode } from "react"
import SiteHeader from "./site-header";
import SiteFooter from "./site-footer";

interface SiteLayoutProps {
    children: ReactNode
}
const SiteLayout = ({ children }: SiteLayoutProps) => {

    return (
        <main className="flex flex-col min-h-screen">
            <SiteHeader />
            <div className="grow">
            {children}
            </div>
            <SiteFooter />
        </main>
    )
}
export default SiteLayout;