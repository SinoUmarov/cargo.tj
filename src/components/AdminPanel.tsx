import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { RegisterForm } from "./auth/RegisterForm";
import { LoginForm } from "./auth/LoginForm";
import { AdminDashboard } from "./AdminDashboard";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { checkAuthStatus, setRegistrationStep } from "../store/slices/authSlice";
import { Settings } from "lucide-react";

export function AdminPanel() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, registrationStep, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Check if user is already authenticated
    dispatch(checkAuthStatus());
  }, [dispatch]);

  const handleSwitchToLogin = () => {
    dispatch(setRegistrationStep('login'));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Проверка авторизации...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Settings className="w-8 h-8 text-primary" />
              </div>
            </div>
            <CardTitle>Доступ к панели администратора</CardTitle>
            <CardDescription>
              Для доступа к панели администратора необходимо пройти аутентификацию
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="flex justify-center">
          {registrationStep === 'register' ? (
            <RegisterForm onSwitchToLogin={handleSwitchToLogin} />
          ) : (
            <LoginForm />
          )}
        </div>
      </div>
    );
  }

  return <AdminDashboard />;
}