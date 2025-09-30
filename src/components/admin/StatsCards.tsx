import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatsCardsProps {
  total: number;
  newCount: number;
  inProgress: number;
  completed: number;
}

export default function StatsCards({ total, newCount, inProgress, completed }: StatsCardsProps) {
  return (
    <div className="grid md:grid-cols-4 gap-6 mb-8">
      <Card className="animate-fade-in">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Всего заявок</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{total}</div>
        </CardContent>
      </Card>
      
      <Card className="animate-fade-in" style={{ animationDelay: '100ms' }}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Новые</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-500">{newCount}</div>
        </CardContent>
      </Card>
      
      <Card className="animate-fade-in" style={{ animationDelay: '200ms' }}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">В работе</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-yellow-500">{inProgress}</div>
        </CardContent>
      </Card>
      
      <Card className="animate-fade-in" style={{ animationDelay: '300ms' }}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Выполнено</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-500">{completed}</div>
        </CardContent>
      </Card>
    </div>
  );
}