import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import BookingForm from "./BookingForm";

interface DashboardViewProps {
  setShowDashboard: (show: boolean) => void;
  setIsLoggedIn: (logged: boolean) => void;
}

export default function DashboardView({
  setShowDashboard,
  setIsLoggedIn,
}: DashboardViewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Icon name="Sparkles" className="text-primary" size={32} />
            <h1 className="text-2xl font-bold text-primary">
              Top Clean Service
            </h1>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowDashboard(false)}>
              <Icon name="ArrowLeft" size={18} className="mr-2" />
              На главную
            </Button>
            <Button variant="ghost" onClick={() => setIsLoggedIn(false)}>
              <Icon name="LogOut" size={18} className="mr-2" />
              Выйти
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8 text-center">
            Личный кабинет
          </h2>
          <BookingForm />
        </div>
      </main>
    </div>
  );
}
