import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { CategoryCard } from "./components/CategoryCard";
import { ProductCard } from "./components/ProductCard";
import { Tag, ArrowRight } from "lucide-react";

export default function App() {
  const categories = [
    {
      title: "CLOTHES",
      imageUrl: "https://images.unsplash.com/photo-1548768041-2fceab4c0b85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG90aGluZyUyMG1pbmltYWwlMjBmYXNoaW9ufGVufDF8fHx8MTc3MjQ1MTU2NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      title: "ELECTRONICS",
      imageUrl: "https://images.unsplash.com/photo-1729058048010-86f7d7c30001?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljcyUyMGRldmljZXMlMjBtaW5pbWFsfGVufDF8fHx8MTc3MjQ1MTU2NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      title: "HOME",
      imageUrl: "https://images.unsplash.com/photo-1621363183028-c97aec91a9f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwaW50ZXJpb3IlMjBtaW5pbWFsfGVufDF8fHx8MTc3MjQ1MTU2NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      title: "BEAUTY",
      imageUrl: "https://images.unsplash.com/photo-1620905985509-dbe622825dec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dHklMjBjb3NtZXRpY3MlMjBtaW5pbWFsfGVufDF8fHx8MTc3MjQ1MTU2NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      title: "TECHNOLOGY",
      imageUrl: "https://images.unsplash.com/photo-1662350689147-3d6c67b7cd10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBwcm9kdWN0JTIwcGhvdG9ncmFwaHl8ZW58MXx8fHwxNzcyNDUxNTY2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      title: "LIFESTYLE",
      imageUrl: "https://images.unsplash.com/photo-1569444743503-f11ed614445b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwZWRpdG9yaWFsJTIwbWluaW1hbHxlbnwxfHx8fDE3NzI0NTE1NjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      title: "TOY/HOBBY",
      imageUrl: "https://images.unsplash.com/photo-1689848330743-41dfd61e0cd4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b3lzJTIwY2hpbGRyZW4lMjBtaW5pbWFsfGVufDF8fHx8MTc3MjQ1MjQxNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      title: "CHILDREN",
      imageUrl: "https://images.unsplash.com/photo-1694551745492-a50025285e0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMGtpZHMlMjBsaWZlc3R5bGV8ZW58MXx8fHwxNzcyNDUyNDE1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      title: "HEALTH SPORT",
      imageUrl: "https://images.unsplash.com/photo-1758875568468-194dfe762ba9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwc3BvcnRzJTIwZXF1aXBtZW50fGVufDF8fHx8MTc3MjM3NzYzOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      title: "STATIONARY",
      imageUrl: "https://images.unsplash.com/photo-1523634540939-0be5fba32c8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGF0aW9uZXJ5JTIwb2ZmaWNlJTIwbWluaW1hbHxlbnwxfHx8fDE3NzI0NTI0MTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      title: "PET",
      imageUrl: "https://images.unsplash.com/photo-1765603950481-3a5879ec2ce7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXQlMjBkb2clMjBjYXR8ZW58MXx8fHwxNzcyNDI5OTYyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    }
  ];

  const saleProducts = [
    {
      title: "Luxury Minimal Watch - Premium Swiss Movement",
      price: 450000,
      originalPrice: 650000,
      discount: 30,
      imageUrl: "https://images.unsplash.com/photo-1561634343-3a2787687046?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaCUyMG1pbmltYWx8ZW58MXx8fHwxNzcyNDUxNTY2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      title: "Premium Sneakers - Limited Edition Collection",
      price: 280000,
      originalPrice: 400000,
      discount: 30,
      imageUrl: "https://images.unsplash.com/photo-1622760807301-4d2351a5a942?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmVha2VycyUyMHByb2R1Y3QlMjBwaG90b2dyYXBoeXxlbnwxfHx8fDE3NzI0MzE2NjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      title: "Modern Product Design - Contemporary Style",
      price: 180000,
      originalPrice: 240000,
      discount: 25,
      imageUrl: "https://images.unsplash.com/photo-1662350689147-3d6c67b7cd10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBwcm9kdWN0JTIwcGhvdG9ncmFwaHl8ZW58MXx8fHwxNzcyNDUxNTY2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      title: "Elegant Fashion Piece - Minimal Design",
      price: 320000,
      originalPrice: 450000,
      discount: 28,
      imageUrl: "https://images.unsplash.com/photo-1569444743503-f11ed614445b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwZWRpdG9yaWFsJTIwbWluaW1hbHxlbnwxfHx8fDE3NzI0NTE1NjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <Hero imageUrl="https://images.unsplash.com/photo-1569444743503-f11ed614445b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwZWRpdG9yaWFsJTIwbWluaW1hbHxlbnwxfHx8fDE3NzI0NTE1NjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" />
      
      {/* Category Section */}
      <section className="max-w-[1400px] mx-auto px-8 py-24">
        <h2 className="text-3xl mb-12 tracking-wide">Ангилал</h2>
        
        <div className="flex gap-8 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map((category) => (
            <CategoryCard
              key={category.title}
              title={category.title}
              imageUrl={category.imageUrl}
            />
          ))}
        </div>
      </section>
      
      {/* Sale Section */}
      <section className="max-w-[1400px] mx-auto px-8 py-24">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <Tag className="w-6 h-6 text-red-500" />
            <h2 className="text-3xl tracking-wide">Хямдралтай</h2>
          </div>
          
          <button className="flex items-center gap-2 text-sm hover:opacity-70 transition-opacity">
            <span>Бүгдийг харах</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {saleProducts.map((product, index) => (
            <ProductCard
              key={index}
              title={product.title}
              price={product.price}
              originalPrice={product.originalPrice}
              discount={product.discount}
              imageUrl={product.imageUrl}
            />
          ))}
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-black/10 mt-24">
        <div className="max-w-[1400px] mx-auto px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <h3 className="text-2xl mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                SHOP
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Minimal marketplace              </p>
            </div>
            
            <div>
              <h4 className="mb-4 text-sm uppercase tracking-wide">Ангилал</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Хувцас</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Электроникс</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Гэр ахуй</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Гоо сайхан</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="mb-4 text-sm uppercase tracking-wide">Тусламж</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Холбоо барих</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Хүргэлт</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Буцаалт</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="mb-4 text-sm uppercase tracking-wide">Бидэнтэй</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Twitter</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-black/10 text-center text-sm text-muted-foreground">© 2026 SHOP. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}