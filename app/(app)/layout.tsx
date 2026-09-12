import { AppSidebar } from "@/components/AppSidebar";
import { BottomNav } from "@/components/BottomNav";
import { TopBar } from "@/components/TopBar";
import { AuthGuard } from "@/components/AuthGuard";
import { PredictionStoreProvider } from "@/lib/store";
import { VERSION_TAG } from "@/lib/version";

export default function AppShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <PredictionStoreProvider>
        <div className="min-h-screen flex">
          <AppSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <TopBar />
            <main className="flex-1 px-5 md:px-12 py-8 md:py-12 pb-24 md:pb-12">
              <div className="max-w-content mx-auto w-full">
                {children}
                <footer className="mt-16 pt-6 border-t border-line text-[12px] text-muted">
                  {VERSION_TAG}
                </footer>
              </div>
            </main>
          </div>
          <BottomNav />
        </div>
      </PredictionStoreProvider>
    </AuthGuard>
  );
}
