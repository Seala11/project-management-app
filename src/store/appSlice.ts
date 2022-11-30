import { createSlice } from '@reduxjs/toolkit';
import { RootState } from 'store';

type AppState = {
  toastMessage: string | null;
  isPending: boolean;
};

export const initialState: AppState = {
  toastMessage: null,
  isPending: true,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setToastMessage: (state, action) => {
      state.toastMessage = action.payload;
    },

    setIsPending: (state, action) => {
      state.isPending = action.payload;
    },
  },
});

export const { setToastMessage, setIsPending } = appSlice.actions;
export const toastMessageSelector = (state: RootState) => state.app.toastMessage;
export const appSelector = (state: RootState) => state.app;

export default appSlice.reducer;
