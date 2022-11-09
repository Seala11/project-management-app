import { configureStore } from '@reduxjs/toolkit';
import appReducer from './appSlice';
import boardsReducer from './boardsSlice';

export const store = configureStore({
  reducer: {
    app: appReducer,
    boards: boardsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
