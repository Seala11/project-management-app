import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'store';

export enum Lang {
  RU = 'ru',
  EN = 'en',
}

type AppState = {
  lang: Lang;
  toastMessage: string | null;
  isPending: boolean;
};

export const initialState: AppState = {
  lang: Lang.EN,
  toastMessage: null,
  isPending: true,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLang: (state, action: PayloadAction<Lang>) => {
      state.lang = action.payload;
    },

    setToastMessage: (state, action) => {
      state.toastMessage = action.payload;
    },

    setIsPending: (state, action) => {
      state.isPending = action.payload;
    },
  },
});

export const { setLang, setToastMessage, setIsPending } = appSlice.actions;

export const languageSelector = (state: RootState) => state.app.lang;
export const toastMessageSelector = (state: RootState) => state.app.toastMessage;
export const appSelector = (state: RootState) => state.app;

export default appSlice.reducer;
