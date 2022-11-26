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
      return rejectWithValue(`error code: ${resp?.statusCode} message: ${resp?.message}`);
    }
    const data: ColumnType[] = await response.json();
    return data.sort((a, b) => a.order - b.order);
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
    return rejectWithValue(`error code: ${resp?.statusCode} message: ${resp?.message}`);
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
      return rejectWithValue(`error code: ${resp?.statusCode} message: ${resp?.message}`);
    }
    return data.columnId;
  }
);

type UpdateColumnRequestType = {
  boardId: string;
  columnId: string;
  title: string;
  order: number;
};

export const thunkUpdateColumn = createAsyncThunk<
  undefined,
  UpdateColumnRequestType,
  { rejectValue: string }
>('column/updateColumn', async (data, { rejectWithValue }) => {
  const token = getTokenFromLS();
  const response = await fetch(`${BASE}/boards/${data.boardId}/columns/${data.columnId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title: data.title, order: data.order }),
  });

  if (!response.ok) {
    const resp = await response.json();
    return rejectWithValue(`error code: ${resp?.statusCode} message: ${resp?.message}`);
  }
});

export const thunkUpdateTitleColumn = createAsyncThunk<
  ColumnType,
  UpdateColumnRequestType,
  { rejectValue: string }
>('column/updateTitleColumn', async (data, { rejectWithValue }) => {
  const token = getTokenFromLS();
  const response = await fetch(`${BASE}/boards/${data.boardId}/columns/${data.columnId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title: data.title, order: data.order }),
  });

  if (!response.ok) {
    const resp = await response.json();
    return rejectWithValue(`error code: ${resp?.statusCode} message: ${resp?.message}`);
  }
  const column: ColumnType = await response.json();
  return column;
});
