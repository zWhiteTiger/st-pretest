import Appbar from "@/components/appbar";
import Footer from "@/components/footer";

export default function layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            <Appbar />

            <main className="pb-10">
                {children}
            </main>

            <Footer />
        </div>
    )
}