import Appbar from "@/components/appbar";
import Footer from "@/components/footer";
import { RadiantNoiseBackground } from "@/components/RadiantNoiseBackground";

export default function layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            <Appbar />
            <RadiantNoiseBackground />

            <main className="pb-10">
                {children}
            </main>

            <Footer />
        </div>
    )
}