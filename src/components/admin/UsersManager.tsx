import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
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
    role: 'operator' as User['role'],
    login: '',
    password: ''
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
        role: user.role,
        login: user.login || '',
        password: ''
      });
    } else {
      setEditingUser(null);
      setFormData({
        full_name: '',
        phone: '',
        role: 'operator',
        login: '',
        password: ''
      });
    }
    setShowDialog(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.full_name || !formData.phone || !formData.role) {
      toast({
        title: 'Ошибка',
        description: 'ФИО, телефон и роль обязательны для заполнения',
        variant: 'destructive'
      });
      return;
    }

    if (!editingUser && (!formData.login || !formData.password)) {
      toast({
        title: 'Ошибка',
        description: 'Логин и пароль обязательны при создании пользователя',
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
        <Card>
          <CardContent className="p-0">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>ФИО</TableHead>
                    <TableHead>Телефон</TableHead>
                    <TableHead>Логин</TableHead>
                    <TableHead>Роль</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Пользователи не найдены
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">#{user.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <Icon name="User" className="text-primary" size={16} />
                            </div>
                            <span className="font-medium">{user.full_name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>
                          <code className="text-sm bg-muted px-2 py-1 rounded">{user.login || '—'}</code>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getRoleColor(user.role)}>
                            {getRoleLabel(user.role)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenDialog(user)}
                            >
                              <Icon name="Pencil" size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDelete(user.id)}
                            >
                              <Icon name="Trash2" size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
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
                <Label htmlFor="login">Логин</Label>
                <Input
                  id="login"
                  value={formData.login}
                  onChange={(e) => setFormData({ ...formData, login: e.target.value })}
                  placeholder="username"
                  required={!editingUser}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Пароль {editingUser && <span className="text-muted-foreground text-sm">(оставьте пустым, если не хотите менять)</span>}</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  required={!editingUser}
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