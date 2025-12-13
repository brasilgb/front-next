import { auth } from "@/auth";
import SiteLayout from "@/components/site/site-layout";
import Link from "next/link";
import { redirect } from "next/navigation";

const Home = async () => {
    const session = await auth();

//   if (session) {
//     if (session.user.tenant_id) {
//       redirect("/app");
//     } else {
//       redirect("/admin");
//     }
//   }
  
    return (
        <SiteLayout>

            <main className="flex min-h-screen flex-col items-center justify-between p-24">
                {/* Header */}
                <header className="w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
                    <div className="font-bold text-xl">SystemOS</div>
                    <Link
                        href="/login"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                        Acessar Sistema
                    </Link>
                </header>

                {/* Hero Section */}
                <div className="text-center my-20">
                    <h1 className="text-4xl font-extrabold mb-4">
                        Gerencie suas Ordens de Serviço com facilidade
                    </h1>
                    <p className="text-gray-600 mb-8">
                        O melhor sistema para assistências técnicas do Brasil.
                    </p>

                    {/* Pricing Section exemplo */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                        <div className="border p-6 rounded shadow">
                            <h3 className="text-xl font-bold">Grátis</h3>
                            <p className="text-2xl font-bold my-2">R$ 0</p>
                            <p>Até 50 OS/mês</p>
                        </div>
                        {/* ... outros planos */}
                    </div>
                </div>
            </main>
        </SiteLayout>
    )
}
export default Home;