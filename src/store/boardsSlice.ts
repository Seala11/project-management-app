import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from 'store';
import { fetchCreateBoards, fetchDeleteBoard, fetchGetBoards } from 'api/apiBoards';
import { getErrorMessage } from 'utils/func/handleError';
import { toast } from 'react-toastify';
import { parseBoardObj } from 'utils/func/boardHandler';

export type BoardResponseType = {
  _id: string;
  title: string;
  owner: string;
  users: string[];
};

type CreateBoardProps = {
  owner: string;
  title: string;
  users: string[];
  token: string;
};

export const thunkGetUserBoards = createAsyncThunk(
  'boardsSet/fetchGetBoards',
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await fetchGetBoards(token);

      if (!response.ok) {
        const err: { message: string; statusCode: number } = await response.json();
        throw new Error(err.message);
      }

      const data: BoardResponseType[] = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const thunkCreateBoards = createAsyncThunk(
  'boards/fetchCreateBoards',
  async ({ owner, title, users, token }: CreateBoardProps, { rejectWithValue }) => {
    try {
      const response = await fetchCreateBoards({ title, owner, users }, token);

      if (!response.ok) {
        const err: { message: string; statusCode: number } = await response.json();
        throw new Error(err.message);
      }

      const data: BoardResponseType = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const thunkDeleteBoard = createAsyncThunk(
  'boards/fetchDeleteBoard',
  async ({ boardId, token }: { boardId: string; token: string }, { rejectWithValue }) => {
    try {
      const response = await fetchDeleteBoard(boardId, token);

      if (!response.ok) {
        const err: { message: string; statusCode: number } = await response.json();
        throw new Error(err.message);
      }

      const data: BoardResponseType = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export type BoardInfo = {
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
  reducers: {},
  extraReducers(builder) {
    // getBoards
    builder.addCase(thunkGetUserBoards.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(thunkGetUserBoards.fulfilled, (state, action) => {
      state.loading = false;
      const boards = action.payload.map((board) => parseBoardObj(board));
      state.boards = boards;
    });
    builder.addCase(thunkGetUserBoards.rejected, (state, action) => {
      state.loading = false;
      if (typeof action.payload === 'string') {
        toast.error(action.payload);
      }
    });

    // create board
    builder.addCase(thunkCreateBoards.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(thunkCreateBoards.fulfilled, (state, action) => {
      state.loading = false;
      const board = action.payload;
      const newBoard = parseBoardObj(board);
      state.boards = [...state.boards, newBoard];
    });
    builder.addCase(thunkCreateBoards.rejected, (state, action) => {
      state.loading = false;
      if (typeof action.payload === 'string') {
        toast.error(action.payload);
      }
    });

    // delete board
    builder.addCase(thunkDeleteBoard.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(thunkDeleteBoard.fulfilled, (state, action) => {
      state.loading = false;
      const newState = state.boards.filter((board) => board._id !== action.payload._id);
      state.boards = newState;
    });
    builder.addCase(thunkDeleteBoard.rejected, (state, action) => {
      state.loading = false;
      if (typeof action.payload === 'string') {
        toast.error(action.payload);
      }
    });
  },
});

export const boardsSelector = (state: RootState) => state.boards.boards;
export const boardsLoadingSelector = (state: RootState) => state.boards.loading;

export default boardsSlice.reducer;
