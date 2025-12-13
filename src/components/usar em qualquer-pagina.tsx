// "use client";

// import { useSession } from "next-auth/react";

// export function UserProfileCard() {
//   const { data: session, status } = useSession();

//   if (status === "loading") {
//     return <p>A carregar...</p>;
//   }

//   if (status === "unauthenticated") {
//     return <p>Acesso negado</p>;
//   }

//   return (
//     <div className="border p-4 rounded bg-gray-50">
//       <p>Utilizador: <strong>{session?.user?.name}</strong></p>
//       <p>Empresa ID: {session?.user?.tenant_id}</p>
//     </div>
//   );
// }