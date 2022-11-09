/* eslint-disable @typescript-eslint/no-unused-vars */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';
import type { PayloadAction } from '@reduxjs/toolkit';
import { fetchSignIn, fetchSignUp } from '../api/apiAuth';
import { SighUp, SignIn, User } from '../api/types';

import { RootState } from 'store';
import { setTokenToLS } from 'api/localStorage';

type Auth = {
  auth: boolean;
  user: User;
  token: string;
};

const initialState: Auth = {
  auth: false,
  user: {
    _id: '',
    name: '',
    login: '',
    password: '',
  },
  token: '',
};

export const thunkSignUp = createAsyncThunk(
  'auth/fetchSignUp',
  async (options: SighUp, { rejectWithValue, dispatch }) => {
    try {
      const res = await fetchSignUp(options);
      if (!res.ok) {
        const response: { message: string; statusCode: number } = await res.json();
        throw new Error(response.message);
      }
      const response: User = await res.json();
      dispatch(setUser(Object.assign(options, { _id: response._id })));
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const thunkSignIn = createAsyncThunk(
  'auth/fetchSignIn',
  async (options: SignIn, { rejectWithValue }) => {
    try {
      const res = await fetchSignIn(options);
      if (!res.ok) {
        const response: { message: string; statusCode: number } = await res.json();
        throw new Error(response.message);
      }
      const response: { token: string } = await res.json();
      console.log(response.token);

      setTokenToLS(response.token);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  extraReducers(builder) {
    builder.addCase(thunkSignUp.pending, (state, action) => {
      console.log('pending');
    });
    builder.addCase(thunkSignUp.fulfilled, (state, action) => {
      console.log('user is created');
    });
    builder.addCase(thunkSignUp.rejected, (state, action) => {
      console.log('rejected');
      console.log(action.payload);
    });
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
  },
});

export default authSlice.reducer;
export const { setUser } = authSlice.actions;
