import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import { User, USERS_API_URL } from '@/components/admin/types';

interface UsersManagerProps {
  currentUserRole: string;
}

export default function UsersManager({ currentUserRole }: UsersManagerProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    role: 'operator' as User['role']
  });
  const { toast } = useToast();

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(USERS_API_URL);
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить пользователей',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        full_name: user.full_name,
        phone: user.phone,
        role: user.role
      });
    } else {
      setEditingUser(null);
      setFormData({
        full_name: '',
        phone: '',
        role: 'operator'
      });
    }
    setShowDialog(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.full_name || !formData.phone || !formData.role) {
      toast({
        title: 'Ошибка',
        description: 'Все поля обязательны для заполнения',
        variant: 'destructive'
      });
      return;
    }

    try {
      const url = editingUser 
        ? `${USERS_API_URL}?id=${editingUser.id}` 
        : USERS_API_URL;
      
      const method = editingUser ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-User-Role': currentUserRole
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        
        if (editingUser) {
          setUsers(users.map(u => u.id === editingUser.id ? result : u));
          toast({
            title: 'Пользователь обновлён',
            description: 'Изменения успешно сохранены'
          });
        } else {
          setUsers([result, ...users]);
          toast({
            title: 'Пользователь добавлен',
            description: 'Новый пользователь успешно создан'
          });
        }
        
        setShowDialog(false);
      } else {
        const errorData = await response.json();
        toast({
          title: 'Ошибка',
          description: errorData.error || 'Не удалось сохранить пользователя',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить пользователя',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (userId: number) => {
    if (!confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      return;
    }

    try {
      const response = await fetch(`${USERS_API_URL}?id=${userId}`, {
        method: 'DELETE',
        headers: {
          'X-User-Role': currentUserRole
        }
      });

      if (response.ok) {
        setUsers(users.filter(u => u.id !== userId));
        toast({
          title: 'Пользователь удалён',
          description: 'Пользователь успешно удалён из системы'
        });
      } else {
        const errorData = await response.json();
        toast({
          title: 'Ошибка',
          description: errorData.error || 'Не удалось удалить пользователя',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить пользователя',
        variant: 'destructive'
      });
    }
  };

  const getRoleLabel = (role: User['role']) => {
    const labels = {
      super_admin: 'Главный администратор',
      admin: 'Администратор',
      manager: 'Менеджер',
      operator: 'Оператор'
    };
    return labels[role] || role;
  };

  const getRoleColor = (role: User['role']) => {
    const colors = {
      super_admin: 'bg-purple-100 text-purple-800',
      admin: 'bg-blue-100 text-blue-800',
      manager: 'bg-green-100 text-green-800',
      operator: 'bg-gray-100 text-gray-800'
    };
    return colors[role] || colors.operator;
  };

  if (currentUserRole !== 'super_admin') {
    return (
      <div className="text-center py-12">
        <Icon name="Lock" size={64} className="mx-auto mb-4 text-gray-400" />
        <p className="text-xl text-gray-600">Доступ запрещён</p>
        <p className="text-gray-500 mt-2">Только главный администратор может управлять пользователями</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Управление пользователями</h2>
          <p className="text-gray-600 mt-1">Добавляйте и редактируйте пользователей системы</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Icon name="UserPlus" size={18} className="mr-2" />
          Добавить пользователя
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Icon name="Loader2" className="animate-spin text-primary" size={48} />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <Card key={user.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon name="User" className="text-primary" size={24} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{user.full_name}</CardTitle>
                      <CardDescription>{user.phone}</CardDescription>
                    </div>
                  </div>
                </div>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${getRoleColor(user.role)}`}>
                  {getRoleLabel(user.role)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleOpenDialog(user)}
                  >
                    <Icon name="Pencil" size={16} className="mr-1" />
                    Изменить
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(user.id)}
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingUser ? 'Редактировать пользователя' : 'Добавить пользователя'}
            </DialogTitle>
            <DialogDescription>
              Заполните информацию о пользователе
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">ФИО</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Иванов Иван Иванович"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Номер телефона</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+79991234567"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Роль</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value as User['role'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super_admin">Главный администратор</SelectItem>
                    <SelectItem value="admin">Администратор</SelectItem>
                    <SelectItem value="manager">Менеджер</SelectItem>
                    <SelectItem value="operator">Оператор</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                Отмена
              </Button>
              <Button type="submit">
                {editingUser ? 'Сохранить' : 'Добавить'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
