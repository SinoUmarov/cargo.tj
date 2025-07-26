import { useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { 
  Settings, 
  Bot, 
  Save, 
  TestTube, 
  CheckCircle, 
  AlertCircle, 
  BarChart3,
  Users,
  Package,
  MessageSquare,
  LogOut,
  UserCircle
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { 
  saveBotSettings, 
  testBot, 
  loadBotSettings, 
  loadStats, 
  updateBotSettings,
  clearError
} from "../store/slices/adminSlice";
import { logoutUser } from "../store/slices/authSlice";
import { toast } from "sonner";
import { Alert, AlertDescription } from "./ui/alert";

export function AdminDashboard() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { botSettings, stats, isConnected, isLoading, error, isTesting } = useAppSelector((state) => state.admin);

  useEffect(() => {
    dispatch(loadBotSettings());
    dispatch(loadStats());
  }, [dispatch]);

  const handleSaveSettings = async () => {
    if (!botSettings.token.trim()) {
      toast.error('Пожалуйста, введите токен бота');
      return;
    }

    const result = await dispatch(saveBotSettings(botSettings));
    
    if (saveBotSettings.fulfilled.match(result)) {
      toast.success('Настройки сохранены успешно');
    }
  };

  const handleTestBot = async () => {
    if (!isConnected) {
      toast.error('Сначала настройте и сохраните бота');
      return;
    }

    const result = await dispatch(testBot());
    
    if (testBot.fulfilled.match(result)) {
      toast.success('Тест прошел успешно! Бот отвечает на запросы.');
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.success('Вы успешно вышли из системы');
  };

  const handleInputChange = (field: keyof typeof botSettings, value: string) => {
    dispatch(updateBotSettings({ [field]: value }));
    if (error) {
      dispatch(clearError());
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header with user info */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <Settings className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle>Панель администратора</CardTitle>
                <CardDescription>
                  Настройка и управление системой отслеживания грузов
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <UserCircle className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm">
                  {user?.firstName} {user?.lastName}
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Выйти
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="bot-settings" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="bot-settings">Настройки бота</TabsTrigger>
          <TabsTrigger value="statistics">Статистика</TabsTrigger>
          <TabsTrigger value="messages">Сообщения</TabsTrigger>
        </TabsList>

        <TabsContent value="bot-settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                Telegram Bot Configuration
              </CardTitle>
              <CardDescription>
                Настройте подключение к Telegram боту через BotFather
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-sm">
                    {isConnected ? 'Подключено' : 'Не подключено'}
                  </span>
                </div>
                {isConnected && (
                  <Badge variant="outline" className="text-green-600">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Активно
                  </Badge>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="bot-token">Токен бота</Label>
                  <Input
                    id="bot-token"
                    placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
                    value={botSettings.token}
                    onChange={(e) => handleInputChange('token', e.target.value)}
                    type="password"
                    disabled={isLoading}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Получите токен от @BotFather в Telegram
                  </p>
                </div>

                <div>
                  <Label htmlFor="bot-username">Имя пользователя бота</Label>
                  <Input
                    id="bot-username"
                    placeholder="@your_tracking_bot"
                    value={botSettings.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="welcome-message">Приветственное сообщение</Label>
                  <Textarea
                    id="welcome-message"
                    placeholder="Введите сообщение для пользователей"
                    value={botSettings.welcomeMessage}
                    onChange={(e) => handleInputChange('welcomeMessage', e.target.value)}
                    rows={3}
                    disabled={isLoading}
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-4">
                  <Button onClick={handleSaveSettings} className="flex-1" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Сохранение...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Сохранить настройки
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleTestBot}
                    disabled={!isConnected || isTesting}
                  >
                    {isTesting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                        Тестирование...
                      </>
                    ) : (
                      <>
                        <TestTube className="w-4 h-4 mr-2" />
                        Тестировать
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Инструкции по настройке</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm">1</div>
                  <div>
                    <p className="font-medium">Создайте бота</p>
                    <p className="text-sm text-muted-foreground">
                      Напишите @BotFather в Telegram и используйте команду /newbot
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm">2</div>
                  <div>
                    <p className="font-medium">Получите токен</p>
                    <p className="text-sm text-muted-foreground">
                      Скопируйте токен, который предоставит BotFather
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm">3</div>
                  <div>
                    <p className="font-medium">Введите токен</p>
                    <p className="text-sm text-muted-foreground">
                      Вставьте токен в поле выше и сохраните настройки
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <MessageSquare className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Всего запросов</p>
                    <p className="text-2xl font-bold">{stats.totalQueries}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Активных пользователей</p>
                    <p className="text-2xl font-bold">{stats.activeUsers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                    <Package className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Доставлено</p>
                    <p className="text-2xl font-bold">{stats.deliveredPackages}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">В пути</p>
                    <p className="text-2xl font-bold">{stats.pendingPackages}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Последние запросы</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.recentQueries.map((query) => (
                  <div key={query.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">{query.time}</span>
                      <span className="text-sm">{query.user}</span>
                      <code className="text-sm bg-background px-2 py-1 rounded">{query.trackingCode}</code>
                    </div>
                    <Badge variant={query.status === 'success' ? 'default' : 'destructive'}>
                      {query.status === 'success' ? 'Успешно' : 'Ошибка'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Настройка сообщений</CardTitle>
              <CardDescription>
                Настройте тексты сообщений, которые будет отправлять бот
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="not-found-message">Сообщение "Трек-код не найден"</Label>
                <Textarea
                  id="not-found-message"
                  placeholder="Введите сообщение для случая, когда трек-код не найден"
                  value={botSettings.notFoundMessage}
                  onChange={(e) => handleInputChange('notFoundMessage', e.target.value)}
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="delivered-message">Сообщение "Доставлено"</Label>
                <Textarea
                  id="delivered-message"
                  placeholder="Введите сообщение для доставленных посылок"
                  value={botSettings.deliveredMessage}
                  onChange={(e) => handleInputChange('deliveredMessage', e.target.value)}
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="in-transit-message">Сообщение "В пути"</Label>
                <Textarea
                  id="in-transit-message"
                  placeholder="Введите сообщение для посылок в пути"
                  value={botSettings.inTransitMessage}
                  onChange={(e) => handleInputChange('inTransitMessage', e.target.value)}
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="help-message">Справочное сообщение</Label>
                <Textarea
                  id="help-message"
                  placeholder="Введите справочное сообщение"
                  value={botSettings.helpMessage}
                  onChange={(e) => handleInputChange('helpMessage', e.target.value)}
                  rows={3}
                />
              </div>

              <Button onClick={handleSaveSettings} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Сохранение...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Сохранить сообщения
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}