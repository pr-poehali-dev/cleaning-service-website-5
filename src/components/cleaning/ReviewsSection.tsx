import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

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

export default function ReviewsSection() {
  return (
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
  );
}