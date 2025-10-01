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
      <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-20 relative">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
          <div className="animate-fade-in">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              Профессиональная уборка для вашего комфорта
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8">
              Современные технологии, экологичные средства и опытная команда для идеальной чистоты вашего пространства
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
              <Button size="default" className="text-sm sm:text-base w-full sm:w-auto" onClick={() => isLoggedIn ? setShowDashboard(true) : setShowRegisterDialog(true)}>
                <Icon name="Calendar" size={18} className="mr-2" />
                Заказать уборку
              </Button>
              <Button size="default" variant="outline" className="text-sm sm:text-base w-full sm:w-auto">
                <Icon name="Phone" size={18} className="mr-2" />
                <span className="truncate">+7 (495) 123-45-67</span>
              </Button>
            </div>
          </div>
          <div className="animate-scale-in order-first lg:order-last">
            <img
              src="https://cdn.poehali.dev/files/0c244d59-f0c1-4dff-b054-4e98efecce46.jpg"
              alt="Профессиональная уборка"
              className="rounded-2xl shadow-2xl w-full h-auto object-cover max-h-[300px] sm:max-h-[400px] lg:max-h-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
}