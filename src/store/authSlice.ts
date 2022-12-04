import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchSignIn, fetchSignUp } from '../api/apiAuth';
import { Signup, Signin, User } from '../api/types';
import { RootState } from 'store';
import { removeTokenFromLS, setTokenToLS } from 'utils/func/localStorage';
import { deleteUser, getUserById, updateUser } from 'api/apiUsers';
import { parseJwt } from 'utils/func/parsejwt';
import { getErrorMessage } from 'utils/func/handleError';

type Auth = {
  isLogged: boolean | null;
  user: Omit<User, 'password'>;
};

const userInit: Omit<User, 'password'> = {
  _id: '',
  name: '',
  login: '',
};

const initialState: Auth = {
  isLogged: null,
  user: userInit,
};

export const thunkSignUp = createAsyncThunk(
  'auth/fetchSignUp',
  async (options: Signup, { rejectWithValue }) => {
    try {
      const res = await fetchSignUp(options);
      if (!res.ok) {
        const err: { message: string; statusCode: number } = await res.json();

        throw new Error(`${err.statusCode}_SIGNUP`);
      }
      const { _id, name, login }: User = await res.json();
      const password = options.password;
      return { _id, name, login, password };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const thunkSignIn = createAsyncThunk(
  'auth/fetchSignIn',
  async ({ login, password }: Signin, { rejectWithValue }) => {
    try {
      const res = await fetchSignIn({ login, password });

      if (!res.ok) {
        const err: { message: string; statusCode: number } = await res.json();
        throw new Error(`${err.statusCode}_SIGNIN`);
      }

      const { token }: { token: string } = await res.json();
      setTokenToLS(token);

      const userId = parseJwt(token).id;
      return { token, userId };
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
        dispatch(setAuth(false));
        throw new Error(`${err.statusCode}_USER`);
      }
      const response: User = await res.json();
      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const thunkUpdateUser = createAsyncThunk(
  'users/thunkUpdateUser',
  async ({ user, token }: { user: User; token: string }, { rejectWithValue }) => {
    try {
      const res = await updateUser(user, token);
      if (!res.ok) {
        const err: { message: string; statusCode: number } = await res.json();
        throw new Error(`${err.statusCode}_USER_UPDATE`);
      }
      const response: Omit<User, 'password'> = await res.json();
      const password = user.password;
      return Object.assign(response, { password });
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const thunkDeleteUser = createAsyncThunk(
  'users/thunkDeleteUser',
  async ({ id, token }: { id: string; token: string }, { rejectWithValue }) => {
    try {
      const res = await deleteUser(id, token);
      if (!res.ok) {
        const err: { message: string; statusCode: number } = await res.json();
        throw new Error(`${err.statusCode}_USER_DELETE`);
      }
      const response: Omit<User, 'password'> = await res.json();
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
    builder
      .addCase(thunkGetUserById.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLogged = true;
      })
      .addCase(thunkGetUserById.rejected, (state) => {
        removeTokenFromLS();
        state.isLogged = false;
      });

    builder.addCase(thunkUpdateUser.rejected, (state, action) => {
      if (action.payload !== '409_USER_UPDATE') {
        removeTokenFromLS();
        state.isLogged = false;
      }
    });

    builder
      .addCase(thunkDeleteUser.fulfilled, (state) => {
        removeTokenFromLS();
        state.isLogged = false;
      })
      .addCase(thunkDeleteUser.rejected, (state) => {
        removeTokenFromLS();
        state.isLogged = false;
      });
  },
});

export default authSlice.reducer;
export const { setUser, setAuth } = authSlice.actions;
export const authSelector = (state: RootState) => state.auth;
export const userSelector = (state: RootState) => state.auth.user;
