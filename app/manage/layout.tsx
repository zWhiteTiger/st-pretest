import Appbar from "@/components/appbar";
import Footer from "@/components/footer";
import { RadiantNoiseBackground } from "@/components/RadiantNoiseBackground";
import { getServerSession } from "next-auth";
import { authConfig } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

const validRoles = [
    "FLOORSTAFF",
    "TEAMLEADER",
    "MANAGER",
];

export default async function layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const session = await getServerSession(authConfig);

    if (!session) {
        redirect("/login");
    }

    if (!validRoles.includes(session.user.role)) {
        redirect("/");
    }

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