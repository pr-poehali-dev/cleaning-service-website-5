import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/cleaning/Navigation";
import DashboardView from "@/components/cleaning/DashboardView";
import HeroSection from "@/components/cleaning/HeroSection";
import ServicesSection from "@/components/cleaning/ServicesSection";
import AboutSection from "@/components/cleaning/AboutSection";
import PortfolioSection from "@/components/cleaning/PortfolioSection";
import ReviewsSection from "@/components/cleaning/ReviewsSection";
import ContactsSection from "@/components/cleaning/ContactsSection";

const CLIENT_AUTH_URL = 'https://functions.poehali.dev/d82330b2-fe3c-484b-9c80-5aaee6984f67';

interface ClientData {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  login: string;
}

export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedClient = localStorage.getItem('client_data');
    if (savedClient) {
      try {
        const client = JSON.parse(savedClient);
        setClientData(client);
        setIsLoggedIn(true);
      } catch (error) {
        localStorage.removeItem('client_data');
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const login = formData.get('login') as string;
    const password = formData.get('password') as string;

    try {
      const response = await fetch(CLIENT_AUTH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', login, password })
      });

      if (response.ok) {
        const client = await response.json();
        setClientData(client);
        setIsLoggedIn(true);
        setShowLoginDialog(false);
        localStorage.setItem('client_data', JSON.stringify(client));
        toast({
          title: "Добро пожаловать!",
          description: `Рады видеть вас, ${client.full_name}!`,
        });
      } else {
        const error = await response.json();
        toast({
          title: "Ошибка входа",
          description: error.error || "Неверный логин или пароль",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось выполнить вход",
        variant: "destructive"
      });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const full_name = formData.get('full_name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const login = formData.get('login') as string;
    const password = formData.get('password') as string;

    try {
      const response = await fetch(CLIENT_AUTH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'register', 
          full_name, 
          email, 
          phone, 
          login, 
          password 
        })
      });

      if (response.ok) {
        const client = await response.json();
        setClientData(client);
        setIsLoggedIn(true);
        setShowRegisterDialog(false);
        localStorage.setItem('client_data', JSON.stringify(client));
        toast({
          title: "Регистрация завершена!",
          description: `Добро пожаловать в Top Clean Service, ${client.full_name}!`,
        });
      } else {
        const error = await response.json();
        toast({
          title: "Ошибка регистрации",
          description: error.error || "Не удалось создать аккаунт",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось выполнить регистрацию",
        variant: "destructive"
      });
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setClientData(null);
    localStorage.removeItem('client_data');
    toast({
      title: "Выход выполнен",
      description: "До скорой встречи!",
    });
  };

  if (showDashboard && isLoggedIn) {
    return (
      <DashboardView
        setShowDashboard={setShowDashboard}
        setIsLoggedIn={handleLogout}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navigation
        isLoggedIn={isLoggedIn}
        showLoginDialog={showLoginDialog}
        showRegisterDialog={showRegisterDialog}
        setShowLoginDialog={setShowLoginDialog}
        setShowRegisterDialog={setShowRegisterDialog}
        setShowDashboard={setShowDashboard}
        setIsLoggedIn={handleLogout}
        handleLogin={handleLogin}
        handleRegister={handleRegister}
      />

      <HeroSection
        isLoggedIn={isLoggedIn}
        setShowDashboard={setShowDashboard}
        setShowRegisterDialog={setShowRegisterDialog}
      />

      <ServicesSection />
      <AboutSection />
      <PortfolioSection />
      <ReviewsSection />

      <ContactsSection
        isLoggedIn={isLoggedIn}
        setShowDashboard={setShowDashboard}
        setShowRegisterDialog={setShowRegisterDialog}
      />

      <footer className="py-8 bg-foreground/5 border-t">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 Top Clean Service. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}