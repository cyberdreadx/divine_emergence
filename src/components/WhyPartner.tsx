import plateImg from "@/assets/plate.jpg";

const WhyPartner = () => {
  return (
    <section className="py-24 px-6 bg-section-light">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">For Brands</p>
        <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-14">Why Partner With Us</h2>

        <div className="relative w-64 h-64 mx-auto mb-10">
          <div className="absolute inset-0 rounded-full bg-accent/50 blur-2xl" />
          <img
            src={plateImg}
            alt="Premium wellness presentation"
            className="relative w-full h-full object-cover rounded-full shadow-xl"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-foreground text-xs leading-relaxed max-w-[140px] bg-card/80 backdrop-blur rounded-lg p-3">
              Premium products staged elegantly with your brand for an unforgettable gift bag experience.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyPartner;
