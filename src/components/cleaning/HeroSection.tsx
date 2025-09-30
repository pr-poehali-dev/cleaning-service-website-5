import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface HeroSectionProps {
  isLoggedIn: boolean;
  setShowDashboard: (show: boolean) => void;
  setShowRegisterDialog: (show: boolean) => void;
}

export default function HeroSection({ isLoggedIn, setShowDashboard, setShowRegisterDialog }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10"></div>
      <div className="container mx-auto px-4 py-20 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h2 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Профессиональная уборка для вашего комфорта
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Современные технологии, экологичные средства и опытная команда для идеальной чистоты вашего пространства
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="text-lg" onClick={() => isLoggedIn ? setShowDashboard(true) : setShowRegisterDialog(true)}>
                <Icon name="Calendar" size={20} className="mr-2" />
                Заказать уборку
              </Button>
              <Button size="lg" variant="outline" className="text-lg">
                <Icon name="Phone" size={20} className="mr-2" />
                +7 (495) 123-45-67
              </Button>
            </div>
          </div>
          <div className="animate-scale-in">
            <img 
              src="/img/0c244d59-f0c1-4dff-b054-4e98efecce46.jpg" 
              alt="Профессиональная уборка" 
              className="rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}