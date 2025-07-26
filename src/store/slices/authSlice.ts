import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

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

// Mock API calls
const mockApiDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const mockUsers: { [email: string]: User & { password: string } } = {};

// Async thunks
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: RegisterData, { rejectWithValue }) => {
    try {
      await mockApiDelay(1500);
      
      // Check if user already exists
      if (mockUsers[userData.email]) {
        return rejectWithValue('Пользователь с таким email уже существует');
      }

      // Create new user
      const newUser: User & { password: string } = {
        id: Date.now().toString(),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: 'admin',
        createdAt: new Date().toISOString(),
        password: userData.password,
      };

      mockUsers[userData.email] = newUser;

      // Store in localStorage for persistence
      localStorage.setItem('mockUsers', JSON.stringify(mockUsers));

      const { password, ...userWithoutPassword } = newUser;
      return userWithoutPassword;
    } catch (error) {
      return rejectWithValue('Ошибка регистрации');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      await mockApiDelay(1000);

      // Load users from localStorage
      const savedUsers = localStorage.getItem('mockUsers');
      if (savedUsers) {
        Object.assign(mockUsers, JSON.parse(savedUsers));
      }

      const user = mockUsers[credentials.email];
      
      if (!user || user.password !== credentials.password) {
        return rejectWithValue('Неверный email или пароль');
      }

      // Store auth token
      localStorage.setItem('authToken', 'mock-jwt-token');
      localStorage.setItem('currentUser', JSON.stringify({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        createdAt: user.createdAt,
      }));

      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      return rejectWithValue('Ошибка входа');
    }
  }
);

export const checkAuthStatus = createAsyncThunk(
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
    } catch (error) {
      return rejectWithValue('Ошибка проверки авторизации');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    await mockApiDelay(300);
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  }
);

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  registrationStep: 'register',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setRegistrationStep: (state, action) => {
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
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.registrationStep = 'login';
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Login
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
        state.error = action.payload as string;
      })
      // Check Auth Status
      .addCase(checkAuthStatus.pending, (state) => {
        state.isLoading = true;
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
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.registrationStep = 'register';
        state.error = null;
      });
  },
});

export const { clearError, setRegistrationStep, resetAuth } = authSlice.actions;
export default authSlice.reducer;