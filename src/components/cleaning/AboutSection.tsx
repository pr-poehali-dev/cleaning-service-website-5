export default function AboutSection() {
  return (
    <section id="about" className="py-12 sm:py-16 lg:py-20" itemScope itemType="https://schema.org/Organization">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
          <div className="animate-fade-in">
            <img
              src="https://cdn.poehali.dev/files/bdef7af6-032c-44ed-9508-e5ba24733ae0.jpg"
              alt="Команда клининговой компании Top Clean Service"
              title="Профессиональные клинеры"
              className="rounded-2xl shadow-xl w-full h-auto object-cover"
              itemProp="image"
              loading="lazy"
            />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6" itemProp="name">О компании Top Clean Service</h2>
            <div className="space-y-3 sm:space-y-4 text-base sm:text-lg text-muted-foreground">
              <p itemProp="description">
                Мы — команда профессионалов с более чем 10-летним опытом в сфере клининговых услуг. 
                Наша миссия — создавать идеально чистые пространства, где приятно жить и работать.
              </p>
              <p>
                Используем только сертифицированное оборудование и экологичные моющие средства, 
                безопасные для здоровья людей и домашних животных.
              </p>
              <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-4 sm:pt-6">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-1 sm:mb-2">500+</div>
                  <div className="text-xs sm:text-sm">Довольных клиентов</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary mb-1 sm:mb-2">10+</div>
                  <div className="text-xs sm:text-sm">Лет опыта</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-accent mb-1 sm:mb-2">100%</div>
                  <div className="text-xs sm:text-sm">Гарантия качества</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}