import { configureStore } from '@reduxjs/toolkit';
import appReducer from './appSlice';
import boardsReducer from './boardsSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    app: appReducer,
    boards: boardsReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
