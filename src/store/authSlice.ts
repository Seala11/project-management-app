/* eslint-disable @typescript-eslint/no-unused-vars */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchSignIn, fetchSignUp } from '../api/apiAuth';
import { Signup, Signin, User } from '../api/types';
import { RootState } from 'store';
import { removeTokenFromLS, setTokenToLS } from 'utils/func/localStorage';
import { getUserById } from 'api/apiUsers';
import { parseJwt } from 'utils/func/parsejwt';
import { toast } from 'react-toastify';
import { getErrorMessage } from 'utils/func/handleError';
import { setToastMessage } from './appSlice';

type Auth = {
  isLogged: boolean;
  user: Omit<User, 'password'>;
};

const errorArray = [400, 401, 403, 404, 409];

const userInit: Omit<User, 'password'> = {
  _id: '',
  name: '',
  login: '',
};

const initialState: Auth = {
  isLogged: false,
  user: userInit,
  // toastMessage: null,
};

export const thunkSignUp = createAsyncThunk(
  'auth/fetchSignUp',
  async (options: Signup, { rejectWithValue, dispatch }) => {
    try {
      const res = await fetchSignUp(options);
      if (!res.ok) {
        const err: { message: string; statusCode: number } = await res.json();
        if (errorArray.includes(err.statusCode)) {
          dispatch(setToastMessage(err.message));
        }
        throw new Error(err.message);
      }
      const response: User = await res.json();
      const login = options.login;
      const password = options.password;
      dispatch(thunkSignIn({ login, password }));
      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const thunkSignIn = createAsyncThunk(
  'auth/fetchSignIn',
  async (options: Signin, { rejectWithValue, dispatch }) => {
    try {
      const res = await fetchSignIn(options);

      if (!res.ok) {
        const err: { message: string; statusCode: number } = await res.json();
        if (errorArray.includes(err.statusCode)) {
          dispatch(setToastMessage(err.message));
        }
        throw new Error(err.message);
      }

      const { token }: { token: string } = await res.json();
      setTokenToLS(token);

      const userId = parseJwt(token).id;
      dispatch(thunkGetUserById({ token, userId }));
      return token;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const thunkGetUserById = createAsyncThunk(
  'auth/thunkGetUserById',
  async ({ userId, token }: { token: string; userId: string }, { rejectWithValue, dispatch }) => {
    try {
      const res = await getUserById(userId, token);
      if (!res.ok) {
        const err: { message: string; statusCode: number } = await res.json();

        if (errorArray.includes(err.statusCode)) {
          dispatch(setAuth(false));
          dispatch(setToastMessage(err.message));
        }

        throw new Error(String(err.message));
      }
      const response: User = await res.json();
      dispatch(setToastMessage('200'));
      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },

    setAuth(state, action) {
      state.isLogged = action.payload;
      if (!action.payload) removeTokenFromLS();
    },
  },
  extraReducers(builder) {
    // builder.addCase(thunkSignUp.fulfilled, () => {

    // toast.success('user is created');
    // });

    // builder.addCase(thunkSignUp.rejected, (state, action) => {

    // if (typeof action.payload === 'string') {
    //   toast.error(action.payload);
    // }
    // });

    // sign in

    // builder.addCase(thunkSignIn.fulfilled, () => {
    //   console.log('user is created');
    // });

    // builder.addCase(thunkSignIn.rejected, (state, action) => {
    // console.log('rejected');
    // if (typeof action.payload === 'string') {
    //   toast.error(action.payload);
    // }
    // });

    builder.addCase(thunkGetUserById.fulfilled, (state, action) => {
      state.user = action.payload;
      // setUserToLS(action.payload);
      state.isLogged = true;
      // toast.success('User sign in successfully');
      // state.toastMessage = '200';
    });

    builder.addCase(thunkGetUserById.rejected, (state, action) => {
      // console.log('rejected');
      // state.isLogged = false;
      removeTokenFromLS();
      // if (typeof action.payload === 'string') {
      // state.toastMessage = action.payload;
      // }
    });
  },
});

export default authSlice.reducer;
export const { setUser, setAuth } = authSlice.actions;
export const authSelector = (state: RootState) => state.auth;
export const userSelector = (state: RootState) => state.auth.user;
