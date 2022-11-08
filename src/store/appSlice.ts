import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'store';

export enum Lang {
  RU = 'ru',
  EN = 'en',
}

type AppState = {
  lang: Lang;
};

export const initialState: AppState = {
  lang: Lang.EN,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLang: (state, action: PayloadAction<Lang>) => {
      state.lang = action.payload;
    },
  },
});

export const { setLang } = appSlice.actions;

export const languageSelector = (state: RootState) => state.app.lang;

export default appSlice.reducer;
