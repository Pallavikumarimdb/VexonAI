// "use client";

// import { useState } from "react";

// import { api } from "@/trpc/react";

// export function LatestPost() {
//   const [latestUser] = api.user.getLatestUser.useSuspenseQuery();


//   const utils = api.useUtils();
//   const [name, setName] = useState("");
//   const createUser = api.user.createUser.useMutation({
//     onSuccess: async () => {
//       await utils.user.invalidate();
//       setName("");
//     },
//   });
  

//   return (
//     <div className="w-full max-w-xs">
//       {latestUser ? (
//         <p className="truncate">Your most recent post: {latestUser.firstName}</p>
//       ) : (
//         <p>You have no posts yet.</p>
//       )}
//       <form
//         onSubmit={(e) => {
//           e.preventDefault();
//           createUser.mutate({firstName: name});
//         }}
//         className="flex flex-col gap-2"
//       >
//         <input
//           type="text"
//           placeholder="Title"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           className="w-full rounded-full bg-white/10 px-4 py-2 text-white"
//         />
//         <button
//           type="submit"
//           className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
//           disabled={createUser.isPending}
//         >
//           {createUser.isPending ? "Submitting..." : "Submit"}
//         </button>
//       </form>
//     </div>
//   );
// }
