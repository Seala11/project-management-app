import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchGetColumn, fetchGetColumns } from 'api/apiBoard';
import { BASE, COLUMN_SET } from 'api/config';
import { getTokenFromLS } from 'utils/func/localStorage';
import { ColumnType } from '../boardSlice';
import { updateColumnsOrder } from 'store/boardSlice';
import { DropResult } from 'react-beautiful-dnd';
import { getErrorMessage } from 'utils/func/handleError';
import { RootState } from 'store';

export const thunkGetAllColumns = createAsyncThunk<
  ColumnType[] | boolean,
  string,
  { rejectValue: string }
>('column/getAllColumns', async (boardId, { getState, rejectWithValue }) => {
  const state = getState() as RootState;
  const error = state.board.error;
  if (error) {
    return false;
  }
  const token = getTokenFromLS();
  try {
    const response = await fetchGetColumns(boardId, token);
    if (!response.ok) {
      const resp = await response.json();
      throw new Error(`${resp?.statusCode}/${resp.message}`);
    }
    const data: ColumnType[] = await response.json();
    return data.sort((a, b) => a.order - b.order);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const thunkGetColumn = createAsyncThunk<
  boolean,
  { boardId: string; columnId: string },
  { rejectValue: string }
>('column/getColumn', async ({ boardId, columnId }, { rejectWithValue }) => {
  const token = getTokenFromLS();
  try {
    const response = await fetchGetColumn(boardId, columnId, token);
    if (response.status === 204) {
      throw new Error(`${response?.status}/${response.statusText}`);
    }
    return true;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

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
  try {
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
      throw new Error(`${resp?.statusCode}/${resp.message}`);
    }
    const column: ColumnType = await response.json();
    return column;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

type deleteColumn = {
  boardId: string;
  columnId: string;
};

export const thunkDeleteColumn = createAsyncThunk<string, deleteColumn, { rejectValue: string }>(
  'column/deleteColumn',
  async (data, { rejectWithValue }) => {
    const token = getTokenFromLS();
    try {
      const response = await fetch(`${BASE}/boards/${data.boardId}/columns/${data.columnId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const resp = await response.json();
        throw new Error(`${resp?.statusCode}/${resp.message}`);
      }
      return data.columnId;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

type ColumnSetType = {
  _id: string;
  order: number;
};

type UpdateColumnRequestType = {
  boardId: string;
  columnId: string;
  title: string;
  order: number;
};

export const thunkUpdateColumns = createAsyncThunk<
  undefined,
  ColumnSetType[],
  { rejectValue: string }
>('column/updateColumn', async (data, { rejectWithValue }) => {
  const token = getTokenFromLS();
  try {
    const response = await fetch(`${COLUMN_SET}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const resp = await response.json();
      throw new Error(`${resp?.statusCode}/${resp.message}`);
    }
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const thunkUpdateTitleColumn = createAsyncThunk<
  ColumnType,
  UpdateColumnRequestType,
  { rejectValue: string }
>('column/updateTitleColumn', async (data, { rejectWithValue }) => {
  const token = getTokenFromLS();
  try {
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
      throw new Error(`${resp?.statusCode}/${resp.message}`);
    }
    const column: ColumnType = await response.json();
    return column;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

type DragEndColumnsEntires = {
  result: DropResult;
  columns: ColumnType[];
  id: string | undefined;
};

export const thunkDragEndColumns = createAsyncThunk<void, DragEndColumnsEntires>(
  'column/handleDragEndColumns',
  async (data: DragEndColumnsEntires, { dispatch }) => {
    const { result, columns } = data;
    const { destination, source } = result;
    if (!destination) return;
    const destinationOrder = columns[destination.index].order;
    const dragSpanIndex = source.index - destination.index;
    const newColumns = columns
      .map((item, i) => {
        if (i === source.index) return { ...item, order: destinationOrder };
        else if (dragSpanIndex > 0 && i >= destination.index && i < source.index)
          return { ...item, order: item.order + 1 };
        else if (dragSpanIndex < 0 && i <= destination.index && i > source.index)
          return { ...item, order: item.order - 1 };
        return item;
      })
      .sort((a, b) => a.order - b.order);
    try {
      dispatch(updateColumnsOrder(newColumns));
      const setOfColumns = newColumns.map((item) => {
        return { _id: item._id, order: item.order };
      });
      await dispatch(thunkUpdateColumns(setOfColumns)).unwrap();
    } catch (error) {
      dispatch(updateColumnsOrder(columns)); //return old state
      console.error(`Error: ${error}, return state!`);
    }
  }
);
