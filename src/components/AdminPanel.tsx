import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { RegisterForm } from "./auth/RegisterForm";
import { LoginForm } from "./auth/LoginForm";
import { AdminDashboard } from "./AdminDashboard";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  checkAuthStatus,
  setRegistrationStep,
} from "../store/slices/authSlice";
import { Settings } from "lucide-react";

export function AdminPanel() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, registrationStep, isLoading } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  const handleSwitchToLogin = () => {
    dispatch(setRegistrationStep("login"));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4 animate-fade-in">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Проверка авторизации...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto space-y-6 py-10 px-4 animate-fade-in">
        <Card className="rounded-2xl shadow-xl border border-border bg-background/70 backdrop-blur">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Settings className="w-8 h-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-xl font-semibold">
              Доступ к панели администратора
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Для продолжения необходимо пройти аутентификацию
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="rounded-2xl shadow-lg border border-border bg-background/80 backdrop-blur-md">
          <CardContent className="py-6">
            {registrationStep === "register" ? (
              <RegisterForm onSwitchToLogin={handleSwitchToLogin} />
            ) : (
              <LoginForm />
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return <AdminDashboard />;
}
