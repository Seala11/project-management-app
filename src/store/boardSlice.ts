import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { parseTaskObj, parseBoardObj } from 'utils/func/boardHandler';
import { getTokenFromLS } from 'utils/func/localStorage';
import { BoardInfo } from './boardsSlice';
import {
  thunkCreateColumn,
  thunkDeleteColumn,
  thunkGetAllColumns,
  thunkUpdateTitleColumn,
} from './middleware/columns';
import { thunkGetAllTasks, thunkCreateTask, thunkDeleteTasks } from './middleware/tasks';
import { RootState } from 'store';
import { fetchGetBoard } from 'api/apiBoard';

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

export type TaskParsedType = {
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

export type UpdateTasksData = {
  destColumnId: string;
  sourceColumnId?: string;
  tasks: TaskParsedType[];
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
  const response = await fetchGetBoard(id, token);

  if (!response.ok) {
    const resp = await response.json();
    return rejectWithValue(`error code: ${resp?.statusCode} message: ${resp?.message}`);
  }
  const data: BoardResponseType = await response.json();
  return data;
});

export const boardSlice = createSlice({
  name: 'board',
  initialState: initialBoardState,
  reducers: {
    updateColumnsOrder(state, { payload }: PayloadAction<ColumnType[]>) {
      state.columns = payload;
    },
    updateTasksState(state, { payload }: PayloadAction<UpdateTasksData>) {
      state.tasks[payload.destColumnId] = payload.tasks;
    },
    clearErrors(state) {
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
        state.pending = true;
      })
      // Columns
      .addCase(thunkGetAllColumns.fulfilled, (state, action) => {
        state.columns = action.payload;
        state.pending = false;
      })
      .addCase(thunkGetAllColumns.pending, (state) => {
        state.pending = true;
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
        const newColumnState = state.columns.filter((col) => col._id !== action.payload);
        state.columns = newColumnState;
      })
      .addCase(thunkDeleteColumn.pending, (state) => {
        state.pending = true;
      })
      .addCase(thunkUpdateTitleColumn.fulfilled, (state, action) => {
        const index = state.columns.findIndex((obj) => obj._id === action.payload._id);
        state.columns[index].title = action.payload.title;
      })
      // Tasks
      .addCase(thunkGetAllTasks.fulfilled, (state, action) => {
        const taskObj = action.payload.tasks.map((task) => parseTaskObj(task));
        state.tasks[action.payload.column] = taskObj;
      })

      .addCase(thunkCreateTask.pending, (state) => {
        state.pending = true;
      })
      .addCase(thunkCreateTask.fulfilled, (state, action) => {
        state.pending = false;
        state.tasks[action.payload.column].push(parseTaskObj(action.payload.task));
      })
      .addCase(thunkCreateTask.rejected, (state, action) => {
        state.pending = false;
        console.log(action.payload);
        if (typeof action.payload === 'string') {
          toast.error(action.payload);
        }
      })
      .addCase(thunkDeleteTasks.pending, (state) => {
        state.pending = true;
      })
      .addCase(thunkDeleteTasks.fulfilled, (state, action) => {
        state.pending = false;
        const newTaskState = state.tasks[action.payload.column].filter(
          (task) => task._id !== action.payload.task._id
        );
        state.tasks[action.payload.column] = newTaskState;
      })
      .addCase(thunkDeleteTasks.rejected, (state, action) => {
        state.pending = false;
        console.log(action.payload);
        if (typeof action.payload === 'string') {
          toast.error(action.payload);
        }
      });
  },
});

export const { clearErrors, updateColumnsOrder, updateTasksState } = boardSlice.actions;

export const singleBoardRequestStatus = (state: RootState) => state.board.pending;
export const columnsSelector = (state: RootState) => state.board.columns;
export const boardIdSelector = (state: RootState) => state.board.id;

export default boardSlice.reducer;
