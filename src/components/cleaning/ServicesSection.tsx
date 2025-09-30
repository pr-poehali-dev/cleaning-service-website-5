import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const services = [
  {
    title: 'Офисная уборка',
    description: 'Профессиональная уборка офисных помещений любой площади',
    icon: 'Building2',
    price: 'от 500 ₽/м²'
  },
  {
    title: 'Квартиры и дома',
    description: 'Генеральная и поддерживающая уборка жилых помещений',
    icon: 'Home',
    price: 'от 300 ₽/м²'
  },
  {
    title: 'После ремонта',
    description: 'Уборка после строительных и ремонтных работ',
    icon: 'Paintbrush',
    price: 'от 700 ₽/м²'
  },
  {
    title: 'Химчистка мебели',
    description: 'Глубокая чистка мягкой мебели и ковров',
    icon: 'Armchair',
    price: 'от 1500 ₽'
  }
];

export default function ServicesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h3 className="text-4xl font-bold text-center mb-12">Наши услуги</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, idx) => (
            <Card key={idx} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Icon name={service.icon as any} className="text-primary" size={32} />
                </div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-primary">{service.price}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}