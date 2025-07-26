import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search, User, PlusCircle, Menu } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary">FreelanceHub</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-600 hover:text-primary">Найти работу</a>
            <a href="#" className="text-gray-600 hover:text-primary">Найти фрилансеров</a>
            <a href="#" className="text-gray-600 hover:text-primary">Как это работает</a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <User className="w-4 h-4 mr-2" />
              Войти
            </Button>
            <Button size="sm">
              <PlusCircle className="w-4 h-4 mr-2" />
              Разместить работу
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-primary"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <a href="#" className="text-gray-600 hover:text-primary">Найти работу</a>
              <a href="#" className="text-gray-600 hover:text-primary">Найти фрилансеров</a>
              <a href="#" className="text-gray-600 hover:text-primary">Как это работает</a>
              <div className="flex flex-col space-y-2 pt-4">
                <Button variant="outline" size="sm">Войти</Button>
                <Button size="sm">Разместить работу</Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}