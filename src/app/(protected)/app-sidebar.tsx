'use client'

import { Button } from "@/components/ui/button"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { Bot, CreditCard, LayoutDashboard, Plus, Presentation } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

const items=[
    {
    title:"Dashboard",
    path:"/dashboard",
    icon: LayoutDashboard
    },
    {
    title:"Q&A",
    path:"/qa",
    icon: Bot
    },
    {
    title:"Meetings",
    path:"/meetings",
    icon: Presentation
    },
    {
    title:"Billing",
    path:"/billing",
    icon: CreditCard
    }
]

const projects =[
    {
        name:"Project 1",
    },{
        name:"Project 2",
    },{
        name:"Project 2",
    }
]
export default function AppSidebar() {
    const pathname=usePathname();
    const open=useSidebar();

    console.log(open)
    return (
        <Sidebar collapsible="icon" variant="floating">
            <SidebarHeader>
                <div className="flex items-center gap-2">
                    {/* <Image src="/logo.png" width={40} height={40} alt="logo" /> */}
                    {open.open && (
                        <h1 className="font-mono italic text-xl font-bold text-primary/80">VexonAI</h1>
                    )}
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>
                        Application
                    </SidebarGroupLabel>

                    <SidebarGroupContent>
                        <SidebarMenu>
                        {items.map((item) => {
                            return (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.path} className={cn({
                                            'bg-primary text-white': pathname === item.path,
                                        })}>
                                            <item.icon/>
                                            <span>
                                                {item.title}
                                            </span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )
                        })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>


                <SidebarGroup>
                    <SidebarGroupLabel>
                        Your Project
                    </SidebarGroupLabel>

                    <SidebarGroupContent>
                        <SidebarMenu>
                        {projects.map((project) => {
                            return (
                                <SidebarMenuItem key={project.name}>
                                    <SidebarMenuButton asChild>
                                        <div>
                                            <div className={cn(
                                                'rounded-sm border size-6 flex item-center justify-center text-md bg-white text-primary',
                                                {
                                                    'bg-primary text-white': true,
                                                }
                                            )}>
                                                {project.name[0]}
                                            </div>
                                            {open.open && <span>{project.name}</span>}
                                        </div>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )
                        })}
                        {open.open && 
                        <div className="h-2">
                        <SidebarMenuItem>
                        <Link href='/create'>
                        <Button size='sm' variant={'outline'} className="mt-2 w-fit">
                            <Plus/>
                            Create Project
                        </Button></Link>
                        </SidebarMenuItem>
                    </div>}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>



            </SidebarContent>
        </Sidebar>
    )
}