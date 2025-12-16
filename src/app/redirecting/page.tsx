// src/app/redirecting/page.tsx

import RedirectingClient from "@/components/redirectingclient";


interface RedirectingPageProps {
  searchParams?: { callbackUrl?: string };
}

export default function RedirectingPage({ searchParams }: RedirectingPageProps) {
  return <RedirectingClient callbackUrl={searchParams?.callbackUrl} />;
}