import * as React from "react";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "#/components/ui/sidebar";
import { currentUser } from "@clerk/nextjs/server";
import { IconHome, IconLogout, IconSettings } from "@tabler/icons-react";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "./ui/button";
import Link from "next/link";

const data = {
  user: {
    name: "Ableez",
    email: "beepme@ableez.dev",
    avatar: "https://github.com/shadcn.png",
  },
  navMain: [
    {
      title: "Home",
      link: "/",
      icon: <IconHome size={26} strokeWidth={2.5} />,
    },
    {
      title: "Settings",
      link: "/settings",
      icon: <IconSettings size={26} strokeWidth={2.5} />,
    },
  ],
};

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const user = await currentUser();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SignedIn>
          <NavUser
            user={{
              name: user?.username ?? "username",
              email: user?.emailAddresses[0]?.emailAddress ?? "admin@admin.com",
              avatar: user?.imageUrl ?? "https://github.com/shadcn.png",
            }}
          />
        </SignedIn>
        <SignedOut>
          <Link href={"/sign-in"}>
            <Button className="w-full justify-start">
              <IconLogout size={25} color="#fff" />
              <span>Sign In</span>
            </Button>
          </Link>
        </SignedOut>
      </SidebarHeader>
      <SignedIn>
        <SidebarContent>
          <NavMain items={data.navMain} />
        </SidebarContent>
      </SignedIn>
      <SidebarFooter />
      <SidebarRail />
    </Sidebar>
  );
}
