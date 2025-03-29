import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import AppSidebar from "./app-sidebar";
import { UserRound } from "lucide-react";

type Props = {
    children: React.ReactNode;
};

const SidebarLayout = ({ children }: Props) => {
    return (
        <SidebarProvider className="bg-vexon-purple/40">
            <AppSidebar />
            <main className="w-full m-2">
                <div className="flex justify-between items-center border-sidebar-border  backdrop-blur-xl border border-white/20 shadow-lg rounded-md p-2 px-4">
                    <SidebarTrigger />
                    {/* <SearchBar /> */}
                    <div>
                        <Button>
                        <UserRound />
                        </Button>
                    </div>
                </div>

                <div className="h-4"></div>
                <div className=" border-sidebar-border bg-[#e7e4f9] border shadow rounded-md overflow-y--scroll min-h-[calc(100vh-6rem)] p-4">
                    {children}
                </div>
            </main>
        </SidebarProvider>
    );
};

export default SidebarLayout;