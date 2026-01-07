import AppSidebar from "@/components/shared/AppSidebar";
import Header from "@/components/shared/Header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

const DosenLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {/* SIDEBAR */}
        <AppSidebar />

        {/* MAIN CONTENT */}
        <main className="flex-1 flex flex-col min-h-screen bg-background">
          <Header />

          <div
            className="
              flex-1
              w-full
              px-4 sm:px-6 lg:px-8
              py-4 sm:py-6
            "
          >
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DosenLayout;