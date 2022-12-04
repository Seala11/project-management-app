import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'store';
import { TaskParsedType } from './boardSlice';
import { thunkGetAllUsers, UserType } from './middleware/users';

export enum BtnColor {
  RED = 'red',
  BLUE = 'blue',
}

export enum ModalAction {
  BOARD_CREATE = 'create new board',
  BOARD_DELETE = 'delete board',
  BOARD_CHANGE = 'change board',
  COLUMN_CREATE = 'create new column',
  COLUMN_DELETE = 'delete column',
  TASK_CREATE = 'create new task',
  TASK_DELETE = 'delete task',
  USER_DELETE = 'delete user account',
  EDIT_USER_PROFILE = 'edit user profile',
  SAVE_USER_PROFILE = 'save user profile',
  DELETE_USER_PROFILE = 'delete user profile',
}

type ModalType = {
  message?: string;
  title?: string;
  inputTitle?: string;
  inputDescr?: string;
  color: BtnColor;
  btnText: string;
  action: ModalAction;
  defaultVals?: {
    title: string;
    description: string;
  };
};

type ModalState = {
  modalOpen: boolean;
  modalAction: ModalAction | null | undefined;
  modal: ModalType | null;
  userInputTitle: string;
  userInputDescr: string;
  taskOpen: boolean;
  taskDeleteConfirm: boolean;
  columnId: string;
  taskId: TaskParsedType | null;
  taskOrder: number;
  users: UserType[] | null;
  usersAssigned: (UserType | undefined)[];
  pending: boolean;
  change: boolean;
};

export const initialState: ModalState = {
  modalOpen: false,
  modalAction: null,
  modal: null,
  userInputTitle: '',
  userInputDescr: '',
  taskOpen: false,
  taskDeleteConfirm: false,
  columnId: '',
  taskId: null,
  taskOrder: 0,
  users: null,
  usersAssigned: [],
  pending: false,
  change: false,
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setModalOpen: (state, action: PayloadAction<ModalType>) => {
      state.modalOpen = true;
      state.modal = action.payload;
    },
    setModalClose: (state) => {
      state.modalOpen = false;
      state.modal = null;
      state.taskOpen = false;
      state.taskDeleteConfirm = false;
      state.change = false;
    },
    setModalAction: (state, action: PayloadAction<ModalAction | undefined>) => {
      state.modalAction = action.payload;
    },
    resetModal: (state) => {
      state.modalAction = null;
    },
    setInputTitle: (state, action: PayloadAction<string>) => {
      state.userInputTitle = action.payload;
    },
    setInputDescr: (state, action: PayloadAction<string>) => {
      state.userInputDescr = action.payload;
    },
    setChangeBoard: (state, action: PayloadAction<boolean>) => {
      state.change = action.payload;
    },

    //task
    setTaskModalOpen: (state) => {
      state.taskOpen = true;
      state.modalOpen = true;
      state.taskDeleteConfirm = false;
    },
    setTaskModalClose: (state) => {
      state.taskOpen = false;
    },
    setTaskId: (state, action: PayloadAction<TaskParsedType | null>) => {
      state.taskId = action.payload;
    },
    setTaskOrder: (state, action: PayloadAction<number>) => {
      state.taskOrder = action.payload;
    },
    setModalColumnId: (state, action: PayloadAction<string>) => {
      state.columnId = action.payload;
    },
    setTaskDeleteConfirm: (state, action: PayloadAction<boolean>) => {
      state.taskDeleteConfirm = action.payload;
    },
    setUsersAssigned: (state, action: PayloadAction<(UserType | undefined)[]>) => {
      state.usersAssigned = action.payload;
    },
    removeUserAssigned: (state, action: PayloadAction<string>) => {
      const newState = state.usersAssigned.filter((member) => member?._id !== action.payload);
      state.usersAssigned = newState;
    },
    addUserAssigned: (state, action: PayloadAction<string>) => {
      if (state.users) {
        const userToAdd = state.users.find((members) => members._id === action.payload);
        state.usersAssigned = [...state.usersAssigned, userToAdd];
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(thunkGetAllUsers.fulfilled, (state, action) => {
      state.users = action.payload;
    });
  },
});

export const {
  setModalOpen,
  setModalClose,
  setModalAction,
  resetModal,
  setInputTitle,
  setInputDescr,
  setTaskModalOpen,
  setTaskModalClose,
  setTaskId,
  setTaskOrder,
  setModalColumnId,
  setTaskDeleteConfirm,
  setUsersAssigned,
  removeUserAssigned,
  addUserAssigned,
  setChangeBoard,
} = modalSlice.actions;

export const modalStatusSelector = (state: RootState) => state.modal.modalOpen;
export const taskStatusSelector = (state: RootState) => state.modal.taskOpen;
export const modalActionSelector = (state: RootState) => state.modal.modalAction;
export const modalSelector = (state: RootState) => state.modal.modal;
export const userTitleSelector = (state: RootState) => state.modal.userInputTitle;
export const userDescriptionSelector = (state: RootState) => state.modal.userInputDescr;
export const taskIdSelector = (state: RootState) => state.modal.taskId;
export const modalColumnIdSelector = (state: RootState) => state.modal.columnId;
export const stateModalSelector = (state: RootState) => state.modal;
export const usersSelector = (state: RootState) => state.modal.users;
export const taskDeleteConfirmSelector = (state: RootState) => state.modal.taskDeleteConfirm;
export const selectAssignedUsers = (state: RootState) => state.modal.usersAssigned;
export const selectModalPending = (state: RootState) => state.modal.pending;
export const selectChangeBoard = (state: RootState) => state.modal.change;

export default modalSlice.reducer;
