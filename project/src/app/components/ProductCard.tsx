import { Heart } from "lucide-react";

interface ProductCardProps {
  title: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  discount?: number;
}

export function ProductCard({ title, price, originalPrice, imageUrl, discount }: ProductCardProps) {
  return (
    <div className="group cursor-pointer">
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300 mb-4">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {discount && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
            -{discount}%
          </div>
        )}
        
        <button className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-110">
          <Heart className="w-5 h-5" />
        </button>
      </div>
      
      <div className="space-y-1">
        <h4 className="text-sm text-muted-foreground line-clamp-2">
          {title}
        </h4>
        
        <div className="flex items-center gap-3">
          <span className="font-medium">₮{price.toLocaleString()}</span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ₮{originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
