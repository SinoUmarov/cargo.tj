import { useState, useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";
import { TrackingForm } from "./components/TrackingForm";
import { AdminPanel } from "./components/AdminPanel";
import { ThemeToggle } from "./components/ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Package, 
  Settings, 
  Shield, 
  Truck, 
  Clock, 
  Globe,
  Phone,
  Mail,
  MapPin,
  ChevronRight
} from "lucide-react";
// import { Toaster } from 'sonner'

function AppContent() {
  const [currentView, setCurrentView] = useState<'client' | 'admin'>('client');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Modern Header with glass morphism effect */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-background/80 backdrop-blur-md border-b' : 'bg-transparent border-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <Package className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-foreground bg-clip-text text-transparent">
                CargoTrack
              </h1>
            </motion.div>

            <nav className="hidden md:flex items-center space-x-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentView('client')}
                className={`relative px-3 py-1.5 rounded-full text-sm transition-all ${
                  currentView === 'client' 
                    ? 'text-primary font-medium' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {currentView === 'client' && (
                  <motion.span 
                    layoutId="navIndicator"
                    className="absolute inset-0 bg-primary/10 rounded-full"
                    transition={{ type: 'spring', bounce: 0.3, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1">
                  <Package className="w-4 h-4" />
                  Отслеживание
                </span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentView('admin')}
                className={`relative px-3 py-1.5 rounded-full text-sm transition-all ${
                  currentView === 'admin' 
                    ? 'text-primary font-medium' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {currentView === 'admin' && (
                  <motion.span 
                    layoutId="navIndicator"
                    className="absolute inset-0 bg-primary/10 rounded-full"
                    transition={{ type: 'spring', bounce: 0.3, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1">
                  <Settings className="w-4 h-4" />
                  Админ панель
                </span>
              </motion.button>
            </nav>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <ThemeToggle />
              <div className="hidden md:flex items-center gap-2">
                <Button
                  variant={currentView === 'client' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentView('client')}
                  className="gap-1"
                >
                  <Package className="w-4 h-4" />
                  Клиенты
                </Button>
                <Button
                  variant={currentView === 'admin' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentView('admin')}
                  className="gap-1"
                >
                  <Settings className="w-4 h-4" />
                  Админ
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Content with padding for fixed header */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <AnimatePresence mode="wait">
          {currentView === 'client' ? (
            <motion.div
              key="client"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-12"
            >
              {/* Hero Section */}
              <section className="text-center space-y-6">
                <motion.div 
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 10 }}
                  className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl mb-6 shadow-sm"
                >
                  <Truck className="w-10 h-10 text-primary" />
                </motion.div>
                <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  Отслеживание грузов
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Узнайте актуальное местоположение и статус вашего груза в режиме реального времени
                </p>
              </section>

              {/* Tracking Form */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <TrackingForm />
              </motion.section>
{/* <Toaster /> */}
              {/* Features */}
              <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Card className="h-full border-border/20 bg-background/50 backdrop-blur-sm hover:shadow-lg transition-shadow">
                    <CardContent className="p-8 text-center">
                      <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-500/10 rounded-xl mb-6 mx-auto">
                        <Globe className="w-6 h-6 text-blue-500" />
                      </div>
                      <h3 className="text-lg font-semibold mb-3">Глобальное отслеживание</h3>
                      <p className="text-sm text-muted-foreground">
                        Отслеживайте грузы по всему миру в режиме реального времени с нашей обширной сетью
                      </p>
                      <Button variant="link" size="sm" className="mt-4 text-blue-500 gap-1">
                        Подробнее <ChevronRight className="w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Card className="h-full border-border/20 bg-background/50 backdrop-blur-sm hover:shadow-lg transition-shadow">
                    <CardContent className="p-8 text-center">
                      <div className="inline-flex items-center justify-center w-14 h-14 bg-green-500/10 rounded-xl mb-6 mx-auto">
                        <Clock className="w-6 h-6 text-green-500" />
                      </div>
                      <h3 className="text-lg font-semibold mb-3">Быстрые уведомления</h3>
                      <p className="text-sm text-muted-foreground">
                        Получайте мгновенные push-уведомления и email-оповещения об изменении статуса
                      </p>
                      <Button variant="link" size="sm" className="mt-4 text-green-500 gap-1">
                        Подробнее <ChevronRight className="w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Card className="h-full border-border/20 bg-background/50 backdrop-blur-sm hover:shadow-lg transition-shadow">
                    <CardContent className="p-8 text-center">
                      <div className="inline-flex items-center justify-center w-14 h-14 bg-purple-500/10 rounded-xl mb-6 mx-auto">
                        <Shield className="w-6 h-6 text-purple-500" />
                      </div>
                      <h3 className="text-lg font-semibold mb-3">Безопасность</h3>
                      <p className="text-sm text-muted-foreground">
                        Ваши данные защищены современными технологиями шифрования и соответствуют GDPR
                      </p>
                      <Button variant="link" size="sm" className="mt-4 text-purple-500 gap-1">
                        Подробнее <ChevronRight className="w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </section>
            </motion.div>
          ) : (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-12"
            >
              {/* Admin Header */}
              <section className="text-center space-y-6">
                <motion.div 
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 10 }}
                  className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl mb-6 shadow-sm"
                >
                  <Settings className="w-10 h-10 text-primary" />
                </motion.div>
                <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  Панель администратора
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Управляйте системой отслеживания грузов и настройками Telegram бота
                </p>
              </section>

              {/* Admin Panel */}
              <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <AdminPanel />
              </motion.section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modern Footer */}
      <footer className="border-t bg-background/50 backdrop-blur-lg mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-6 h-6 text-primary" />
                <h3 className="font-bold text-lg">CargoTrack</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Инновационная система отслеживания грузов с интеграцией Telegram бота и аналитикой в реальном времени.
              </p>
            </motion.div>

            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Услуги</h4>
              <ul className="space-y-3">
                {['Отслеживание грузов', 'Telegram бот', 'API интеграция', 'Уведомления', 'Аналитика'].map((item, i) => (
                  <motion.li 
                    key={i}
                    whileHover={{ x: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2">
                      <ChevronRight className="w-3 h-3 text-primary" />
                      {item}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Поддержка</h4>
              <ul className="space-y-3">
                {['Документация', 'FAQ', 'Техподдержка', 'Статус системы', 'Блог'].map((item, i) => (
                  <motion.li 
                    key={i}
                    whileHover={{ x: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2">
                      <ChevronRight className="w-3 h-3 text-primary" />
                      {item}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Контакты</h4>
              <ul className="space-y-3">
                <motion.li 
                  whileHover={{ x: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Phone className="w-4 h-4 text-blue-500" />
                  </div>
                  <span>+7 (999) 123-45-67</span>
                </motion.li>
                <motion.li 
                  whileHover={{ x: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground"
                >
                  <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-green-500" />
                  </div>
                  <span>support@cargotrack.com</span>
                </motion.li>
                <motion.li 
                  whileHover={{ x: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground"
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-purple-500" />
                  </div>
                  <span>Москва, Россия</span>
                </motion.li>
              </ul>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="border-t border-border/20 mt-12 pt-8 text-center text-sm text-muted-foreground"
          >
            <p>&copy; {new Date().getFullYear()} CargoTrack. Все права защищены.</p>
          </motion.div>
        </div>
      </footer>
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