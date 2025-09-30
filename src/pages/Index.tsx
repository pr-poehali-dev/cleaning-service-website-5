import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const { toast } = useToast();

  const services = [
    {
      title: 'Офисная уборка',
      description: 'Профессиональная уборка офисных помещений любой площади',
      icon: 'Building2',
      price: 'от 500 ₽/м²'
    },
    {
      title: 'Квартиры и дома',
      description: 'Генеральная и поддерживающая уборка жилых помещений',
      icon: 'Home',
      price: 'от 300 ₽/м²'
    },
    {
      title: 'После ремонта',
      description: 'Уборка после строительных и ремонтных работ',
      icon: 'Paintbrush',
      price: 'от 700 ₽/м²'
    },
    {
      title: 'Химчистка мебели',
      description: 'Глубокая чистка мягкой мебели и ковров',
      icon: 'Armchair',
      price: 'от 1500 ₽'
    }
  ];

  const reviews = [
    {
      name: 'Елена Смирнова',
      rating: 5,
      text: 'Отличная компания! Убрали офис быстро и качественно. Обязательно обратимся снова.',
      date: '15 сентября 2025'
    },
    {
      name: 'Михаил Петров',
      rating: 5,
      text: 'После ремонта квартира была в ужасном состоянии. Ребята справились на ура! Спасибо!',
      date: '10 сентября 2025'
    },
    {
      name: 'Анна Козлова',
      rating: 5,
      text: 'Регулярно заказываю уборку квартиры. Всегда чисто, аккуратно и вовремя. Рекомендую!',
      date: '5 сентября 2025'
    }
  ];

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

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData(e.target as HTMLFormElement);
    const bookingData = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      address: formData.get('address'),
      area: Number(formData.get('area')),
      serviceType: formData.get('service'),
      comment: formData.get('comment') || '',
      date: formData.get('date'),
      time: formData.get('time')
    };

    try {
      const response = await fetch('https://functions.poehali.dev/efa2b104-cb77-4f2d-ac02-829e0e6ca609', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      });

      if (response.ok) {
        toast({
          title: 'Заявка отправлена!',
          description: 'Мы свяжемся с вами в ближайшее время',
          duration: 5000
        });
        (e.target as HTMLFormElement).reset();
      } else {
        toast({
          title: 'Ошибка',
          description: 'Не удалось отправить заявку. Попробуйте позже.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось отправить заявку. Проверьте подключение к интернету.',
        variant: 'destructive'
      });
    }
  };

  if (showDashboard && isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Icon name="Sparkles" className="text-primary" size={32} />
              <h1 className="text-2xl font-bold text-primary">CleanPro</h1>
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
            <h2 className="text-4xl font-bold mb-8 text-center">Личный кабинет</h2>
            
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Icon name="Calendar" className="text-primary" />
                  Заявка на уборку
                </CardTitle>
                <CardDescription>Заполните форму, и мы свяжемся с вами в течение часа</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBookingSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Ваше имя</Label>
                      <Input id="name" name="name" placeholder="Иван Иванов" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Телефон</Label>
                      <Input id="phone" name="phone" type="tel" placeholder="+7 (999) 123-45-67" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="example@mail.com" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Адрес уборки</Label>
                    <Input id="address" name="address" placeholder="г. Москва, ул. Примерная, д. 1, кв. 10" required />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="area">Площадь помещения (м²)</Label>
                      <Input id="area" name="area" type="number" placeholder="50" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="service">Тип уборки</Label>
                      <select 
                        id="service"
                        name="service"
                        className="w-full h-10 px-3 rounded-md border border-input bg-background"
                        required
                      >
                        <option value="">Выберите тип</option>
                        <option value="office">Офисная уборка</option>
                        <option value="apartment">Квартира/Дом</option>
                        <option value="renovation">После ремонта</option>
                        <option value="furniture">Химчистка мебели</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="date">Желаемая дата уборки</Label>
                      <Input id="date" name="date" type="date" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Желаемое время</Label>
                      <Input id="time" name="time" type="time" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="comment">Комментарий</Label>
                    <Textarea 
                      id="comment"
                      name="comment"
                      placeholder="Дополнительные пожелания или особенности объекта"
                      rows={4}
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    <Icon name="Send" size={20} className="mr-2" />
                    Отправить заявку
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Icon name="Sparkles" className="text-primary" size={32} />
            <h1 className="text-2xl font-bold text-primary">CleanPro</h1>
          </div>
          <div className="flex gap-3">
            {isLoggedIn ? (
              <>
                <Button onClick={() => setShowDashboard(true)}>
                  <Icon name="User" size={18} className="mr-2" />
                  Личный кабинет
                </Button>
                <Button variant="ghost" onClick={() => setIsLoggedIn(false)}>
                  <Icon name="LogOut" size={18} />
                </Button>
              </>
            ) : (
              <>
                <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline">Войти</Button>
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
                    <Button>Регистрация</Button>
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

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-4xl font-bold text-center mb-12">Наши услуги</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Icon name={service.icon as any} className="text-primary" size={32} />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-primary">{service.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <img 
                src="/img/bdef7af6-032c-44ed-9508-e5ba24733ae0.jpg" 
                alt="Наша команда" 
                className="rounded-2xl shadow-xl"
              />
            </div>
            <div>
              <h3 className="text-4xl font-bold mb-6">О компании CleanPro</h3>
              <div className="space-y-4 text-lg text-muted-foreground">
                <p>
                  Мы — команда профессионалов с более чем 10-летним опытом в сфере клининговых услуг. 
                  Наша миссия — создавать идеально чистые пространства, где приятно жить и работать.
                </p>
                <p>
                  Используем только сертифицированное оборудование и экологичные моющие средства, 
                  безопасные для здоровья людей и домашних животных.
                </p>
                <div className="grid grid-cols-3 gap-4 pt-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">500+</div>
                    <div className="text-sm">Довольных клиентов</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-secondary mb-2">10+</div>
                    <div className="text-sm">Лет опыта</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-accent mb-2">100%</div>
                    <div className="text-sm">Гарантия качества</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-4xl font-bold text-center mb-12">Отзывы клиентов</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((review, idx) => (
              <Card key={idx} className="animate-fade-in" style={{ animationDelay: `${idx * 150}ms` }}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-lg">{review.name}</CardTitle>
                    <div className="flex gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Icon key={i} name="Star" className="text-yellow-400 fill-yellow-400" size={16} />
                      ))}
                    </div>
                  </div>
                  <CardDescription className="text-xs">{review.date}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{review.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

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

      <footer className="py-8 bg-foreground/5 border-t">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 CleanPro. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}