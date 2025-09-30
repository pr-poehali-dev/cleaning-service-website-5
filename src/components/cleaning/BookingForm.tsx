import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const getAvailableDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 1; i <= 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
};

const getAvailableTimeSlots = () => {
  return [
    '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', 
    '17:00', '18:00'
  ];
};

export default function BookingForm() {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const { toast } = useToast();

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
        setSelectedDate('');
        setSelectedTime('');
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

  return (
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

          <div className="space-y-4 bg-primary/5 p-4 rounded-lg">
            <h3 className="font-semibold flex items-center gap-2">
              <Icon name="Calendar" className="text-primary" size={20} />
              Выберите дату и время уборки
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="date">Доступные даты</Label>
              <select
                id="date"
                name="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
                required
              >
                <option value="">Выберите дату</option>
                {getAvailableDates().map(date => {
                  const dateObj = new Date(date);
                  const formattedDate = dateObj.toLocaleDateString('ru-RU', { 
                    day: 'numeric', 
                    month: 'long',
                    weekday: 'short'
                  });
                  return (
                    <option key={date} value={date}>
                      {formattedDate}
                    </option>
                  );
                })}
              </select>
            </div>

            {selectedDate && (
              <div className="space-y-2 animate-fade-in">
                <Label htmlFor="time">Доступное время</Label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {getAvailableTimeSlots().map(time => (
                    <Button
                      key={time}
                      type="button"
                      variant={selectedTime === time ? 'default' : 'outline'}
                      className="h-12"
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
                <input type="hidden" id="time" name="time" value={selectedTime} required />
              </div>
            )}
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
  );
}