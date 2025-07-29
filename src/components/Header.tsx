// import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
// import clsx from "clsx"; // не забудь установить: npm i clsx

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md shadow-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary tracking-tight">
              Freelance<span className="text-black">Hub</span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">
              Найти работу
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Найти фрилансеров
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Как это работает
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {/* <Button variant="outline" size="sm" className="rounded-full">
              <User className="w-4 h-4 mr-2" />
              Войти
            </Button>
            <Button size="sm" className="rounded-full">
              <PlusCircle className="w-4 h-4 mr-2" />
              Разместить работу
            </Button> */}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-primary transition"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col space-y-4 text-sm font-medium text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">
                Найти работу
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Найти фрилансеров
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Как это работает
              </a>
              <div className="flex flex-col space-y-2 pt-4">
                {/* <Button variant="outline" size="sm" className="rounded-full">
                  Войти
                </Button>
                <Button size="sm" className="rounded-full">
                  Разместить работу
                </Button> */}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
