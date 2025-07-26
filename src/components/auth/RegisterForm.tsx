import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Alert, AlertDescription } from "../ui/alert";
import { UserPlus, Mail, Lock, User, AlertCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { registerUser, clearError } from "../../store/slices/authSlice";

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const errors: {[key: string]: string} = {};

    if (!formData.firstName.trim()) {
      errors.firstName = 'Имя обязательно';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Фамилия обязательна';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Неверный формат email';
    }

    if (!formData.password) {
      errors.password = 'Пароль обязателен';
    } else if (formData.password.length < 6) {
      errors.password = 'Пароль должен содержать минимум 6 символов';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Пароли не совпадают';
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
    
    const result = await dispatch(registerUser({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
    }));

    if (registerUser.fulfilled.match(result)) {
      // Registration successful, will switch to login automatically via Redux state
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

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <UserPlus className="w-6 h-6 text-primary" />
          </div>
        </div>
        <CardTitle>Регистрация администратора</CardTitle>
        <CardDescription>
          Создайте аккаунт для доступа к панели администратора
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">Имя</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Имя"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={`pl-10 ${validationErrors.firstName ? 'border-destructive' : ''}`}
                  disabled={isLoading}
                />
              </div>
              {validationErrors.firstName && (
                <p className="text-sm text-destructive mt-1">{validationErrors.firstName}</p>
              )}
            </div>

            <div>
              <Label htmlFor="lastName">Фамилия</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Фамилия"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={`pl-10 ${validationErrors.lastName ? 'border-destructive' : ''}`}
                  disabled={isLoading}
                />
              </div>
              {validationErrors.lastName && (
                <p className="text-sm text-destructive mt-1">{validationErrors.lastName}</p>
              )}
            </div>
          </div>

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

          <div>
            <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className={`pl-10 ${validationErrors.confirmPassword ? 'border-destructive' : ''}`}
                disabled={isLoading}
              />
            </div>
            {validationErrors.confirmPassword && (
              <p className="text-sm text-destructive mt-1">{validationErrors.confirmPassword}</p>
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
                Регистрация...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Зарегистрироваться
              </>
            )}
          </Button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Уже есть аккаунт?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-primary hover:underline"
                disabled={isLoading}
              >
                Войти
              </button>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}