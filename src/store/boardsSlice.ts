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
  boards: [
    { title: 'board 1' },
    { title: 'board 2' },
    { title: 'board 3' },
    { title: 'board 5' },
    { title: 'board 6' },
    { title: 'board 7' },
  ],
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

export const boardsSelector = (state: RootState) => state.boards.boards;

export default boardsSlice.reducer;
