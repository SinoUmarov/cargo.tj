import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import trackingSlice from './slices/trackingSlice';
import adminSlice from './slices/adminSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    tracking: trackingSlice,
    admin: adminSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;