import Sidebar from "@/components/Sidebar";
import FooterBar from "@/components/FooterBar";

export default function PrivateLayout({ children }: Readonly<{children: React.ReactNode;}>) {
    return(
        <main className="flex">
            <Sidebar/>
            <div className="w-screen">
                { children }
            </div>
            <FooterBar/>
        </main>
    )
}