import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchGetColumns } from 'api/apiBoard';
import { BASE } from 'api/config';
import { getTokenFromLS } from 'utils/func/localStorage';
import { ColumnType } from '../boardSlice';

export const thunkGetAllColumns = createAsyncThunk<ColumnType[], string, { rejectValue: string }>(
  'column/getAllColumns',
  async (boardId, { rejectWithValue }) => {
    const token = getTokenFromLS();
    const response = await fetchGetColumns(boardId, token);

    if (!response.ok) {
      const resp = await response.json();
      return rejectWithValue(`${resp?.statusCode}/${resp.message}`);
    }
    const data: ColumnType[] = await response.json();
    return data;
  }
);

type CreateColumnRequestType = {
  boardId: string;
  title: string;
  order: number;
};

export const thunkCreateColumn = createAsyncThunk<
  ColumnType,
  CreateColumnRequestType,
  { rejectValue: string }
>('column/createColumn', async (data, { rejectWithValue }) => {
  const token = getTokenFromLS();
  const response = await fetch(`${BASE}/boards/${data.boardId}/columns`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title: data.title, order: data.order }),
  });
  if (!response.ok) {
    const resp = await response.json();
    return rejectWithValue(`${resp?.statusCode}/${resp.message}`);
  }
  return await response.json();
});

type deleteColumn = {
  boardId: string;
  columnId: string;
};

export const thunkDeleteColumn = createAsyncThunk<string, deleteColumn, { rejectValue: string }>(
  'column/deleteColumn',
  async (data, { rejectWithValue }) => {
    const token = getTokenFromLS();
    const response = await fetch(`${BASE}/boards/${data.boardId}/columns/${data.columnId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const resp = await response.json();
      return rejectWithValue(`${resp?.statusCode}/${resp.message}`);
    }
    return data.columnId;
  }
);
