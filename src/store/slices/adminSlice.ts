import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface BotSettings {
  token: string;
  username: string;
  welcomeMessage: string;
  notFoundMessage: string;
  deliveredMessage: string;
  inTransitMessage: string;
  helpMessage: string;
}

interface AdminStats {
  totalQueries: number;
  activeUsers: number;
  deliveredPackages: number;
  pendingPackages: number;
  recentQueries: Array<{
    id: string;
    time: string;
    user: string;
    trackingCode: string;
    status: 'success' | 'error';
  }>;
}

interface AdminState {
  botSettings: BotSettings;
  stats: AdminStats;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  isTesting: boolean;
}

// Async thunks
export const saveBotSettings = createAsyncThunk(
  'admin/saveBotSettings',
  async (settings: Partial<BotSettings>, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validate token format (simplified)
      if (settings.token && !settings.token.includes(':')) {
        return rejectWithValue('Неверный формат токена бота');
      }

      // Save to localStorage
      const savedSettings = JSON.parse(localStorage.getItem('botSettings') || '{}');
      const updatedSettings = { ...savedSettings, ...settings };
      localStorage.setItem('botSettings', JSON.stringify(updatedSettings));

      return updatedSettings as BotSettings;
    } catch (error) {
      return rejectWithValue('Ошибка сохранения настроек');
    }
  }
);

export const testBot = createAsyncThunk(
  'admin/testBot',
  async (_, {  rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate bot test
      const randomSuccess = Math.random() > 0.2; // 80% success rate
      
      if (!randomSuccess) {
        return rejectWithValue('Тест не прошел. Проверьте токен бота.');
      }

      return 'Тест прошел успешно!';
    } catch (error) {
      return rejectWithValue('Ошибка тестирования бота');
    }
  }
);

export const loadBotSettings = createAsyncThunk(
  'admin/loadBotSettings',
  async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const savedSettings = localStorage.getItem('botSettings');
    return savedSettings ? JSON.parse(savedSettings) : null;
  }
);

export const loadStats = createAsyncThunk(
  'admin/loadStats',
  async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate mock stats
    const stats: AdminStats = {
      totalQueries: Math.floor(Math.random() * 2000) + 1000,
      activeUsers: Math.floor(Math.random() * 100) + 50,
      deliveredPackages: Math.floor(Math.random() * 500) + 400,
      pendingPackages: Math.floor(Math.random() * 50) + 20,
      recentQueries: [
        {
          id: '1',
          time: '14:30',
          user: 'user123',
          trackingCode: 'TK001234567',
          status: 'success'
        },
        {
          id: '2',
          time: '14:25',
          user: 'user456',
          trackingCode: 'TK987654321',
          status: 'success'
        },
        {
          id: '3',
          time: '14:20',
          user: 'user789',
          trackingCode: 'TK111111111',
          status: 'error'
        },
        {
          id: '4',
          time: '14:15',
          user: 'user012',
          trackingCode: 'TK555666777',
          status: 'success'
        },
      ]
    };

    return stats;
  }
);

const initialState: AdminState = {
  botSettings: {
    token: '',
    username: '',
    welcomeMessage: 'Добро пожаловать! Отправьте трек-код для отслеживания груза.',
    notFoundMessage: '❌ Трек-код не найден. Проверьте правильность введенного кода и попробуйте снова.',
    deliveredMessage: '✅ Ваша посылка доставлена! Спасибо за использование нашего сервиса.',
    inTransitMessage: '🚚 Ваша посылка в пути. Следите за обновлениями статуса.',
    helpMessage: 'ℹ️ Отправьте трек-код для отслеживания посылки. Для получения помощи напишите /help'
  },
  stats: {
    totalQueries: 0,
    activeUsers: 0,
    deliveredPackages: 0,
    pendingPackages: 0,
    recentQueries: []
  },
  isConnected: false,
  isLoading: false,
  error: null,
  isTesting: false,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateBotSettings: (state, action) => {
      state.botSettings = { ...state.botSettings, ...action.payload };
    },
    setConnected: (state, action) => {
      state.isConnected = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Save Bot Settings
      .addCase(saveBotSettings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(saveBotSettings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.botSettings = action.payload;
        state.isConnected = true;
        state.error = null;
      })
      .addCase(saveBotSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Test Bot
      .addCase(testBot.pending, (state) => {
        state.isTesting = true;
        state.error = null;
      })
      .addCase(testBot.fulfilled, (state) => {
        state.isTesting = false;
        state.error = null;
      })
      .addCase(testBot.rejected, (state, action) => {
        state.isTesting = false;
        state.error = action.payload as string;
      })
      // Load Bot Settings
      .addCase(loadBotSettings.fulfilled, (state, action) => {
        if (action.payload) {
          state.botSettings = { ...state.botSettings, ...action.payload };
          state.isConnected = !!action.payload.token;
        }
      })
      // Load Stats
      .addCase(loadStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
      })
      .addCase(loadStats.rejected, (state) => {
        state.isLoading = false;
        state.error = 'Ошибка загрузки статистики';
      });
  },
});

export const { clearError, updateBotSettings, setConnected } = adminSlice.actions;
export default adminSlice.reducer;