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
      // Login successful, handled by Redux state change
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
    <Card className="w-full max-w-md mx-auto border-none bg-white shadow-lg rounded-xl">
      <CardHeader className="text-center pb-6">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-full shadow-md">
            <LogIn className="w-7 h-7 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl font-semibold text-gray-900">Вход в систему</CardTitle>
        <CardDescription className="text-gray-500 mt-1 text-sm max-w-xs mx-auto">
          Войдите в панель администратора, используя ваши учетные данные
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email" className="font-medium text-gray-700 mb-2 block">Email</Label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`pl-12 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500
                  ${validationErrors.email ? 'ring-2 ring-red-500' : ''}`}
                disabled={isLoading}
                style={{ border: 'none' }} // Убираем border
              />
            </div>
            {validationErrors.email && (
              <p className="text-sm text-red-600 mt-1">{validationErrors.email}</p>
            )}
          </div>

          <div>
            <Label htmlFor="password" className="font-medium text-gray-700 mb-2 block">Пароль</Label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`pl-12 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500
                  ${validationErrors.password ? 'ring-2 ring-red-500' : ''}`}
                disabled={isLoading}
                style={{ border: 'none' }} // Убираем border
              />
            </div>
            {validationErrors.password && (
              <p className="text-sm text-red-600 mt-1">{validationErrors.password}</p>
            )}
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4 shadow-md rounded-lg">
              <AlertCircle className="h-5 w-5" />
              <AlertDescription className="text-sm font-medium">{error}</AlertDescription>
            </Alert>
          )}

          <Button 
            type="submit" 
            className="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 transition-all duration-300 flex justify-center items-center gap-2 font-semibold shadow-md"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Вход...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Войти
              </>
            )}
          </Button>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={handleBackToRegister}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center justify-center gap-2 mx-auto transition-colors"
              disabled={isLoading}
            >
              <ArrowLeft className="w-5 h-5" />
              Назад к регистрации
            </button>
          </div>
        </form>

        {/* Demo credentials */}
        <div className="mt-8 p-5 bg-indigo-50 rounded-xl shadow-inner text-indigo-700 text-sm font-medium">
          <h4 className="mb-1 text-base">Для тестирования:</h4>
          <p>Сначала зарегистрируйтесь, затем используйте те же данные для входа</p>
        </div>
      </CardContent>
    </Card>
  );
}
