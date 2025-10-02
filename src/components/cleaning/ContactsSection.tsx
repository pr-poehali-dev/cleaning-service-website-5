import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface ContactsSectionProps {
  isLoggedIn: boolean;
  setShowDashboard: (show: boolean) => void;
  setShowRegisterDialog: (show: boolean) => void;
}

export default function ContactsSection({ isLoggedIn, setShowDashboard, setShowRegisterDialog }: ContactsSectionProps) {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-primary via-secondary to-accent">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center text-white">
          <Icon name="Phone" size={36} className="mx-auto mb-4 sm:mb-6" />
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">Контакты</h3>
          <div className="space-y-2 sm:space-y-3 text-sm sm:text-base lg:text-lg">
            <p className="flex items-center justify-center gap-2">
              <Icon name="Phone" size={18} />
              <span className="break-all">+7 (919) 707-12-18</span>
            </p>
            <p className="flex items-center justify-center gap-2">
              <Icon name="Mail" size={18} />
              <span className="break-all">info@cleanpro.ru</span>
            </p>
            <p className="flex items-center justify-center gap-2">
              <Icon name="MapPin" size={18} />
              <span className="break-words">г. Пермь</span>
            </p>
            <p className="flex items-center justify-center gap-2">
              <Icon name="Clock" size={18} />
              <span className="break-words">Работаем ежедневно с 8:00 до 22:00</span>
            </p>
          </div>
          <Button size="default" className="mt-6 sm:mt-8 bg-white text-primary hover:bg-white/90 w-full sm:w-auto" onClick={() => isLoggedIn ? setShowDashboard(true) : setShowRegisterDialog(true)}>
            <Icon name="Send" size={18} className="mr-2" />
            Оставить заявку
          </Button>
        </div>
      </div>
    </section>
  );
}