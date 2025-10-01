import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface NavigationProps {
  isLoggedIn: boolean;
  showLoginDialog: boolean;
  showRegisterDialog: boolean;
  setShowLoginDialog: (show: boolean) => void;
  setShowRegisterDialog: (show: boolean) => void;
  setShowDashboard: (show: boolean) => void;
  setIsLoggedIn: (logged: boolean) => void;
  handleLogin: (e: React.FormEvent) => void;
  handleRegister: (e: React.FormEvent) => void;
}

export default function Navigation({
  isLoggedIn,
  showLoginDialog,
  showRegisterDialog,
  setShowLoginDialog,
  setShowRegisterDialog,
  setShowDashboard,
  setIsLoggedIn,
  handleLogin,
  handleRegister
}: NavigationProps) {
  return (
    <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 sm:py-4 flex justify-between items-center">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Icon name="Sparkles" className="text-primary" size={24} />
          <h1 className="text-lg sm:text-2xl font-bold text-primary">Top Clean Service</h1>
        </div>
        <div className="flex gap-2 sm:gap-3">
          {isLoggedIn ? (
            <>
              <Button onClick={() => setShowDashboard(true)} size="sm" className="text-xs sm:text-sm">
                <Icon name="User" size={16} className="mr-1 sm:mr-2" />
                <span className="hidden xs:inline">Личный кабинет</span>
                <span className="xs:hidden">Кабинет</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsLoggedIn(false)}>
                <Icon name="LogOut" size={16} />
              </Button>
            </>
          ) : (
            <>
              <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-xs sm:text-sm">Войти</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Вход в личный кабинет</DialogTitle>
                    <DialogDescription>Введите ваши данные для входа</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input id="login-email" type="email" placeholder="example@mail.com" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Пароль</Label>
                      <Input id="login-password" type="password" required />
                    </div>
                    <Button type="submit" className="w-full">Войти</Button>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog open={showRegisterDialog} onOpenChange={setShowRegisterDialog}>
                <DialogTrigger asChild>
                  <Button size="sm" className="text-xs sm:text-sm">Регистрация</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Регистрация</DialogTitle>
                    <DialogDescription>Создайте аккаунт для заказа услуг</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reg-name">Имя</Label>
                      <Input id="reg-name" placeholder="Иван Иванов" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-email">Email</Label>
                      <Input id="reg-email" type="email" placeholder="example@mail.com" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-phone">Телефон</Label>
                      <Input id="reg-phone" type="tel" placeholder="+7 (999) 123-45-67" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-password">Пароль</Label>
                      <Input id="reg-password" type="password" required />
                    </div>
                    <Button type="submit" className="w-full">Зарегистрироваться</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}