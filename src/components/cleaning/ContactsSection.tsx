import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface ContactsSectionProps {
  isLoggedIn: boolean;
  setShowDashboard: (show: boolean) => void;
  setShowRegisterDialog: (show: boolean) => void;
}

export default function ContactsSection({ isLoggedIn, setShowDashboard, setShowRegisterDialog }: ContactsSectionProps) {
  return (
    <section className="py-20 bg-gradient-to-r from-primary via-secondary to-accent">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center text-white">
          <Icon name="Phone" size={48} className="mx-auto mb-6" />
          <h3 className="text-4xl font-bold mb-4">Контакты</h3>
          <div className="space-y-3 text-lg">
            <p className="flex items-center justify-center gap-2">
              <Icon name="Phone" size={20} />
              <span>+7 (495) 123-45-67</span>
            </p>
            <p className="flex items-center justify-center gap-2">
              <Icon name="Mail" size={20} />
              <span>info@cleanpro.ru</span>
            </p>
            <p className="flex items-center justify-center gap-2">
              <Icon name="MapPin" size={20} />
              <span>г. Москва, ул. Чистая, д. 15</span>
            </p>
            <p className="flex items-center justify-center gap-2">
              <Icon name="Clock" size={20} />
              <span>Работаем ежедневно с 8:00 до 22:00</span>
            </p>
          </div>
          <Button size="lg" className="mt-8 bg-white text-primary hover:bg-white/90" onClick={() => isLoggedIn ? setShowDashboard(true) : setShowRegisterDialog(true)}>
            <Icon name="Send" size={20} className="mr-2" />
            Оставить заявку
          </Button>
        </div>
      </div>
    </section>
  );
}