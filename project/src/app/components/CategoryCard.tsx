interface CategoryCardProps {
  title: string;
  imageUrl: string;
}

export function CategoryCard({ title, imageUrl }: CategoryCardProps) {
  return (
    <div className="relative group cursor-pointer overflow-hidden rounded-[20px] h-64 min-w-[300px] shadow-lg hover:shadow-xl transition-all duration-300">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />
      
      <div className="absolute inset-0 flex items-center justify-center">
        <h3 className="text-white text-2xl tracking-wide uppercase">
          {title}
        </h3>
      </div>
    </div>
  );
}