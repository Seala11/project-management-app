import { createAsyncThunk } from '@reduxjs/toolkit';
import { BASE } from 'api/config';
import { getTokenFromLS } from 'api/localStorage';
import { ColumnType } from './boardSlice';

export const getAllColumns = createAsyncThunk<ColumnType[], string, { rejectValue: string }>(
  'column/getAllColumns',
  async (boardId, { rejectWithValue }) => {
    const token = getTokenFromLS();
    const response = await fetch(`${BASE}/boards/${boardId}/columns`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const resp = await response.json();
      return rejectWithValue(`${resp?.statusCode}/${resp.message}`);
    }
    const data: ColumnType[] = await response.json();
    return data;
  }
);
