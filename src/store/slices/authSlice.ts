import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

// Типы
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user';
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  registrationStep: 'register' | 'login' | 'authenticated';
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Вспомогательные функции
const mockApiDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getMockUsers = (): { [email: string]: User & { password: string } } => {
  const data = localStorage.getItem('mockUsers');
  return data ? JSON.parse(data) : {};
};

const saveMockUsers = (users: { [email: string]: User & { password: string } }) => {
  localStorage.setItem('mockUsers', JSON.stringify(users));
};

// Async Thunks
export const registerUser = createAsyncThunk<User, RegisterData, { rejectValue: string }>(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      await mockApiDelay(1500);

      const users = getMockUsers();

      if (users[userData.email]) {
        return rejectWithValue('Пользователь с таким email уже существует');
      }

      const newUser: User & { password: string } = {
        id: Date.now().toString(),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: 'admin',
        createdAt: new Date().toISOString(),
        password: userData.password,
      };

      users[userData.email] = newUser;
      saveMockUsers(users);

      const {  ...userWithoutPassword } = newUser;
      return userWithoutPassword;
    } catch (err) {
      console.error('Ошибка регистрации:', err);
      return rejectWithValue('Ошибка регистрации');
    }
  }
);

export const loginUser = createAsyncThunk<User, LoginCredentials, { rejectValue: string }>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      await mockApiDelay(1000);

      const users = getMockUsers();
      const user = users[credentials.email];

      if (!user || user.password !== credentials.password) {
        return rejectWithValue('Неверный email или пароль');
      }

      localStorage.setItem('authToken', 'mock-jwt-token');
      localStorage.setItem(
        'currentUser',
        JSON.stringify({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          createdAt: user.createdAt,
        })
      );

      const {  ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (err) {
      console.error('Ошибка входа:', err);
      return rejectWithValue('Ошибка входа');
    }
  }
);

export const checkAuthStatus = createAsyncThunk<User, void, { rejectValue: string }>(
  'auth/checkStatus',
  async (_, { rejectWithValue }) => {
    try {
      await mockApiDelay(500);

      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('currentUser');

      if (!token || !userData) {
        return rejectWithValue('Не авторизован');
      }

      return JSON.parse(userData) as User;
    } catch (err) {
      console.error('Ошибка проверки авторизации:', err);
      return rejectWithValue('Ошибка проверки авторизации');
    }
  }
);

export const logoutUser = createAsyncThunk<void, void>('auth/logout', async () => {
  await mockApiDelay(300);
  localStorage.removeItem('authToken');
  localStorage.removeItem('currentUser');
});

// Начальное состояние
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  registrationStep: 'register',
};

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setRegistrationStep: (state, action: PayloadAction<'register' | 'login' | 'authenticated'>) => {
      state.registrationStep = action.payload;
    },
    resetAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.registrationStep = 'register';
    },
  },
  extraReducers: (builder) => {
    builder
      // Регистрация
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.registrationStep = 'login';
        state.error = null;
        // state.user = action.payload; // можно включить, если нужно
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Ошибка регистрации';
      })

      // Вход
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.registrationStep = 'authenticated';
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Ошибка входа';
      })

      // Проверка статуса
      .addCase(checkAuthStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.registrationStep = 'authenticated';
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.registrationStep = 'register';
      })

      // Выход
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.registrationStep = 'register';
        state.error = null;
      });
  },
});

// Экспорт
export const { clearError, setRegistrationStep, resetAuth } = authSlice.actions;
export default authSlice.reducer;
