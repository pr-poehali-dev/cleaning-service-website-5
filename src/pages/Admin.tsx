import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Booking {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  area: number;
  service_type: string;
  comment: string;
  status: 'new' | 'in-progress' | 'completed' | 'cancelled';
  created_at: string;
}

const API_URL = 'https://functions.poehali.dev/efa2b104-cb77-4f2d-ac02-829e0e6ca609';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить заявки',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin') {
      setIsAuthenticated(true);
      toast({
        title: 'Успешный вход',
        description: 'Добро пожаловать в админ-панель'
      });
    } else {
      toast({
        title: 'Ошибка входа',
        description: 'Неверный пароль',
        variant: 'destructive'
      });
    }
  };

  const updateBookingStatus = async (id: number, newStatus: Booking['status']) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setBookings(bookings.map(b => 
          b.id === id ? { ...b, status: newStatus } : b
        ));
        toast({
          title: 'Статус обновлён',
          description: 'Изменения сохранены'
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить статус',
        variant: 'destructive'
      });
    }
  };

  const deleteBooking = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setBookings(bookings.filter(b => b.id !== id));
        setSelectedBooking(null);
        toast({
          title: 'Заявка удалена',
          description: 'Заявка успешно удалена из системы'
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить заявку',
        variant: 'destructive'
      });
    }
  };

  const getStatusBadge = (status: Booking['status']) => {
    const variants: Record<string, { variant: any; label: string; color: string }> = {
      'new': { variant: 'default', label: 'Новая', color: 'bg-blue-500' },
      'in-progress': { variant: 'secondary', label: 'В работе', color: 'bg-yellow-500' },
      'completed': { variant: 'outline', label: 'Выполнена', color: 'bg-green-500' },
      'cancelled': { variant: 'destructive', label: 'Отменена', color: 'bg-red-500' }
    };
    const config = variants[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.phone.includes(searchQuery) ||
      booking.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: bookings.length,
    new: bookings.filter(b => b.status === 'new').length,
    inProgress: bookings.filter(b => b.status === 'in-progress').length,
    completed: bookings.filter(b => b.status === 'completed').length
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md animate-scale-in">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Lock" className="text-primary" size={40} />
            </div>
            <CardTitle className="text-3xl">Админ-панель</CardTitle>
            <CardDescription>Введите пароль для входа</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-lg"
                  required
                />
                <p className="text-xs text-muted-foreground">Подсказка: admin</p>
              </div>
              <Button type="submit" size="lg" className="w-full">
                <Icon name="LogIn" size={20} className="mr-2" />
                Войти
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Icon name="Shield" className="text-primary" size={32} />
            <h1 className="text-2xl font-bold">Админ-панель CleanPro</h1>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              <Icon name="Home" size={18} className="mr-2" />
              На сайт
            </Button>
            <Button variant="ghost" onClick={() => setIsAuthenticated(false)}>
              <Icon name="LogOut" size={18} className="mr-2" />
              Выйти
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="animate-fade-in">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Всего заявок</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          
          <Card className="animate-fade-in" style={{ animationDelay: '100ms' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Новые</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-500">{stats.new}</div>
            </CardContent>
          </Card>
          
          <Card className="animate-fade-in" style={{ animationDelay: '200ms' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">В работе</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-500">{stats.inProgress}</div>
            </CardContent>
          </Card>
          
          <Card className="animate-fade-in" style={{ animationDelay: '300ms' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Выполнено</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">{stats.completed}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="ClipboardList" className="text-primary" />
              Заявки на уборку
            </CardTitle>
            <CardDescription>Управление заявками клиентов</CardDescription>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div className="flex-1">
                <Input
                  placeholder="Поиск по имени, телефону, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 rounded-md border border-input bg-background"
              >
                <option value="all">Все статусы</option>
                <option value="new">Новые</option>
                <option value="in-progress">В работе</option>
                <option value="completed">Выполнено</option>
                <option value="cancelled">Отменено</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Клиент</TableHead>
                    <TableHead>Контакты</TableHead>
                    <TableHead>Адрес</TableHead>
                    <TableHead>Площадь</TableHead>
                    <TableHead>Тип услуги</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Дата</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                        Заявки не найдены
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredBookings.map((booking) => (
                      <TableRow key={booking.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">#{booking.id}</TableCell>
                        <TableCell>{booking.name}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{booking.phone}</div>
                            <div className="text-muted-foreground">{booking.email}</div>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">{booking.address}</TableCell>
                        <TableCell>{booking.area} м²</TableCell>
                        <TableCell>{booking.service_type}</TableCell>
                        <TableCell>{getStatusBadge(booking.status)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{booking.created_at}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedBooking(booking)}
                          >
                            <Icon name="Eye" size={16} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>

      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Icon name="FileText" className="text-primary" />
              Заявка #{selectedBooking?.id}
            </DialogTitle>
            <DialogDescription>Детальная информация о заявке</DialogDescription>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Icon name="User" size={16} className="text-primary" />
                    Клиент
                  </h4>
                  <p className="text-lg">{selectedBooking.name}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Icon name="Phone" size={16} className="text-primary" />
                    Телефон
                  </h4>
                  <p>{selectedBooking.phone}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Icon name="Mail" size={16} className="text-primary" />
                    Email
                  </h4>
                  <p>{selectedBooking.email}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Icon name="Calendar" size={16} className="text-primary" />
                    Дата создания
                  </h4>
                  <p>{selectedBooking.created_at}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Icon name="MapPin" size={16} className="text-primary" />
                  Адрес уборки
                </h4>
                <p>{selectedBooking.address}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Icon name="Maximize2" size={16} className="text-primary" />
                    Площадь
                  </h4>
                  <p>{selectedBooking.area} м²</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Icon name="Briefcase" size={16} className="text-primary" />
                    Тип услуги
                  </h4>
                  <p>{selectedBooking.service_type}</p>
                </div>
              </div>

              {selectedBooking.comment && (
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Icon name="MessageSquare" size={16} className="text-primary" />
                    Комментарий
                  </h4>
                  <p className="text-muted-foreground">{selectedBooking.comment}</p>
                </div>
              )}

              <div>
                <h4 className="font-semibold mb-3">Изменить статус</h4>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedBooking.status === 'new' ? 'default' : 'outline'}
                    onClick={() => updateBookingStatus(selectedBooking.id, 'new')}
                  >
                    Новая
                  </Button>
                  <Button
                    variant={selectedBooking.status === 'in-progress' ? 'default' : 'outline'}
                    onClick={() => updateBookingStatus(selectedBooking.id, 'in-progress')}
                  >
                    В работе
                  </Button>
                  <Button
                    variant={selectedBooking.status === 'completed' ? 'default' : 'outline'}
                    onClick={() => updateBookingStatus(selectedBooking.id, 'completed')}
                  >
                    Выполнена
                  </Button>
                  <Button
                    variant={selectedBooking.status === 'cancelled' ? 'destructive' : 'outline'}
                    onClick={() => updateBookingStatus(selectedBooking.id, 'cancelled')}
                  >
                    Отменена
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button
                  variant="destructive"
                  onClick={() => deleteBooking(selectedBooking.id)}
                  className="w-full"
                >
                  <Icon name="Trash2" size={18} className="mr-2" />
                  Удалить заявку
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}