import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface LoginFormProps {
  onLogin: (userId: number, userRole: string) => void;
}

const AUTH_API_URL = 'https://functions.poehali.dev/07a5a039-979c-4a7c-a481-9eeb2c0fe91e';

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(AUTH_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        onLogin(data.id, data.role);
        toast({
          title: 'Успешный вход',
          description: `Добро пожаловать, ${data.full_name}`
        });
      } else {
        toast({
          title: 'Ошибка входа',
          description: data.error || 'Неверные учетные данные',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось подключиться к серверу',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

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
                type="text"
                placeholder="Имя пользователя"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="text-lg"
                required
                autoComplete="username"
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-lg"
                required
                autoComplete="current-password"
              />
              <p className="text-xs text-muted-foreground">По умолчанию: admin / admin</p>
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
              <Icon name="LogIn" size={20} className="mr-2" />
              {isLoading ? 'Вход...' : 'Войти'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}