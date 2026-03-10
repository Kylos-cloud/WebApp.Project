import { Search, Heart, ShoppingCart, ChevronDown, User } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-black/10">
      {/* Top Bar */}
      <div className="max-w-[1400px] mx-auto px-8 py-6">
        <div className="flex items-center justify-between gap-8">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-4xl" style={{ fontFamily: "'Playfair Display', serif" }}>
              SHOP
            </h1>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Бараа хайх..."
                className="w-full pl-14 pr-6 py-4 bg-white rounded-full border border-black/10 focus:outline-none focus:ring-2 focus:ring-black/20 transition-shadow"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 hover:opacity-70 transition-opacity">
              <User className="w-5 h-5" />
              <span className="text-sm">Нэвтрэх</span>
            </button>
            
            <button className="hover:opacity-70 transition-opacity">
              <Heart className="w-6 h-6" />
            </button>
            
            <button className="relative hover:opacity-70 transition-opacity">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-black text-white text-xs flex items-center justify-center rounded-full">
                3
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="border-t border-black/10">
        <div className="max-w-[1400px] mx-auto px-8">
          <nav className="flex items-center justify-center gap-8 py-4 bg-[#00000000]">
            <div className="relative flex-shrink-0">
              <button
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-black/5 transition-colors"
              >
                <span className="uppercase text-sm tracking-wide">Бүх ангилал</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {isDropdownOpen && (
                <div
                  onMouseEnter={() => setIsDropdownOpen(true)}
                  onMouseLeave={() => setIsDropdownOpen(false)}
                  className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-lg border border-black/10 py-2 z-50"
                >
                  {["Хувцас", "Электроникс", "Гэр ахуй", "Гоо сайхан", "Тоглоом", "Гэрийн тэжээвэр амьтан", "Технологи"].map((item) => (
                    <button
                      key={item}
                      className="w-full px-6 py-3 text-left text-sm hover:bg-black/5 transition-colors"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {["NEW", "SALES", "SPECIAL", "BRANDS"].map((item) => (
              <button
                key={item}
                className="uppercase text-sm tracking-wide hover:opacity-70 transition-opacity flex-shrink-0"
              >
                {item}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}