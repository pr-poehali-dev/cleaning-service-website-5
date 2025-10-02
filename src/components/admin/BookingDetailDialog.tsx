import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { Booking, User } from './types';

interface BookingDetailDialogProps {
  booking: Booking | null;
  onClose: () => void;
  onStatusUpdate: (id: number, status: Booking['status']) => void;
  onAssigneeUpdate: (id: number, assigneeId: number | null) => void;
  onDeleteClick: () => void;
  onUpdateBooking: (id: number, data: Partial<Booking>) => void;
  users: User[];
  currentUserRole: string;
}

export default function BookingDetailDialog({
  booking,
  onClose,
  onStatusUpdate,
  onAssigneeUpdate,
  onDeleteClick,
  onUpdateBooking,
  users,
  currentUserRole
}: BookingDetailDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Booking>>({});
  const canEdit = ['super_admin', 'admin'].includes(currentUserRole);

  useEffect(() => {
    if (booking) {
      setEditData({
        name: booking.name,
        phone: booking.phone,
        email: booking.email,
        address: booking.address,
        area: booking.area,
        service_type: booking.service_type,
        booking_date: booking.booking_date,
        booking_time: booking.booking_time,
        comment: booking.comment
      });
      setIsEditing(false);
    }
  }, [booking]);

  if (!booking) return null;

  const handleSave = () => {
    onUpdateBooking(booking.id, editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      name: booking.name,
      phone: booking.phone,
      email: booking.email,
      address: booking.address,
      area: booking.area,
      service_type: booking.service_type,
      booking_date: booking.booking_date,
      booking_time: booking.booking_time,
      comment: booking.comment
    });
    setIsEditing(false);
  };

  return (
    <Dialog open={!!booking} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="FileText" className="text-primary" />
              Заявка #{booking.id}
            </div>
            {canEdit && !isEditing && (
              <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                <Icon name="Pencil" size={16} className="mr-2" />
                Редактировать
              </Button>
            )}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 'Редактирование информации о заявке' : 'Детальная информация о заявке'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="flex items-center gap-2 mb-2">
                <Icon name="User" size={16} className="text-primary" />
                Клиент
              </Label>
              {isEditing ? (
                <Input
                  value={editData.name || ''}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                />
              ) : (
                <p className="text-lg">{booking.name}</p>
              )}
            </div>
            <div>
              <Label className="flex items-center gap-2 mb-2">
                <Icon name="Phone" size={16} className="text-primary" />
                Телефон
              </Label>
              {isEditing ? (
                <Input
                  value={editData.phone || ''}
                  onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                />
              ) : (
                <p>{booking.phone}</p>
              )}
            </div>
            <div>
              <Label className="flex items-center gap-2 mb-2">
                <Icon name="Mail" size={16} className="text-primary" />
                Email
              </Label>
              {isEditing ? (
                <Input
                  type="email"
                  value={editData.email || ''}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                />
              ) : (
                <p>{booking.email}</p>
              )}
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Icon name="Calendar" size={16} className="text-primary" />
                Дата создания
              </h4>
              <p>{booking.created_at}</p>
            </div>
          </div>

          <div className="bg-primary/5 p-4 rounded-lg">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Icon name="Clock" size={16} className="text-primary" />
              Желаемое время уборки
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm mb-1">Дата</Label>
                {isEditing ? (
                  <Input
                    type="date"
                    value={editData.booking_date || ''}
                    onChange={(e) => setEditData({ ...editData, booking_date: e.target.value })}
                  />
                ) : (
                  <p className="text-lg font-medium">
                    {booking.booking_date ? new Date(booking.booking_date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
                  </p>
                )}
              </div>
              <div>
                <Label className="text-sm mb-1">Время</Label>
                {isEditing ? (
                  <Input
                    type="time"
                    value={editData.booking_time || ''}
                    onChange={(e) => setEditData({ ...editData, booking_time: e.target.value })}
                  />
                ) : (
                  <p className="text-lg font-medium">{booking.booking_time || '—'}</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <Label className="flex items-center gap-2 mb-2">
              <Icon name="MapPin" size={16} className="text-primary" />
              Адрес уборки
            </Label>
            {isEditing ? (
              <Input
                value={editData.address || ''}
                onChange={(e) => setEditData({ ...editData, address: e.target.value })}
              />
            ) : (
              <p>{booking.address}</p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="flex items-center gap-2 mb-2">
                <Icon name="Maximize2" size={16} className="text-primary" />
                Площадь
              </Label>
              {isEditing ? (
                <Input
                  type="number"
                  value={editData.area || ''}
                  onChange={(e) => setEditData({ ...editData, area: e.target.value })}
                  placeholder="м²"
                />
              ) : (
                <p>{booking.area} м²</p>
              )}
            </div>
            <div>
              <Label className="flex items-center gap-2 mb-2">
                <Icon name="Briefcase" size={16} className="text-primary" />
                Тип услуги
              </Label>
              {isEditing ? (
                <Input
                  value={editData.service_type || ''}
                  onChange={(e) => setEditData({ ...editData, service_type: e.target.value })}
                />
              ) : (
                <p>{booking.service_type}</p>
              )}
            </div>
          </div>

          <div>
            <Label className="flex items-center gap-2 mb-2">
              <Icon name="MessageSquare" size={16} className="text-primary" />
              Комментарий
            </Label>
            {isEditing ? (
              <Textarea
                value={editData.comment || ''}
                onChange={(e) => setEditData({ ...editData, comment: e.target.value })}
                rows={3}
              />
            ) : (
              <p className="text-muted-foreground">{booking.comment || '—'}</p>
            )}
          </div>

          {['super_admin', 'admin'].includes(currentUserRole) && (
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Icon name="UserCheck" size={16} className="text-primary" />
                Ответственный
              </h4>
              <Select
                value={booking.assignee_id?.toString() || 'none'}
                onValueChange={(value) => {
                  const assigneeId = value === 'none' ? null : parseInt(value);
                  onAssigneeUpdate(booking.id, assigneeId);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите ответственного" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">
                    <span className="text-gray-500">Не назначен</span>
                  </SelectItem>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.full_name} ({user.role === 'super_admin' ? 'Гл. администратор' : user.role === 'admin' ? 'Администратор' : user.role === 'manager' ? 'Менеджер' : 'Оператор'})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {booking.assignee_name && (
                <p className="text-sm text-muted-foreground mt-2">
                  Текущий ответственный: <span className="font-medium">{booking.assignee_name}</span>
                </p>
              )}
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
                variant={booking.status === 'assigned' ? 'default' : 'outline'}
                onClick={() => onStatusUpdate(booking.id, 'assigned')}
              >
                Назначен ответственный
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

          <div className="pt-4 border-t flex gap-3">
            {isEditing ? (
              <>
                <Button onClick={handleSave} className="flex-1">
                  <Icon name="Check" size={18} className="mr-2" />
                  Сохранить изменения
                </Button>
                <Button variant="outline" onClick={handleCancel} className="flex-1">
                  <Icon name="X" size={18} className="mr-2" />
                  Отменить
                </Button>
              </>
            ) : (
              <Button
                variant="destructive"
                onClick={onDeleteClick}
                className="w-full"
              >
                <Icon name="Trash2" size={18} className="mr-2" />
                Удалить заявку
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}