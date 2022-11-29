import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchGetColumns } from 'api/apiBoard';
import { BASE } from 'api/config';
import { getTokenFromLS } from 'utils/func/localStorage';
import { clearBoardErrors, ColumnType } from '../boardSlice';
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
    console.log(data);
    return data.sort((a, b) => a.order - b.order);
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
  /*  const state = getState() as RootState;
  const error = state.board.error;
  if (error) {
    return;
  }*/
  try {
    console.log(`UpdateColumn ${data.title}`);
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
    console.log(response);
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
    const { result, columns, id } = data;
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
      for (const column of newColumns) {
        console.log(column);
        dispatch(
          thunkUpdateColumn({
            boardId: `${id}`,
            columnId: column._id,
            title: column.title,
            order: column.order,
          })
        ).unwrap();
      }
    } catch (error) {
      console.log(error);
      dispatch(clearBoardErrors());
    }
  }
);
