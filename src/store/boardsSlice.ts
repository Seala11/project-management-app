import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'store';

// type BoardType = {
//   _id: string;
//   title: string;
//   owner: string;
//   users: string[];
// };

type FakeBoard = {
  title: string;
};

type BoardState = {
  boards: FakeBoard[];
};

export const initialState: BoardState = {
  boards: [],
};

export const boardsSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {
    createBoard: (state, action: PayloadAction<FakeBoard>) => {
      state.boards = [...state.boards, action.payload];
    },
  },
});

export const { createBoard } = boardsSlice.actions;

export const languageSelector = (state: RootState) => state.boards;

export default boardsSlice.reducer;
