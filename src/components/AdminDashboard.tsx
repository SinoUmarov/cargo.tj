
import { useEffect } from "react";
import {
  Settings,
  Bot,
  Save,
  TestTube,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Users,
  MessageSquare,
  LogOut,
  UserCircle,
  Package,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  saveBotSettings,
  testBot,
  loadBotSettings,
  loadStats,
  updateBotSettings,
  clearError,
} from "../store/slices/adminSlice";
import { logoutUser } from "../store/slices/authSlice";
import { toast } from "sonner";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";

export function AdminDashboard() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { botSettings, stats, isConnected, isLoading, error, isTesting } =
    useAppSelector((state) => state.admin);

  useEffect(() => {
    dispatch(loadBotSettings());
    dispatch(loadStats());
  }, [dispatch]);

  const handleSaveSettings = async () => {
    if (!botSettings.token.trim()) {
      toast.error("Пожалуйста, введите токен бота");
      return;
    }
    const result = await dispatch(saveBotSettings(botSettings));
    if (saveBotSettings.fulfilled.match(result)) {
      toast.success("Настройки сохранены успешно");
    }
  };

  const handleTestBot = async () => {
    if (!isConnected) {
      toast.error("Сначала настройте и сохраните бота");
      return;
    }
    const result = await dispatch(testBot());
    if (testBot.fulfilled.match(result)) {
      toast.success("Тест прошел успешно! Бот отвечает на запросы.");
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.success("Вы успешно вышли из системы");
  };

  const handleInputChange = (field, value) => {
    dispatch(updateBotSettings({ [field]: value }));
    if (error) dispatch(clearError());
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 py-8 px-4">
      {/* Header */}
      <Card className="rounded-2xl shadow-xl border border-border bg-background/70 backdrop-blur">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-full">
                <Settings className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold">
                  Панель администратора
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Настройка и управление системой отслеживания грузов
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <UserCircle className="w-5 h-5 text-muted-foreground" />
                <span>
                  {user?.firstName} {user?.lastName}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="transition-all hover:scale-105 hover:shadow-md"
              >
                <LogOut className="w-4 h-4 mr-2" /> Выйти
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="bot-settings" className="space-y-6">
        <TabsList className="bg-muted p-1 rounded-xl grid w-full grid-cols-3">
          <TabsTrigger value="bot-settings" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg px-4 py-2">
            Настройки бота
          </TabsTrigger>
          <TabsTrigger value="statistics" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg px-4 py-2">
            Статистика
          </TabsTrigger>
          <TabsTrigger value="messages" className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg px-4 py-2">
            Сообщения
          </TabsTrigger>
        </TabsList>

        {/* Настройки бота */}
        <TabsContent value="bot-settings">
          <Card className="rounded-xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5" /> Telegram Bot Configuration
              </CardTitle>
              <CardDescription>
                Настройте подключение к Telegram боту через BotFather
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}
                  />
                  <span className="text-sm">
                    {isConnected ? "Подключено" : "Не подключено"}
                  </span>
                </div>
                {isConnected && (
                  <Badge
                    variant="outline"
                    className="text-green-600 bg-green-100 border-green-300"
                  >
                    <CheckCircle className="w-3 h-3 mr-1" /> Активно
                  </Badge>
                )}
              </div>

              <div className="space-y-4">
                {["token", "username", "welcomeMessage"].map((field) => (
                  <div key={field}>
                    <Label htmlFor={field}>
                      {field === "token"
                        ? "Токен бота"
                        : field === "username"
                        ? "Имя пользователя бота"
                        : "Приветственное сообщение"}
                    </Label>
                    {field === "welcomeMessage" ? (
                      <Textarea
                        id={field}
                        value={botSettings[field] || ""}
                        onChange={(e) => handleInputChange(field, e.target.value)}
                        rows={3}
                        className="rounded-xl shadow-sm"
                        disabled={isLoading}
                      />
                    ) : (
                      <Input
                        id={field}
                        type={field === "token" ? "password" : "text"}
                        value={botSettings[field] || ""}
                        onChange={(e) => handleInputChange(field, e.target.value)}
                        className="rounded-xl shadow-sm"
                        disabled={isLoading}
                      />
                    )}
                  </div>
                ))}

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-4">
                  <Button onClick={handleSaveSettings} className="flex-1">
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Сохранение...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" /> Сохранить
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
                        <TestTube className="w-4 h-4 mr-2" /> Тестировать
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Статистика */}
        <TabsContent value="statistics">
          <Card className="rounded-xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" /> Статистика
              </CardTitle>
              <CardDescription>Общая информация по посылкам</CardDescription>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <ul className="space-y-2">
                <li>🔢 Всего компаний: {stats.totalCompanies}</li>
                <li>📦 Активных посылок: {stats.totalParcels}</li>
                <li>👤 Зарегистрированных пользователей: {stats.totalUsers}</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Сообщения */}
        <TabsContent value="messages">
          <Card className="rounded-xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" /> Сообщения пользователей
              </CardTitle>
              <CardDescription>
                Список последних обращений или сообщений пользователей
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground italic">
                📭 Пока сообщений нет. Здесь будут отображаться обращения клиентов.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}