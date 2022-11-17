import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { BASE } from 'api/config';
import { toast } from 'react-toastify';
import { parseTaskObj, parseBoardObj } from 'utils/func/boardHandler';
import { getTokenFromLS } from 'utils/func/localStorage';
import { BoardInfo } from './boardsSlice';
import { thunkCreateColumn, thunkDeleteColumn, thunkGetAllColumns } from './middleware/columns';
import { thunkGetAllTasks, thunkCreateTasks } from './middleware/tasks';
import { RootState } from 'store';

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
  title: BoardInfo;
  error: string;
  pending: boolean | string;
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
  title: {
    title: '',
    descr: '',
  },
  error: '',
  pending: false,
  columns: [],
  tasks: {},
};

export const thunkGetSingleBoard = createAsyncThunk<
  BoardResponseType,
  string,
  { rejectValue: string }
>('board/getSingleBoard', async (id, { rejectWithValue }) => {
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
});

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
      .addCase(thunkGetSingleBoard.fulfilled, (state, action) => {
        const parsedBoard = parseBoardObj(action.payload);
        state.id = parsedBoard._id;
        state.title = parsedBoard.title;
        state.pending = false;
      })
      .addCase(thunkGetSingleBoard.pending, (state) => {
        state.pending = 'full';
      })
      // Columns
      .addCase(thunkGetAllColumns.fulfilled, (state, action) => {
        state.columns = action.payload;
        state.pending = false;
      })
      .addCase(thunkGetAllColumns.pending, (state) => {
        state.pending = 'full';
      })
      .addCase(thunkCreateColumn.fulfilled, (state, action) => {
        state.columns.push(action.payload);
        state.pending = false;
      })
      .addCase(thunkCreateColumn.pending, (state) => {
        state.pending = true;
      })
      .addCase(thunkCreateColumn.rejected, (state, action) => {
        state.pending = false;
        if (typeof action.payload === 'string') {
          toast.error(action.payload);
        }
      })
      .addCase(thunkDeleteColumn.fulfilled, (state, action) => {
        state.pending = false;
        state.columns.splice(
          state.columns.findIndex((elem) => {
            console.log(elem._id);
            return elem._id === action.payload;
          }),
          1
        );
      })
      .addCase(thunkDeleteColumn.pending, (state) => {
        state.pending = true;
      })
      // Tasks
      .addCase(thunkGetAllTasks.fulfilled, (state, action) => {
        const taskObj = action.payload.tasks.map((task) => parseTaskObj(task));
        state.tasks[action.payload.column] = taskObj;
      })
      .addCase(thunkCreateTasks.pending, (state) => {
        state.pending = true;
      })
      .addCase(thunkCreateTasks.fulfilled, (state, action) => {
        state.pending = false;
        // была ошибка тк не находил объект state.tasks[action.payload.column], после добавления колонок в стор по ключам надо переписать
        // это демо, работают запросы, можно глянуть в девтулзах

        state.tasks[action.payload.column].push(parseTaskObj(action.payload.task));
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

export const singleBoardRequestStatus = (state: RootState) => state.board.pending;

export default boardSlice.reducer;
