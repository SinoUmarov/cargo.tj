import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Alert, AlertDescription } from "../ui/alert";
import { LogIn, Mail, Lock, AlertCircle, ArrowLeft } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { loginUser, clearError, setRegistrationStep } from "../../store/slices/authSlice";

export function LoginForm() {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const errors: {[key: string]: string} = {};

    if (!formData.email.trim()) {
      errors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Неверный формат email';
    }

    if (!formData.password) {
      errors.password = 'Пароль обязателен';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    dispatch(clearError());
    
    const result = await dispatch(loginUser({
      email: formData.email,
      password: formData.password,
    }));

    if (loginUser.fulfilled.match(result)) {
      // Login successful, will be handled by Redux state change
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Clear global error
    if (error) {
      dispatch(clearError());
    }
  };

  const handleBackToRegister = () => {
    dispatch(setRegistrationStep('register'));
    dispatch(clearError());
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <LogIn className="w-6 h-6 text-primary" />
          </div>
        </div>
        <CardTitle>Вход в систему</CardTitle>
        <CardDescription>
          Войдите в панель администратора используя ваши учетные данные
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`pl-10 ${validationErrors.email ? 'border-destructive' : ''}`}
                disabled={isLoading}
              />
            </div>
            {validationErrors.email && (
              <p className="text-sm text-destructive mt-1">{validationErrors.email}</p>
            )}
          </div>

          <div>
            <Label htmlFor="password">Пароль</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`pl-10 ${validationErrors.password ? 'border-destructive' : ''}`}
                disabled={isLoading}
              />
            </div>
            {validationErrors.password && (
              <p className="text-sm text-destructive mt-1">{validationErrors.password}</p>
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Вход...
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 mr-2" />
                Войти
              </>
            )}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={handleBackToRegister}
              className="text-sm text-muted-foreground hover:text-primary flex items-center justify-center gap-2 mx-auto"
              disabled={isLoading}
            >
              <ArrowLeft className="w-4 h-4" />
              Назад к регистрации
            </button>
          </div>
        </form>

        {/* Demo credentials */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="text-sm font-medium mb-2">Для тестирования:</h4>
          <p className="text-sm text-muted-foreground">
            Сначала зарегистрируйтесь, затем используйте те же данные для входа
          </p>
        </div>
      </CardContent>
    </Card>
  );
}