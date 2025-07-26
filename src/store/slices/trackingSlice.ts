import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface TrackingInfo {
  trackingCode: string;
  status: 'pending' | 'in-transit' | 'delivered' | 'delayed';
  product: string;
  sender: string;
  receiver: string;
  currentLocation: string;
  estimatedDelivery: string;
  lastUpdate: string;
  timeline: Array<{
    status: string;
    location: string;
    timestamp: string;
    description: string;
  }>;
}

interface TrackingState {
  currentTracking: TrackingInfo | null;
  isLoading: boolean;
  error: string | null;
  searchHistory: string[];
}

// Mock tracking data
const mockTrackingData: { [key: string]: TrackingInfo } = {
  'TK001234567': {
    trackingCode: 'TK001234567',
    status: 'in-transit',
    product: 'Электроника - Смартфон Samsung Galaxy S24',
    sender: 'TechStore Moscow',
    receiver: 'Иванов Иван Иванович',
    currentLocation: 'Сортировочный центр Екатеринбург',
    estimatedDelivery: '25 января 2025',
    lastUpdate: '24 января 2025, 14:30',
    timeline: [
      {
        status: 'Отправлено',
        location: 'Москва, склад отправителя',
        timestamp: '22 января 2025, 10:00',
        description: 'Посылка принята к доставке'
      },
      {
        status: 'В пути',
        location: 'Нижний Новгород, транзитный пункт',
        timestamp: '23 января 2025, 08:15',
        description: 'Посылка в пути к получателю'
      },
      {
        status: 'В пути',
        location: 'Екатеринбург, сортировочный центр',
        timestamp: '24 января 2025, 14:30',
        description: 'Посылка прибыла в сортировочный центр'
      }
    ]
  },
  'TK987654321': {
    trackingCode: 'TK987654321',
    status: 'delivered',
    product: 'Одежда - Зимняя куртка',
    sender: 'Fashion Store SPb',
    receiver: 'Петрова Мария Сергеевна',
    currentLocation: 'Доставлено',
    estimatedDelivery: '20 января 2025',
    lastUpdate: '20 января 2025, 16:45',
    timeline: [
      {
        status: 'Отправлено',
        location: 'Санкт-Петербург, склад отправителя',
        timestamp: '18 января 2025, 09:00',
        description: 'Посылка принята к доставке'
      },
      {
        status: 'В пути',
        location: 'Новгород, транзитный пункт',
        timestamp: '19 января 2025, 12:30',
        description: 'Посылка в пути к получателю'
      },
      {
        status: 'Доставлено',
        location: 'Псков, пункт выдачи',
        timestamp: '20 января 2025, 16:45',
        description: 'Посылка доставлена получателю'
      }
    ]
  },
  'TK555666777': {
    trackingCode: 'TK555666777',
    status: 'delayed',
    product: 'Книги - Учебная литература',
    sender: 'BookStore Online',
    receiver: 'Сидоров Петр Петрович',
    currentLocation: 'Задержано на таможне',
    estimatedDelivery: '28 января 2025',
    lastUpdate: '26 января 2025, 09:00',
    timeline: [
      {
        status: 'Отправлено',
        location: 'Минск, склад отправителя',
        timestamp: '24 января 2025, 11:00',
        description: 'Посылка принята к доставке'
      },
      {
        status: 'В пути',
        location: 'Граница Беларуси-России',
        timestamp: '25 января 2025, 15:30',
        description: 'Посылка на таможенном контроле'
      },
      {
        status: 'Задержано',
        location: 'Таможенный пост Смоленск',
        timestamp: '26 января 2025, 09:00',
        description: 'Дополнительная проверка документов'
      }
    ]
  }
};

// Async thunk for tracking cargo
export const trackCargo = createAsyncThunk(
  'tracking/trackCargo',
  async (trackingCode: string, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
      
      const trackingInfo = mockTrackingData[trackingCode.toUpperCase()];
      
      if (!trackingInfo) {
        return rejectWithValue('Трек-код не найден. Проверьте правильность введенного кода.');
      }

      return trackingInfo;
    } catch (error) {
      return rejectWithValue('Ошибка при получении данных о грузе');
    }
  }
);

// Async thunk for refreshing tracking info
export const refreshTracking = createAsyncThunk(
  'tracking/refreshTracking',
  async (trackingCode: string, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const trackingInfo = mockTrackingData[trackingCode.toUpperCase()];
      
      if (!trackingInfo) {
        return rejectWithValue('Трек-код не найден');
      }

      // Simulate potential status update
      if (Math.random() > 0.7) {
        trackingInfo.lastUpdate = new Date().toLocaleString('ru-RU');
      }

      return trackingInfo;
    } catch (error) {
      return rejectWithValue('Ошибка при обновлении данных');
    }
  }
);

const initialState: TrackingState = {
  currentTracking: null,
  isLoading: false,
  error: null,
  searchHistory: JSON.parse(localStorage.getItem('trackingHistory') || '[]'),
};

const trackingSlice = createSlice({
  name: 'tracking',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearTracking: (state) => {
      state.currentTracking = null;
      state.error = null;
    },
    addToHistory: (state, action) => {
      const trackingCode = action.payload;
      const newHistory = [trackingCode, ...state.searchHistory.filter(code => code !== trackingCode)].slice(0, 10);
      state.searchHistory = newHistory;
      localStorage.setItem('trackingHistory', JSON.stringify(newHistory));
    },
    clearHistory: (state) => {
      state.searchHistory = [];
      localStorage.removeItem('trackingHistory');
    },
  },
  extraReducers: (builder) => {
    builder
      // Track Cargo
      .addCase(trackCargo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(trackCargo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentTracking = action.payload;
        state.error = null;
      })
      .addCase(trackCargo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.currentTracking = null;
      })
      // Refresh Tracking
      .addCase(refreshTracking.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(refreshTracking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentTracking = action.payload;
      })
      .addCase(refreshTracking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearTracking, addToHistory, clearHistory } = trackingSlice.actions;
export default trackingSlice.reducer;