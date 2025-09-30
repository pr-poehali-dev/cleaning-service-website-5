import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { Booking } from './types';

interface BookingDetailDialogProps {
  booking: Booking | null;
  onClose: () => void;
  onStatusUpdate: (id: number, status: Booking['status']) => void;
  onDeleteClick: () => void;
}

export default function BookingDetailDialog({
  booking,
  onClose,
  onStatusUpdate,
  onDeleteClick
}: BookingDetailDialogProps) {
  if (!booking) return null;

  return (
    <Dialog open={!!booking} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="FileText" className="text-primary" />
            Заявка #{booking.id}
          </DialogTitle>
          <DialogDescription>Детальная информация о заявке</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Icon name="User" size={16} className="text-primary" />
                Клиент
              </h4>
              <p className="text-lg">{booking.name}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Icon name="Phone" size={16} className="text-primary" />
                Телефон
              </h4>
              <p>{booking.phone}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Icon name="Mail" size={16} className="text-primary" />
                Email
              </h4>
              <p>{booking.email}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Icon name="Calendar" size={16} className="text-primary" />
                Дата создания
              </h4>
              <p>{booking.created_at}</p>
            </div>
          </div>

          {(booking.booking_date || booking.booking_time) && (
            <div className="bg-primary/5 p-4 rounded-lg">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Icon name="Clock" size={16} className="text-primary" />
                Желаемое время уборки
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                {booking.booking_date && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Дата</p>
                    <p className="text-lg font-medium">{new Date(booking.booking_date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                )}
                {booking.booking_time && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Время</p>
                    <p className="text-lg font-medium">{booking.booking_time}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Icon name="MapPin" size={16} className="text-primary" />
              Адрес уборки
            </h4>
            <p>{booking.address}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Icon name="Maximize2" size={16} className="text-primary" />
                Площадь
              </h4>
              <p>{booking.area} м²</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Icon name="Briefcase" size={16} className="text-primary" />
                Тип услуги
              </h4>
              <p>{booking.service_type}</p>
            </div>
          </div>

          {booking.comment && (
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Icon name="MessageSquare" size={16} className="text-primary" />
                Комментарий
              </h4>
              <p className="text-muted-foreground">{booking.comment}</p>
            </div>
          )}

          <div>
            <h4 className="font-semibold mb-3">Изменить статус</h4>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={booking.status === 'new' ? 'default' : 'outline'}
                onClick={() => onStatusUpdate(booking.id, 'new')}
              >
                Новая
              </Button>
              <Button
                variant={booking.status === 'in-progress' ? 'default' : 'outline'}
                onClick={() => onStatusUpdate(booking.id, 'in-progress')}
              >
                В работе
              </Button>
              <Button
                variant={booking.status === 'completed' ? 'default' : 'outline'}
                onClick={() => onStatusUpdate(booking.id, 'completed')}
              >
                Выполнена
              </Button>
              <Button
                variant={booking.status === 'cancelled' ? 'destructive' : 'outline'}
                onClick={() => onStatusUpdate(booking.id, 'cancelled')}
              >
                Отменена
              </Button>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button
              variant="destructive"
              onClick={onDeleteClick}
              className="w-full"
            >
              <Icon name="Trash2" size={18} className="mr-2" />
              Удалить заявку
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}