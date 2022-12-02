import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { parseTaskObj, parseBoardObj } from 'utils/func/boardHandler';
import { getTokenFromLS } from 'utils/func/localStorage';
import { BoardInfo } from './boardsSlice';
import {
  thunkCreateColumn,
  thunkDeleteColumn,
  thunkGetAllColumns,
  thunkUpdateTitleColumn,
} from './middleware/columns';
import {
  thunkGetAllTasks,
  thunkCreateTask,
  thunkDeleteTasks,
  thunkUpdateTaskInfo,
} from './middleware/tasks';
import { RootState } from 'store';
import { fetchGetBoard } from 'api/apiBoard';
import { getErrorMessage } from 'utils/func/handleError';

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
  error: string | null;
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
  error: null,
  pending: false,
  columns: [],
  tasks: {},
};

export const thunkGetSingleBoard = createAsyncThunk<
  BoardResponseType,
  string,
  { rejectValue: string }
>('board/getSingleBoard', async (id, { dispatch, rejectWithValue }) => {
  const token = getTokenFromLS();
  try {
    const response = await fetchGetBoard(id, token);
    if (!response.ok) {
      const resp = await response.json();
      throw new Error(`${resp?.statusCode}/${resp.message}`);
    }
    dispatch(thunkGetAllColumns(id));
    const data: BoardResponseType = await response.json();
    return data;
  } catch (error) {
    console.error(`Error: ${error}`);
    return rejectWithValue(getErrorMessage(error));
  }
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
    clearState(state) {
      state.columns = [];
      state.tasks = {};
      state.title = { title: '', descr: '' };
    },
    clearBoardErrors(state) {
      state.error = null;
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
      // Columns get all
      .addCase(thunkGetAllColumns.fulfilled, (state, action) => {
        if (typeof action.payload === 'boolean') return;
        state.columns = action.payload;
        state.pending = false;
      })
      .addCase(thunkGetAllColumns.pending, (state) => {
        state.pending = true;
      })
      // Column create
      .addCase(thunkCreateColumn.fulfilled, (state, action) => {
        state.columns.push(action.payload);
        state.pending = false;
      })
      .addCase(thunkCreateColumn.pending, (state) => {
        state.pending = true;
      })

      // Column delete
      .addCase(thunkDeleteColumn.fulfilled, (state, action) => {
        state.pending = false;
        const newColumnState = state.columns.filter((col) => col._id !== action.payload);
        state.columns = newColumnState;
      })
      .addCase(thunkDeleteColumn.pending, (state) => {
        state.pending = true;
      })

      // Column update title
      .addCase(thunkUpdateTitleColumn.fulfilled, (state, action) => {
        const index = state.columns.findIndex((obj) => obj._id === action.payload._id);
        state.columns[index].title = action.payload.title;
      })
      // Tasks
      .addCase(thunkGetAllTasks.fulfilled, (state, action) => {
        if (typeof action.payload === 'boolean') return;

        const taskObj = action.payload.tasks.map((task) => parseTaskObj(task));
        state.tasks[action.payload.column] = taskObj;
      })
      // Task Create
      .addCase(thunkCreateTask.pending, (state) => {
        state.pending = true;
      })
      .addCase(thunkCreateTask.fulfilled, (state, action) => {
        state.pending = false;
        state.tasks[action.payload.column].push(parseTaskObj(action.payload.task));
      })

      // Task Delete
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
      // Task Module
      .addCase(thunkUpdateTaskInfo.fulfilled, (state, action) => {
        const updatedTask = parseTaskObj(action.payload.task);
        const newTaskState = state.tasks[action.payload.column].map((task) =>
          task._id === action.payload.task._id ? (task = updatedTask) : task
        );
        state.tasks[action.payload.column] = newTaskState;
      })
      .addMatcher(
        (action) =>
          action.type.endsWith('/rejected') &&
          (action.type.startsWith('board/') ||
            action.type.startsWith('column/') ||
            action.type.startsWith('task/')),
        (state, action: PayloadAction<string>) => {
          if (!state.error) {
            state.error = action.payload;
            state.pending = false;
          }
        }
      );
  },
});

export const { clearBoardErrors, updateColumnsOrder, updateTasksState, clearState } =
  boardSlice.actions;

export const singleBoardRequestStatus = (state: RootState) => state.board.pending;
export const columnsSelector = (state: RootState) => state.board.columns;
export const boardIdSelector = (state: RootState) => state.board.id;

export default boardSlice.reducer;
