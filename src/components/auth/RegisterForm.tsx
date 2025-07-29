import { useState } from "react";
// import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
// import { Alert, AlertDescription } from "../ui/alert";
import { UserPlus, Mail, Lock, User } from "lucide-react";
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

    if (!formData.firstName.trim()) errors.firstName = 'Имя обязательно';
    if (!formData.lastName.trim()) errors.lastName = 'Фамилия обязательна';
    if (!formData.email.trim()) errors.email = 'Email обязателен';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Неверный формат email';
    if (!formData.password) errors.password = 'Пароль обязателен';
    else if (formData.password.length < 6) errors.password = 'Пароль должен содержать минимум 6 символов';
    if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Пароли не совпадают';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    dispatch(clearError());

    const result = await dispatch(registerUser({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
    }));

    if (registerUser.fulfilled.match(result)) {
      // Успешная регистрация
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (error) {
      dispatch(clearError());
    }
  };

  return (
    <Card
      className="w-full max-w-md mx-auto bg-white shadow-xl rounded-3xl border-none"
    
    >
      <CardHeader className="text-center">
        <div className="flex justify-center mb-5">
          <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full shadow-lg">
            <UserPlus className="w-7 h-7 text-white" />
          </div>
        </div>
        <CardTitle className="text-3xl font-extrabold text-gray-900">Регистрация администратора</CardTitle>
        <CardDescription className="text-gray-500 mt-1">
          Создайте аккаунт для доступа к панели администратора
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-5">
            {['firstName', 'lastName'].map((field) => (
              <div key={field}>
                <Label htmlFor={field} className="text-gray-700 font-semibold">{field === 'firstName' ? 'Имя' : 'Фамилия'}</Label>
                <div className="relative mt-1">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id={field}
                    type="text"
                    placeholder={field === 'firstName' ? 'Имя' : 'Фамилия'}
                    // value={formData[field]}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    className={`pl-12 bg-white shadow-md rounded-xl transition-shadow duration-300
                      focus:shadow-indigo-500/50 focus:shadow-[0_0_10px_2px_rgba(99,102,241,0.5)]
                      ${validationErrors[field] ? 'shadow-[0_0_8px_3px_rgba(220,38,38,0.6)] bg-red-50' : ''}`}
                    disabled={isLoading}
                    style={{ border: 'none' }}
                  />
                </div>
                {validationErrors[field] && (
                  <p className="text-sm text-red-600 mt-1">{validationErrors[field]}</p>
                )}
              </div>
            ))}
          </div>

          <div>
            <Label htmlFor="email" className="text-gray-700 font-semibold">Email</Label>
            <div className="relative mt-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`pl-12 bg-white shadow-md rounded-xl transition-shadow duration-300
                  focus:shadow-indigo-500/50 focus:shadow-[0_0_10px_2px_rgba(99,102,241,0.5)]
                  ${validationErrors.email ? 'shadow-[0_0_8px_3px_rgba(220,38,38,0.6)] bg-red-50' : ''}`}
                disabled={isLoading}
                style={{ border: 'none' }}
              />
            </div>
            {validationErrors.email && (
              <p className="text-sm text-red-600 mt-1">{validationErrors.email}</p>
            )}
          </div>

          <div>
            <Label htmlFor="password" className="text-gray-700 font-semibold">Пароль</Label>
            <div className="relative mt-1">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`pl-12 bg-white shadow-md rounded-xl transition-shadow duration-300
                  focus:shadow-indigo-500/50 focus:shadow-[0_0_10px_2px_rgba(99,102,241,0.5)]
                  ${validationErrors.password ? 'shadow-[0_0_8px_3px_rgba(220,38,38,0.6)] bg-red-50' : ''}`}
                disabled={isLoading}
                style={{ border: 'none' }}
              />
            </div>
            {validationErrors.password && (
              <p className="text-sm text-red-600 mt-1">{validationErrors.password}</p>
            )}
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="text-gray-700 font-semibold">Подтвердите пароль</Label>
            <div className="relative mt-1">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className={`pl-12 bg-white shadow-md rounded-xl transition-shadow duration-300
                  focus:shadow-indigo-500/50 focus:shadow-[0_0_10px_2px_rgba(99,102,241,0.5)]
                  ${validationErrors.confirmPassword ? 'shadow-[0_0_8px_3px_rgba(220,38,38,0.6)] bg-red-50' : ''}`}
                disabled={isLoading}
                style={{ border: 'none' }}
              />
            </div>
            {validationErrors.confirmPassword && (
              <p className="text-sm text-red-600 mt-1">{validationErrors.confirmPassword}</p>
            )}
          </div>

          {/* {error && (
            <Alert variant="destructive" className="rounded-lg shadow-md">
              <AlertCircle className="h-5 w-5" />
              <AlertDescription className="text-sm font-medium">{error}</AlertDescription>
            </Alert>
          )} */}

          {/* <Button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 transition-all duration-300 font-semibold rounded-xl shadow-lg flex justify-center items-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Регистрация...
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Зарегистрироваться
              </>
            )}
          </Button> */}

          <div className="text-center mt-3">
            <p className="text-sm text-gray-600">
              Уже есть аккаунт?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-indigo-600 hover:text-indigo-800 font-semibold underline"
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
