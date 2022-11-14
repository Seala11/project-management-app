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
  _id: string;
};

type BoardState = {
  boards: FakeBoard[];
};

export const initialState: BoardState = {
  boards: [
    { title: 'board 1', _id: '63716551ae90114760237ed5' },
    { title: 'board 2', _id: '63729c54ae901147602380b3' },
    { title: 'board 3', _id: '63725b5bae90114760237ef7' },
    { title: 'board 5', _id: '12rgrgr36' },
    { title: 'board 6', _id: '12rgrg37' },
    { title: 'board 7', _id: '123gdgdgdg' },
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
