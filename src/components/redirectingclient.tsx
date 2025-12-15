"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading";

interface Props {
  callbackUrl?: string;
}

export default function RedirectingClient({ callbackUrl }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function handleRedirect() {
      try {
        const res = await fetch("/api/auth/session");
        const session = await res.json();

        if (!session?.user) {
          router.replace("/login");
          return;
        }

        const tenantId = session.user?.tenant_id ?? null;

        if (callbackUrl) {
          router.replace(callbackUrl);
        } else if (tenantId === null) {
          router.replace("/admin");
        } else {
          router.replace("/app");
        }
      } catch (err) {
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    }

    handleRedirect();
  }, [callbackUrl, router]);

  return loading ? <Loading /> : null;
}
