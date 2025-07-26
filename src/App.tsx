import { useState } from "react";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";
import { TrackingForm } from "./components/TrackingForm";
import { AdminPanel } from "./components/AdminPanel";
import { ThemeToggle } from "./components/ThemeToggle";
// import { Toaster } from "./components/ui/sonner";
import { 
  Package, 
  Settings, 
  Shield, 
  Truck, 
  Clock, 
  Globe,
  Phone,
  Mail,
  MapPin
} from "lucide-react";

function AppContent() {
  const [currentView, setCurrentView] = useState<'client' | 'admin'>('client');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Package className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold">CargoTrack</h1>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => setCurrentView('client')}
                className={`text-sm transition-colors ${
                  currentView === 'client' 
                    ? 'text-primary font-medium' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Отслеживание
              </button>
              <button
                onClick={() => setCurrentView('admin')}
                className={`text-sm transition-colors ${
                  currentView === 'admin' 
                    ? 'text-primary font-medium' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Админ панель
              </button>
            </nav>

            <div className="flex items-center gap-4">
              <ThemeToggle />
              <div className="hidden md:flex items-center gap-2">
                <Button
                  variant={currentView === 'client' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentView('client')}
                >
                  <Package className="w-4 h-4 mr-2" />
                  Клиенты
                </Button>
                <Button
                  variant={currentView === 'admin' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentView('admin')}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Админ
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden pb-4">
            <div className="flex space-x-2">
              <Button
                variant={currentView === 'client' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentView('client')}
                className="flex-1"
              >
                <Package className="w-4 h-4 mr-2" />
                Клиенты
              </Button>
              <Button
                variant={currentView === 'admin' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentView('admin')}
                className="flex-1"
              >
                <Settings className="w-4 h-4 mr-2" />
                Админ
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'client' ? (
          <div className="space-y-8">
            {/* Hero Section */}
            <section className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <Truck className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight">
                Отслеживание грузов
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Узнайте актуальное местоположение и статус вашего груза в режиме реального времени
              </p>
            </section>

            {/* Tracking Form */}
            <TrackingForm />

            {/* Features */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-4">
                    <Globe className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Глобальное отслеживание</h3>
                  <p className="text-sm text-muted-foreground">
                    Отслеживайте грузы по всему миру в режиме реального времени
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
                    <Clock className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Быстрые уведомления</h3>
                  <p className="text-sm text-muted-foreground">
                    Получайте мгновенные уведомления об изменении статуса
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full mb-4">
                    <Shield className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Безопасность</h3>
                  <p className="text-sm text-muted-foreground">
                    Ваши данные защищены современными технологиями шифрования
                  </p>
                </CardContent>
              </Card>
            </section>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Admin Header */}
            <section className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <Settings className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight">
                Панель администратора
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Управляйте системой отслеживания грузов и настройками Telegram бота
              </p>
            </section>

            {/* Admin Panel */}
            <AdminPanel />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-6 h-6 text-primary" />
                <h3 className="font-bold">CargoTrack</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Надежная система отслеживания грузов с поддержкой Telegram бота
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Услуги</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Отслеживание грузов</a></li>
                <li><a href="#" className="hover:text-foreground">Telegram бот</a></li>
                <li><a href="#" className="hover:text-foreground">API интеграция</a></li>
                <li><a href="#" className="hover:text-foreground">Уведомления</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Поддержка</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Документация</a></li>
                <li><a href="#" className="hover:text-foreground">FAQ</a></li>
                <li><a href="#" className="hover:text-foreground">Техподдержка</a></li>
                <li><a href="#" className="hover:text-foreground">Статус системы</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Контакты</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>+7 (999) 123-45-67</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>support@cargotrack.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Москва, Россия</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 CargoTrack. Все права защищены.</p>
          </div>
        </div>
      </footer>

      {/* <Toaster /> */}
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}