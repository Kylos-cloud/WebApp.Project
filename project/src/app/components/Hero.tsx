interface HeroProps {
  imageUrl: string;
}

export function Hero({ imageUrl }: HeroProps) {
  return (
    <section className="relative w-full h-[500px] bg-black overflow-hidden">
      <img
        src={imageUrl}
        alt="Hero"
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      />
      
      <div className="relative max-w-[1400px] mx-auto px-8 h-full flex items-center">
        <button className="px-12 py-4 border-2 border-white text-white rounded-full hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-widest text-sm"> Бараа үзэх</button>
      </div>
    </section>
  );
}
