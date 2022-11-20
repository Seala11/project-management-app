import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAllUsers } from 'api/apiUsers';
import { getTokenFromLS } from 'utils/func/localStorage';

export type UserType = {
  _id: string;
  name: string;
  login: string;
};

export const thunkGetAllUsers = createAsyncThunk(
  'users/getAllUsers',
  async (_, { rejectWithValue }) => {
    const token = getTokenFromLS();
    const response = await getAllUsers(token);

    if (!response.ok) {
      const resp = await response.json();
      return rejectWithValue(`${resp?.statusCode}/${resp.message}`);
    }
    const users: UserType[] = await response.json();
    return users;
  }
);
