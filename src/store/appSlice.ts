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
};

export const initialState: AppState = {
  lang: Lang.EN,
  toastMessage: null,
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
  },
});

export const { setLang, setToastMessage } = appSlice.actions;

export const languageSelector = (state: RootState) => state.app.lang;
export const toastMessageSelector = (state: RootState) => state.app.toastMessage;

export default appSlice.reducer;
