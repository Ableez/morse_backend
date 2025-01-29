import * as React from "react";
import { Home } from "lucide-react";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { currentUser } from "@clerk/nextjs/server";

const data = {
  user: {
    name: "Ableez",
    email: "beepme@ableez.dev",
    avatar: "https://github.com/shadcn.png",
  },
  navMain: [
    { title: "Home", icon: Home, link: "" },
    {
      title: "Learning Paths",
      link: "learning_paths",
      // icon: () => (
      //   <div>
      //     <svg
      //       xmlns="http://www.w3.org/2000/svg"
      //       width="24"
      //       height="24"
      //       viewBox="0 0 24 24"
      //       fill="none"
      //       stroke="currentColor"
      //       strokeWidth="2"
      //       strokeLinecap="round"
      //       strokeLinejoin="round"
      //     >
      //       <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      //       <path d="M22 9l-10 -4l-10 4l10 4l10 -4v6" />
      //       <path d="M6 10.6v5.4a6 3 0 0 0 12 0v-5.4" />
      //     </svg>
      //   </div>
      // ),
    },
    {
      title: "Levels",
      link: "levels",
      // icon: () => (
      //   <div>
      //     <svg
      //       xmlns="http://www.w3.org/2000/svg"
      //       width="24"
      //       height="24"
      //       viewBox="0 0 24 24"
      //       fill="currentColor"
      //     >
      //       <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      //       <path d="M20.894 15.553a1 1 0 0 1 -.447 1.341l-8 4a1 1 0 0 1 -.894 0l-8 -4a1 1 0 0 1 .894 -1.788l7.553 3.774l7.554 -3.775a1 1 0 0 1 1.341 .447m0 -4a1 1 0 0 1 -.447 1.341l-8 4a1 1 0 0 1 -.894 0l-8 -4a1 1 0 0 1 .894 -1.788l7.552 3.775l7.554 -3.775a1 1 0 0 1 1.341 .447m-8.887 -8.552q .056 0 .111 .007l.111 .02l.086 .024l.012 .006l.012 .002l.029 .014l.05 .019l.016 .009l.012 .005l8 4a1 1 0 0 1 0 1.788l-8 4a1 1 0 0 1 -.894 0l-8 -4a1 1 0 0 1 0 -1.788l8 -4l.011 -.005l.018 -.01l.078 -.032l.011 -.002l.013 -.006l.086 -.024l.11 -.02l.056 -.005z" />
      //     </svg>
      //   </div>
      // ),
    },
    {
      title: "Courses",
      link: "courses",
      // icon: () => (
      //   <div>
      //     <svg
      //       xmlns="http://www.w3.org/2000/svg"
      //       width="24"
      //       height="24"
      //       viewBox="0 0 24 24"
      //       fill="none"
      //       stroke="currentColor"
      //       strokeWidth="2"
      //       strokeLinecap="round"
      //       strokeLinejoin="round"
      //     >
      //       <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      //       <path d="M19 4v16h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12z" />
      //       <path d="M19 16h-12a2 2 0 0 0 -2 2" />
      //       <path d="M9 8h6" />
      //     </svg>
      //   </div>
      // ),
    },
    {
      title: "Lessons",
      link: "lessons",
      // icon: () => (
      //   <div>
      //     <svg
      //       xmlns="http://www.w3.org/2000/svg"
      //       width="24"
      //       height="24"
      //       viewBox="0 0 24 24"
      //       fill="currentColor"
      //     >
      //       <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      //       <path d="M14 2a1 1 0 0 1 .993 .883l.007 .117v17h1a1 1 0 0 1 .117 1.993l-.117 .007h-4a1 1 0 0 1 -.117 -1.993l.117 -.007h1v-7.351l-8.406 -3.735c-.752 -.335 -.79 -1.365 -.113 -1.77l.113 -.058l8.406 -3.736v-.35a1 1 0 0 1 1 -1z" />
      //     </svg>
      //   </div>
      // ),
    },
    {
      title: "Swipe Cards",
      link: "swipe-cards",
      // icon: () => (
      //   <div>
      //     <svg
      //       xmlns="http://www.w3.org/2000/svg"
      //       width="24"
      //       height="24"
      //       viewBox="0 0 24 24"
      //       fill="currentColor"
      //     >
      //       <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      //       <path d="M10.348 3.169l-7.15 3.113a2 2 0 0 0 -1.03 2.608l4.92 11.895a1.96 1.96 0 0 0 2.59 1.063l7.142 -3.11a2.002 2.002 0 0 0 1.036 -2.611l-4.92 -11.894a1.96 1.96 0 0 0 -2.588 -1.064z" />
      //       <path d="M16 3a2 2 0 0 1 1.995 1.85l.005 .15v3.5a1 1 0 0 1 -1.993 .117l-.007 -.117v-3.5h-1a1 1 0 0 1 -.117 -1.993l.117 -.007h1z" />
      //       <path d="M19.08 5.61a1 1 0 0 1 1.31 -.53c.257 .108 .505 .21 .769 .314a2 2 0 0 1 1.114 2.479l-.056 .146l-2.298 5.374a1 1 0 0 1 -1.878 -.676l.04 -.11l2.296 -5.371l-.366 -.148l-.402 -.167a1 1 0 0 1 -.53 -1.312z" />
      //     </svg>
      //   </div>
      // ),
    },
    {
      title: "Settings",
      link: "settings",
      // icon: () => (
      //   <div>
      //     <svg
      //       xmlns="http://www.w3.org/2000/svg"
      //       width="24"
      //       height="24"
      //       viewBox="0 0 24 24"
      //       fill="none"
      //       stroke="currentColor"
      //       strokeWidth="2"
      //       strokeLinecap="round"
      //       strokeLinejoin="round"
      //     >
      //       <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      //       <path d="M19.875 6.27a2.225 2.225 0 0 1 1.125 1.948v7.284c0 .809 -.443 1.555 -1.158 1.948l-6.75 4.27a2.269 2.269 0 0 1 -2.184 0l-6.75 -4.27a2.225 2.225 0 0 1 -1.158 -1.948v-7.285c0 -.809 .443 -1.554 1.158 -1.947l6.75 -3.98a2.33 2.33 0 0 1 2.25 0l6.75 3.98h-.033z" />
      //       <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
      //     </svg>
      //   </div>
      // ),
    },
  ],
};

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const user = await currentUser();

  if (!user)
    return <div className="text-center text-sm font-bold">No user</div>;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavUser
          user={{
            name: user?.username ?? "username",
            email: user?.emailAddresses[0]?.emailAddress ?? "admin@admin.com",
            avatar: user?.imageUrl ?? "https://github.com/shadcn.png",
          }}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter />
      <SidebarRail />
    </Sidebar>
  );
}
