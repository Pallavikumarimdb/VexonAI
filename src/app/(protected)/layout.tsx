import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import AppSidebar from "./app-sidebar";

type Props = {
    children: React.ReactNode;
};

const SidebarLayout = ({ children }: Props) => {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="w-full m-2">
                <div className="flex justify-between items-center border-sidebar-border bg-sidebar border shadow rounded-md p-2 px-4">
                    <SidebarTrigger />
                    {/* <SearchBar /> */}
                    <div>
                        <Button />
                    </div>
                </div>

                <div className="h-4"></div>
                {/* main content */}
                <div className=" border-sidebar-border bg-sidebar border shadow rounded-md overflow-y--scroll h-[calc(100vh-6rem)] p-4">
                    {children}
                </div>
            </main>
        </SidebarProvider>
    );
};

export default SidebarLayout;