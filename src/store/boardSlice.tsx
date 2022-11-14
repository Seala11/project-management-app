import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { BASE } from 'api/config';
import getUserTokenLS from 'utils/localStorage';

export type FileType = {
  filename: string;
  fileSize: number;
};

export type TaskType = {
  id: string;
  title: string;
  order: number;
  description: string;
  userId?: string;
  files?: FileType[];
};

export type TaskObjectType = {
  [key: string]: TaskType[];
};

export type ColumnType = {
  id: string;
  title: string;
  order: number;
};

export type BoardStateType = {
  id: string;
  title: string;
  error: string;
  pending: boolean;
  columns?: ColumnType[];
  tasks?: TaskObjectType;
};

export type BoardResponseType = {
  _id: string;
  title: string;
  owner: string;
  users: string[];
};

const initialBoardState: BoardStateType = {
  id: '',
  title: '',
  error: '',
  pending: false,
  columns: [],
  tasks: {},
};

export const getSingleBoard = createAsyncThunk<BoardResponseType, string, { rejectValue: string }>(
  'board/getSingleBoard',
  async (id, { rejectWithValue }) => {
    const token = getUserTokenLS(BASE);
    const response = await fetch(`${BASE}boards/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const resp = await response.json();
      return rejectWithValue(`${resp?.statusCode}/${resp.message}`);
    }
    const data: BoardResponseType = await response.json();
    return data;
  }
);

export const boardSlice = createSlice({
  name: 'board',
  initialState: initialBoardState,
  reducers: {
    clearErrors: (state) => {
      state.error = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSingleBoard.fulfilled, (state, action) => {
        state.id = action.payload._id;
        state.title = action.payload.title;
        state.pending = false;
      })
      .addCase(getSingleBoard.pending, (state) => {
        state.pending = true;
      });
  },
});

export const { clearErrors } = boardSlice.actions;

export default boardSlice.reducer;
