import Link from "next/link";

import { api, HydrateClient } from "@/trpc/server";
import Index from "./landingPage/Index";

export default async function Home() {
  const hello = await api.user.hello({ text: "from tRPC" }); 


  void api.user.getLatestUser.prefetch();

  return (
    <HydrateClient>
     <div className="relative bg-slate-200 w-full">
     <Index/>
     </div>
    </HydrateClient>
  );
}
