
import { useEffect } from "react";
import {
  Settings,
  Bot,
  // Save,
  // TestTube,
  // CheckCircle,
  // AlertCircle,
  BarChart3,

  MessageSquare,
  // LogOut,
  UserCircle,

} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store/hooks";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";

import { Label } from "./ui/label";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";


export function AdminDashboard() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);


  useEffect(() => {
  
  }, [dispatch]);

  

  return (
    <div className="max-w-3xl  gap-[400px]  mx-auto space-y-6 py-8 px-4 ">
      {/* Header */}
      <Card className="rounded-5xl  shadow-xl p-[10px] bg-background/70 backdrop-blur">
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
                  
                  </div>
                ))}

              
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
                <li>🔢 Всего компаний: </li>
                <li>📦 Активных посылок:</li>
                <li>👤 Зарегистрированных пользователей:</li>
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