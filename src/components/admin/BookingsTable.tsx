import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Booking } from './types';

interface BookingsTableProps {
  bookings: Booking[];
  searchQuery: string;
  statusFilter: string;
  onSearchChange: (query: string) => void;
  onStatusFilterChange: (status: string) => void;
  onViewBooking: (booking: Booking) => void;
}

const getStatusBadge = (status: Booking['status']) => {
  const variants: Record<string, { variant: any; label: string; color: string }> = {
    'new': { variant: 'default', label: 'Новая', color: 'bg-blue-500' },
    'assigned': { variant: 'secondary', label: 'Назначена', color: 'bg-purple-500' },
    'in-progress': { variant: 'secondary', label: 'В работе', color: 'bg-yellow-500' },
    'completed': { variant: 'outline', label: 'Выполнена', color: 'bg-green-500' },
    'cancelled': { variant: 'destructive', label: 'Отменена', color: 'bg-red-500' }
  };
  const config = variants[status] || { variant: 'default', label: status, color: 'bg-gray-500' };
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export default function BookingsTable({
  bookings,
  searchQuery,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
  onViewBooking
}: BookingsTableProps) {
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.phone.includes(searchQuery) ||
      booking.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
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
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="px-4 py-2 rounded-md border border-input bg-background"
          >
            <option value="all">Все статусы</option>
            <option value="new">Новые</option>
            <option value="assigned">Назначена</option>
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
                <TableHead>Ответственный</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
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
                    <TableCell className="text-sm">
                      {booking.assignee_name ? (
                        <Badge variant="outline" className="gap-1">
                          <Icon name="User" size={12} />
                          {booking.assignee_name}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-xs">Не назначен</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{booking.created_at}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewBooking(booking)}
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
  );
}