import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'store';
import { fetchCreateBoards, fetchGetBoards } from 'api/apiBoards';
import { getErrorMessage } from 'utils/func/handleError';
import { toast } from 'react-toastify';

type BoardResponseType = {
  _id: string;
  title: string;
  owner: string;
  users: string[];
};

export const thunkGetUserBoards = createAsyncThunk(
  'boardsSet/fetchGetBoards',
  async ({ userId, token }: { token: string; userId: string }, { rejectWithValue }) => {
    try {
      const response = await fetchGetBoards(userId, token);

      if (!response.ok) {
        const err: { message: string; statusCode: number } = await response.json();
        throw new Error(err.message);
      }

      const data: BoardResponseType[] = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const thunkCreateBoards = createAsyncThunk(
  'boards/fetchCreateBoards',
  async (
    {
      owner,
      title,
      users,
      token,
    }: { owner: string; title: string; users: string[]; token: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetchCreateBoards({ title, owner, users }, token);

      if (!response.ok) {
        const err: { message: string; statusCode: number } = await response.json();
        throw new Error(err.message);
      }

      const data: BoardResponseType = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

type BoardInfo = {
  title: string;
  descr: string;
};

export type BoardType = {
  _id: string;
  title: BoardInfo;
  owner: string;
  users: string[];
};

type BoardState = {
  loading: boolean;
  boards: BoardType[];
};

export const initialState: BoardState = {
  loading: false,
  boards: [],
};

export const boardsSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {
    deleteBoard: (state, action: PayloadAction<string>) => {
      state.boards = state.boards.filter((board) => board._id !== action.payload);
    },
  },
  extraReducers(builder) {
    builder.addCase(thunkGetUserBoards.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(thunkGetUserBoards.fulfilled, (state, action) => {
      state.loading = false;
      const boards = action.payload.map((board) => {
        return {
          _id: board._id,
          owner: board.owner,
          title: JSON.parse(board.title),
          users: board.users,
        };
      });
      state.boards = boards;
      console.log('state', state.boards);
    });

    builder.addCase(thunkGetUserBoards.rejected, (state, action) => {
      state.loading = false;
      if (typeof action.payload === 'string') {
        toast.error(action.payload);
      }
    });

    builder.addCase(thunkCreateBoards.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(thunkCreateBoards.fulfilled, (state, action) => {
      state.loading = false;
      const board = action.payload;
      const newBoard = {
        _id: board._id,
        owner: board.owner,
        title: JSON.parse(board.title),
        users: board.users,
      };
      state.boards = [...state.boards, newBoard];
    });

    builder.addCase(thunkCreateBoards.rejected, (state, action) => {
      state.loading = false;
      if (typeof action.payload === 'string') {
        toast.error(action.payload);
      }
    });
  },
});

export const { deleteBoard } = boardsSlice.actions;

export const boardsSelector = (state: RootState) => state.boards.boards;
export const boardsLoadingSelector = (state: RootState) => state.boards.loading;

export default boardsSlice.reducer;
