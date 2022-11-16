import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { BASE } from 'api/config';
import { toast } from 'react-toastify';
import { parseTaskObj } from 'utils/func/boardHandler';
import { getTokenFromLS } from 'utils/func/localStorage';
import { getAllColumns } from './middleware/columns';
import { getAllColumnTasks, thunkCreateTasks } from './middleware/tasks';

export type FileType = {
  filename: string;
  fileSize: number;
};

export type TaskType = {
  _id: string;
  title: string;
  order: number;
  boardId: string;
  description: string;
  userId: string;
  users: string[];
  files?: FileType[];
};

// NEW TASK TYPE
type TaskParsedType = {
  _id: string;
  title: string;
  order: number;
  boardId: string;
  description: {
    description: string;
    color: string;
  };
  userId: string;
  users: string[];
  files?: FileType[];
};

export type TaskObjectType = {
  [key: string]: TaskParsedType[];
};

export type ColumnType = {
  _id: string;
  title: string;
  order: number;
  boardId: string;
};

export type BoardStateType = {
  id: string;
  title: string;
  error: string;
  pending: boolean;
  columns: ColumnType[];
  tasks: TaskObjectType;
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
    const token = getTokenFromLS();
    const response = await fetch(`${BASE}/boards/${id}`, {
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
      })
      .addCase(getAllColumns.fulfilled, (state, action) => {
        state.columns = action.payload;
      })
      .addCase(getAllColumnTasks.fulfilled, (state, action) => {
        const taskObj = action.payload.tasks.map((task) => parseTaskObj(task));
        state.tasks[action.payload.column] = taskObj;
      })

      // create task
      .addCase(thunkCreateTasks.pending, (state) => {
        state.pending = true;
      })
      .addCase(thunkCreateTasks.fulfilled, (state, action) => {
        state.pending = false;
        // была ошибка тк не находил объект state.tasks[action.payload.column], после добавления колонок в стор по ключам надо переписать
        // это демо, работают запросы, можно глянуть в девтулзах
        const newObj = Object.assign(state.tasks, {
          [action.payload.column]: parseTaskObj(action.payload.task),
        });
        state.tasks = newObj;
      })
      .addCase(thunkCreateTasks.rejected, (state, action) => {
        state.pending = false;
        console.log(action.payload);
        if (typeof action.payload === 'string') {
          toast.error(action.payload);
        }
      });
  },
});

export const { clearErrors } = boardSlice.actions;

export default boardSlice.reducer;
