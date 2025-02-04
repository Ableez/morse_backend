import { AppSidebar } from "#/components/app-sidebar";
import BreadCrumbs from "#/components/main-breadcrumbs";
import { SidebarInset, SidebarProvider } from "#/components/ui/sidebar";
import { type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-blue-900/5">
        <BreadCrumbs />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
