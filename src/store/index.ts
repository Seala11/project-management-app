import { configureStore } from '@reduxjs/toolkit';
import appReducer from './appSlice';
import boardsReducer from './boardsSlice';
import authReducer from './authSlice';
import modalReducer from './modalSlice';
import boardSlice from './boardSlice';

export const store = configureStore({
  reducer: {
    app: appReducer,
    boards: boardsReducer,
    auth: authReducer,
    modal: modalReducer,
    board: boardSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
