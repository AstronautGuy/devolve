import "~/styles/globals.css";

import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import { AppSidebar } from "~/components/Sidebar";

export default function OrgLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
<<<<<<< Updated upstream
    <ClerkProvider>
      <html lang="en" className={`${geist.variable}`}>
        <body>
          <TRPCReactProvider>
            <SidebarProvider>
              <AppSidebar/>
              <SidebarInset>
              {children}
              </SidebarInset>
            </SidebarProvider>
          </TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
=======
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
>>>>>>> Stashed changes
  );
}
