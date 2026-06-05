import { Header } from "@/components/layout/header";
import { LinkCard } from "@/components/link/link-card";

export default function LinkPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <LinkCard />
      </main>
    </div>
  );
}
