/* eslint-disable @typescript-eslint/no-unused-vars */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchSignIn, fetchSignUp } from '../api/apiAuth';
import { Signup, Signin, User } from '../api/types';
import { RootState } from 'store';
import { getTokenFromLS, removeTokenFromLS, setTokenToLS } from 'utils/func/localStorage';
import { deleteUser, getUserById, updateUser } from 'api/apiUsers';
import { parseJwt } from 'utils/func/parsejwt';
import { toast } from 'react-toastify';
import { getErrorMessage } from 'utils/func/handleError';
import { setToastMessage } from './appSlice';

type Auth = {
  isLogged: boolean;
  user: Omit<User, 'password'>;
  pending: boolean;
};
// Это нужно перенести в enum
const SIGNIN = 'SIGNIN';
const SIGNUP = 'SIGNUP';
const USER = 'USER';
const USER_UPDATE = 'USER_UPDATE';
const USER_DELETE = 'USER_DELETE';

const userInit: Omit<User, 'password'> = {
  _id: '',
  name: '',
  login: '',
};

const initialState: Auth = {
  isLogged: !!getTokenFromLS(),
  user: userInit,
  pending: false,
  // toastMessage: null,
};

export const thunkSignUp = createAsyncThunk(
  'auth/fetchSignUp',
  async (options: Signup, { rejectWithValue, dispatch }) => {
    try {
      const res = await fetchSignUp(options);
      if (!res.ok) {
        const err: { message: string; statusCode: number } = await res.json();

        throw new Error(String(err.statusCode));
      }
      const response: Omit<User, 'password'> = await res.json();
      const login = options.login;
      const password = options.password;

      dispatch(setToastMessage({ error: false, text: String(res.status) + SIGNUP, arg: '' }));
      dispatch(thunkSignIn({ login, password }));
      return response;
    } catch (error) {
      const err = getErrorMessage(error);

      dispatch(setToastMessage({ error: true, text: err + SIGNUP }));

      return rejectWithValue(err);
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

        throw new Error(String(err.statusCode));
      }

      const { token }: { token: string } = await res.json();

      setTokenToLS(token);

      const userId = parseJwt(token).id;
      dispatch(thunkGetUserById({ token, userId }));
      return token;
    } catch (error) {
      const err = getErrorMessage(error);
      dispatch(setToastMessage({ error: true, text: err + SIGNIN }));
      return rejectWithValue(err);
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

        dispatch(setAuth(false));
        throw new Error(String(err.statusCode));
      }
      const response: User = await res.json();
      dispatch(
        setToastMessage({ error: false, text: String(res.status) + USER, arg: `${response.name}` })
      );

      return response;
    } catch (error) {
      const err = getErrorMessage(error);
      dispatch(setToastMessage({ error: true, text: err + USER }));
      return rejectWithValue(err);
    }
  }
);

export const thunkUpdateUser = createAsyncThunk(
  'users/thunkUpdateUser',
  async ({ user, token }: { user: User; token: string }, { rejectWithValue, dispatch }) => {
    try {
      const res = await updateUser(user, token);
      if (!res.ok) {
        const err: { message: string; statusCode: number } = await res.json();
        throw new Error(String(err.statusCode));
      }
      const response: Omit<User, 'password'> = await res.json();

      dispatch(setToastMessage({ error: false, text: String(res.status) + USER_UPDATE, arg: '' }));
      const login = user.login;
      const password = user.password;
      dispatch(thunkSignIn({ login, password }));
      return response;
    } catch (error) {
      const err = getErrorMessage(error);
      dispatch(setToastMessage({ error: true, text: err + SIGNUP }));
      return rejectWithValue(err);
    }
  }
);

export const thunkDeleteUser = createAsyncThunk(
  'users/thunkDeleteUser',
  async ({ id, token }: { id: string; token: string }, { rejectWithValue, dispatch }) => {
    try {
      const res = await deleteUser(id, token);
      if (!res.ok) {
        const err: { message: string; statusCode: number } = await res.json();

        throw new Error(String(err.statusCode));
      }
      const response: Omit<User, 'password'> = await res.json();
      dispatch(setToastMessage({ error: false, text: String(res.status) + USER_DELETE, arg: '' }));
      return response;
    } catch (error) {
      const err = getErrorMessage(error);
      dispatch(setToastMessage({ error: true, text: err + SIGNUP }));
      return rejectWithValue(err);
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

    builder.addCase(thunkGetUserById.rejected, (state, action) => {
      removeTokenFromLS();
      state.isLogged = false;
    });

    builder.addCase(thunkUpdateUser.rejected, (state, action) => {
      removeTokenFromLS();
      state.isLogged = false;
    });

    builder
      .addCase(thunkGetUserById.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLogged = true;
      })

      .addCase(thunkGetUserById.rejected, (state, action) => {
        removeTokenFromLS();
      })

      .addCase(thunkSignIn.fulfilled, (state) => {
        state.pending = false;
      })

      .addCase(thunkSignIn.pending, (state) => {
        state.pending = true;
      })

      .addCase(thunkSignIn.rejected, (state) => {
        state.pending = false;
      })

      .addCase(thunkSignUp.fulfilled, (state) => {
        state.pending = false;
      })

      .addCase(thunkSignUp.pending, (state) => {
        state.pending = true;
      })

      .addCase(thunkSignUp.rejected, (state) => {
        state.pending = false;
      });
  },
});

export default authSlice.reducer;
export const { setUser, setAuth } = authSlice.actions;
export const authSelectorStatus = (state: RootState) => state.auth.pending;
export const authSelector = (state: RootState) => state.auth;
export const userSelector = (state: RootState) => state.auth.user;
