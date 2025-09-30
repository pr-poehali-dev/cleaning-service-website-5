import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/cleaning/Navigation';
import DashboardView from '@/components/cleaning/DashboardView';
import HeroSection from '@/components/cleaning/HeroSection';
import ServicesSection from '@/components/cleaning/ServicesSection';
import AboutSection from '@/components/cleaning/AboutSection';
import PortfolioSection from '@/components/cleaning/PortfolioSection';
import ReviewsSection from '@/components/cleaning/ReviewsSection';
import ContactsSection from '@/components/cleaning/ContactsSection';

export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setShowLoginDialog(false);
    toast({
      title: 'Добро пожаловать!',
      description: 'Вы успешно вошли в личный кабинет'
    });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setShowRegisterDialog(false);
    toast({
      title: 'Регистрация завершена!',
      description: 'Добро пожаловать в CleanPro'
    });
  };

  if (showDashboard && isLoggedIn) {
    return (
      <DashboardView 
        setShowDashboard={setShowDashboard}
        setIsLoggedIn={setIsLoggedIn}
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
        setIsLoggedIn={setIsLoggedIn}
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
          <p>&copy; 2025 CleanPro. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}