"use client";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "#/components/ui/sidebar";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode } from "react";
import { Button } from "./ui/button";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    icon: ReactNode;
    link: string;
  }[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = (link: string) => pathname === `${link}`;

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <Button
              className={`${isActive(item.link) ? "" : "bg-neutral-200/60 text-black hover:bg-green-100 hover:text-black"} w-full justify-start gap-4 overflow-clip pl-3 text-left shadow-none transition-all duration-300 ease-in-out`}
              onClick={() => router.push(item.link)}
            >
              {item.icon}
              <span>{item.title}</span>
            </Button>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
