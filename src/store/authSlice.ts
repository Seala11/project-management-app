/* eslint-disable @typescript-eslint/no-unused-vars */
import { AsyncThunk, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';
import type { PayloadAction } from '@reduxjs/toolkit';
import { fetchSignIn, fetchSignUp } from '../api/apiAuth';
import { Signup, Signin, User } from '../api/types';
import { useAppDispatch } from './hooks';
import { RootState } from 'store';
import { setTokenToLS } from 'api/localStorage';
import { getAllUsers, getUserById } from 'api/apiUsers';

type Auth = {
  auth: boolean;
  user: User;
  token: string;
  registered: boolean;
};

const initialState: Auth = {
  auth: false,
  registered: false,
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
  async (options: Signup, { rejectWithValue, dispatch }) => {
    try {
      const res = await fetchSignUp(options);
      if (!res.ok) {
        const response: { message: string; statusCode: number } = await res.json();
        throw new Error(response.message);
      }
      const response: Omit<User, 'password'> = await res.json();
      return Object.assign(response, { password: options.password });
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const thunkSignIn = createAsyncThunk(
  'auth/fetchSignIn',
  async (options: Signin, { rejectWithValue, dispatch, getState }) => {
    try {
      const res = await fetchSignIn(options);

      if (!res.ok) {
        const response: { message: string; statusCode: number } = await res.json();
        throw new Error(response.message);
      }

      const { token }: { token: string } = await res.json();
      setTokenToLS(token);
      console.log('login');
      return token;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const thunkGetUserById = createAsyncThunk(
  'auth/thunkGetUserById',
  async ({ userId, token }: { token: string; userId: string }, { rejectWithValue, dispatch }) => {
    try {
      const res = await getUserById(userId, token);
      if (!res.ok) {
        const response: { message: string; statusCode: number } = await res.json();
        throw new Error(response.message);
      }
      const response = await res.json();
      console.log('auth');
      console.log(response);
      // const response: Omit<User, 'password'> = await res.json();
      // return Object.assign(response, { password: options.password });
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  extraReducers(builder) {
    // builder.addCase(thunkSignUp.pending, (state, action) => {
    //   console.log('pending');
    // });
    builder.addCase(thunkSignUp.fulfilled, (state, action) => {
      console.log('user is created');
      state.registered = true;
      state.user = action.payload;
    });

    builder.addCase(thunkSignUp.rejected, (state, action) => {
      console.log('rejected');
      // toast.error(action.payload);
    });

    // sign in

    builder.addCase(thunkSignIn.fulfilled, (state, action) => {
      console.log('user is created');
      // state.user = action.payload;
      state.auth = true;
      // toast.success('User sign in successfully');
    });

    builder.addCase(thunkSignIn.rejected, (state, action) => {
      console.log('rejected');
      // toast.error(action.payload);
    });

    builder.addCase(thunkGetUserById.rejected, (state, action) => {
      console.log('rejected');
      state.auth = false;
      // toast.error(action.payload);
    });
  },

  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },

    setAuth(state, action) {
      state.auth = action.payload;
    },
  },
});

export default authSlice.reducer;
export const { setUser, setAuth } = authSlice.actions;
export const authSelector = (state: RootState) => state.auth;
export const userSelector = (state: RootState) => state.auth.user;
