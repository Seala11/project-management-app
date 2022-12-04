import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAllUsers } from 'api/apiUsers';
import { setAuth } from 'store/authSlice';
import { getTokenFromLS } from 'utils/func/localStorage';

export type UserType = {
  _id: string;
  name: string;
  login: string;
};

export const thunkGetAllUsers = createAsyncThunk(
  'users/getAllUsers',
  async (_, { rejectWithValue, dispatch }) => {
    const token = getTokenFromLS();
    const response = await getAllUsers(token);

    if (!response.ok) {
      const resp = await response.json();

      if (response.status === 403) {
        dispatch(setAuth(false));
      }

      return rejectWithValue(`${resp?.statusCode}/${resp.message}`);
    }
    const users: UserType[] = await response.json();
    return users;
  }
);
