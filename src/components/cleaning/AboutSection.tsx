export default function AboutSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <img 
              src="/img/bdef7af6-032c-44ed-9508-e5ba24733ae0.jpg" 
              alt="Наша команда" 
              className="rounded-2xl shadow-xl"
            />
          </div>
          <div>
            <h3 className="text-4xl font-bold mb-6">О компании CleanPro</h3>
            <div className="space-y-4 text-lg text-muted-foreground">
              <p>
                Мы — команда профессионалов с более чем 10-летним опытом в сфере клининговых услуг. 
                Наша миссия — создавать идеально чистые пространства, где приятно жить и работать.
              </p>
              <p>
                Используем только сертифицированное оборудование и экологичные моющие средства, 
                безопасные для здоровья людей и домашних животных.
              </p>
              <div className="grid grid-cols-3 gap-4 pt-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">500+</div>
                  <div className="text-sm">Довольных клиентов</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-secondary mb-2">10+</div>
                  <div className="text-sm">Лет опыта</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-accent mb-2">100%</div>
                  <div className="text-sm">Гарантия качества</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}