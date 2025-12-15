import { redirect } from "next/navigation"
import { auth } from "@/auth"

export default async function RedirectingPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>
}) {
  const { callbackUrl } = await searchParams
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  const tenantId = session.user?.tenant_id ?? null

  // Se existir callbackUrl, respeita
  if (callbackUrl) {
    redirect(callbackUrl)
  }

  // Fallback por role
  if (tenantId === null) {
    redirect("/admin")
  }

  redirect("/app")
}
