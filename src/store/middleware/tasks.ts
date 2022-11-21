import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCreateTask, fetchDeleteTask, fetchGetTasks } from 'api/taskApi';
import { getTokenFromLS } from 'utils/func/localStorage';
import { TaskType } from '../boardSlice';

export type TaskResponseType = {
  column: string;
  tasks: TaskType[];
};

export type TaskRequestDataType = {
  boardId: string;
  columnId: string;
};

export const thunkGetAllTasks = createAsyncThunk<
  TaskResponseType,
  TaskRequestDataType,
  { rejectValue: string }
>('task/getAllTasks', async ({ boardId, columnId }, { rejectWithValue }) => {
  const token = getTokenFromLS();
  const response = await fetchGetTasks(boardId, columnId, token);

  if (!response.ok) {
    const resp = await response.json();
    return rejectWithValue(`${resp?.statusCode}/${resp.message}`);
  }
  const data: TaskType[] = await response.json();
  return { column: columnId, tasks: data };
});

// create Task

type CreateTaskRequestType = {
  boardId: string;
  columnId: string;
  userId: string;
  title: string;
  description: string;
  order: number;
};

type CreateTaskResponseType = {
  column: string;
  task: TaskType;
};

export const thunkCreateTasks = createAsyncThunk<
  CreateTaskResponseType,
  CreateTaskRequestType,
  { rejectValue: string }
>(
  'task/createTask',
  async ({ boardId, columnId, title, description, order, userId }, { rejectWithValue }) => {
    const token = getTokenFromLS();
    const response = await fetchCreateTask(
      boardId,
      columnId,
      userId,
      title,
      description,
      order,
      token
    );

    if (!response.ok) {
      const resp = await response.json();
      return rejectWithValue(`${resp?.statusCode}/${resp.message}`);
    }
    const task: TaskType = await response.json();
    return { column: columnId, task: task };
  }
);

// delete Task

type DeleteTaskRequestType = {
  boardId: string;
  columnId: string;
  taskId: string;
};

export type DeleteTaskResponseType = {
  column: string;
  task: TaskType;
};

export const thunkDeleteTasks = createAsyncThunk<
  DeleteTaskResponseType,
  DeleteTaskRequestType,
  { rejectValue: string }
>('task/deleteTask', async ({ boardId, columnId, taskId }, { rejectWithValue }) => {
  const token = getTokenFromLS();
  const response = await fetchDeleteTask(boardId, columnId, taskId, token);

  if (!response.ok) {
    const resp = await response.json();
    return rejectWithValue(`${resp?.statusCode}/${resp.message}`);
  }
  const task: TaskType = await response.json();
  return { column: columnId, task: task };
});
