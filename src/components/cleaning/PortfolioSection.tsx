import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const beforeAfter = [
  {
    before: '/img/546498b2-e1ae-46a6-bbdd-4a0e3d9bd26c.jpg',
    after: '/img/2ddd0761-4380-473d-aee3-afe42340cba5.jpg',
    title: 'Офисное помещение',
    description: 'Генеральная уборка офиса 80 м²'
  },
  {
    before: '/img/cae99f40-901d-4773-81d8-a45477c41873.jpg',
    after: '/img/90e32f9d-656b-4f20-9b51-48a6107b0d07.jpg',
    title: 'Гостиная',
    description: 'Химчистка мебели и глубокая уборка'
  },
  {
    before: '/img/335c7f3a-b939-4215-a33d-750d8d45180c.jpg',
    after: '/img/e13d2d9e-5245-41c2-9df2-035d16976c82.jpg',
    title: 'Кухня',
    description: 'Уборка после ремонта'
  }
];

export default function PortfolioSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-bold mb-4">Наши работы</h3>
          <p className="text-xl text-muted-foreground">Результаты говорят сами за себя</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {beforeAfter.map((item, idx) => (
            <Card key={idx} className="overflow-hidden animate-fade-in hover:shadow-2xl transition-all duration-300" style={{ animationDelay: `${idx * 150}ms` }}>
              <CardHeader className="pb-4">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Icon name="CheckCircle" className="text-primary" size={24} />
                  {item.title}
                </CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative group">
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold z-10 shadow-lg">
                    До
                  </div>
                  <img 
                    src={item.before} 
                    alt="До уборки" 
                    className="w-full h-48 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-center justify-center">
                  <div className="bg-primary text-primary-foreground rounded-full p-2">
                    <Icon name="ArrowDown" size={24} />
                  </div>
                </div>
                <div className="relative group">
                  <div className="absolute top-2 left-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold z-10 shadow-lg">
                    После
                  </div>
                  <img 
                    src={item.after} 
                    alt="После уборки" 
                    className="w-full h-48 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}