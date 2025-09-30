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
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-4">Наши работы</h3>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground">Результаты говорят сами за себя</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {beforeAfter.map((item, idx) => (
            <Card key={idx} className="overflow-hidden animate-fade-in hover:shadow-2xl transition-all duration-300" style={{ animationDelay: `${idx * 150}ms` }}>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                  <Icon name="CheckCircle" className="text-primary" size={20} />
                  {item.title}
                </CardTitle>
                <CardDescription className="text-sm">{item.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="relative group">
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-semibold z-10 shadow-lg">
                    До
                  </div>
                  <img 
                    src={item.before} 
                    alt="До уборки" 
                    className="w-full h-40 sm:h-48 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-center justify-center">
                  <div className="bg-primary text-primary-foreground rounded-full p-1.5 sm:p-2">
                    <Icon name="ArrowDown" size={20} />
                  </div>
                </div>
                <div className="relative group">
                  <div className="absolute top-2 left-2 bg-green-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-semibold z-10 shadow-lg">
                    После
                  </div>
                  <img 
                    src={item.after} 
                    alt="После уборки" 
                    className="w-full h-40 sm:h-48 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
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