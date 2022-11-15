import { createAsyncThunk } from '@reduxjs/toolkit';
import { BASE } from 'api/config';
import { getTokenFromLS } from 'api/localStorage';
import { TaskType } from '../boardSlice';

export type TaskResponseType = {
  column: string;
  tasks: TaskType[];
};

export type TaskRequestDataType = {
  boardId: string;
  columnId: string;
};

export const getAllColumnTasks = createAsyncThunk<
  TaskResponseType,
  TaskRequestDataType,
  { rejectValue: string }
>('task/getAllColumnTasks', async ({ boardId, columnId }, { rejectWithValue }) => {
  const token = getTokenFromLS();
  const response = await fetch(`${BASE}/boards/${boardId}/columns/${columnId}/tasks`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const resp = await response.json();
    return rejectWithValue(`${resp?.statusCode}/${resp.message}`);
  }
  const data: TaskType[] = await response.json();
  return { column: columnId, tasks: data };
});
