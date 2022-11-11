import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchSignIn, fetchSignUp } from '../api/apiAuth';
import { Signup, Signin, User } from '../api/types';
import { RootState } from 'store';
import { setTokenToLS } from 'api/localStorage';
import { getUserById } from 'api/apiUsers';
import { parseJwt } from 'utils/func/parsejwt';
import { toast } from 'react-toastify';
import { getErrorMessage } from 'utils/func/handleError';

type Auth = {
  auth: boolean;
  user: Omit<User, 'password'>;
};

const initialState: Auth = {
  auth: false,
  user: {
    _id: '',
    name: '',
    login: '',
  },
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
        const response: { message: string; statusCode: number } = await res.json();
        throw new Error(response.message);
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
  async ({ userId, token }: { token: string; userId: string }, { rejectWithValue }) => {
    try {
      const res = await getUserById(userId, token);
      if (!res.ok) {
        const response: { message: string; statusCode: number } = await res.json();
        throw new Error(response.message);
      }
      const response: User = await res.json();

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
      state.auth = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(thunkSignUp.fulfilled, () => {
      console.log('user is created');
      toast.success('user is created');
    });

    builder.addCase(thunkSignUp.rejected, (state, action) => {
      console.log('rejected');
      if (typeof action.payload === 'string') {
        toast.error(action.payload);
      }
    });

    // sign in

    builder.addCase(thunkSignIn.fulfilled, (state) => {
      console.log('user is created');
      state.auth = true;
    });

    builder.addCase(thunkSignIn.rejected, (state, action) => {
      console.log('rejected');
      if (typeof action.payload === 'string') {
        toast.error(action.payload);
      }
    });

    builder.addCase(thunkGetUserById.fulfilled, (state, action) => {
      state.user = action.payload;
      state.auth = true;
      toast.success('User sign in successfully');
    });

    builder.addCase(thunkGetUserById.rejected, (state, action) => {
      console.log('rejected');
      state.auth = false;
      if (typeof action.payload === 'string') {
        toast.error(action.payload);
      }
    });
  },
});

export default authSlice.reducer;
export const { setUser, setAuth } = authSlice.actions;
export const authSelector = (state: RootState) => state.auth;
export const userSelector = (state: RootState) => state.auth.user;
