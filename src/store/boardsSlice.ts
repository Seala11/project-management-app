import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from 'store';
import {
  fetchCreateBoard,
  fetchDeleteBoard,
  fetchGetBoards,
  fetchUpdateBoard,
} from 'api/apiBoards';
import { getErrorMessage } from 'utils/func/handleError';
import { parseBoardObj } from 'utils/func/boardHandler';
import { setAuth } from './authSlice';

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

type UpdateBoardProps = {
  owner: string;
  title: string;
  users: string[];
  token: string;
  boardId: string;
};

const ERR_PREFIX = 'BOARDS_';

export const thunkGetUserBoards = createAsyncThunk(
  'boardsSet/fetchGetBoards',
  async (token: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetchGetBoards(token);

      if (!response.ok) {
        const err: { message: string; statusCode: number } = await response.json();

        if (err.statusCode === 403) {
          dispatch(setAuth(false));
        }
        throw new Error(String(`${ERR_PREFIX}${err.statusCode}`));
      }

      const data: BoardResponseType[] = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const thunkCreateBoard = createAsyncThunk(
  'boards/fetchCreateBoard',
  async ({ owner, title, users, token }: CreateBoardProps, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetchCreateBoard({ title, owner, users }, token);

      if (!response.ok) {
        const err: { message: string; statusCode: number } = await response.json();
        if (err.statusCode === 403) {
          dispatch(setAuth(false));
        }
        throw new Error(String(`${ERR_PREFIX}${err.statusCode}`));
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
  async ({ boardId, token }: { boardId: string; token: string }, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetchDeleteBoard(boardId, token);

      if (!response.ok) {
        const err: { message: string; statusCode: number } = await response.json();
        if (err.statusCode === 403) {
          dispatch(setAuth(false));
        }
        throw new Error(String(`${ERR_PREFIX}${err.statusCode}`));
      }

      const data: BoardResponseType = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const thunkUpdateBoard = createAsyncThunk(
  'boards/fetchUpdateBoard',
  async (
    { owner, title, users, token, boardId }: UpdateBoardProps,
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await fetchUpdateBoard({ title, owner, users }, token, boardId);

      if (!response.ok) {
        const err: { message: string; statusCode: number } = await response.json();
        if (err.statusCode === 403) {
          dispatch(setAuth(false));
        }
        throw new Error(String(`${ERR_PREFIX}${err.statusCode}`));
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
  boards: BoardType[];
};

export const initialState: BoardState = {
  boards: [],
};

export const boardsSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {
    setBoards(state, action) {
      state.boards = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(thunkGetUserBoards.fulfilled, (state, action) => {
      const boards = action.payload.map((board) => parseBoardObj(board));
      state.boards = boards;
    });
    builder.addCase(thunkCreateBoard.fulfilled, (state, action) => {
      const board = action.payload;
      const newBoard = parseBoardObj(board);
      state.boards = [...state.boards, newBoard];
    });
    builder.addCase(thunkDeleteBoard.fulfilled, (state, action) => {
      const newState = state.boards.filter((board) => board._id !== action.payload._id);
      state.boards = newState;
    });
    builder.addCase(thunkUpdateBoard.fulfilled, (state, action) => {
      const board = action.payload;
      const newBoard = parseBoardObj(board);
      const newState = state.boards.map((board) =>
        board._id === action.payload._id ? newBoard : board
      );
      state.boards = newState;
    });
  },
});

export const boardsSelector = (state: RootState) => state.boards.boards;
export const { setBoards } = boardsSlice.actions;
export default boardsSlice.reducer;
