import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'store';

export enum BtnColor {
  RED = 'red',
  BLUE = 'blue',
}

export enum ModalAction {
  BOARD_CREATE = 'create new board',
  BOARD_DELETE = 'delete board',
  COLUMN_CREATE = 'create new column',
  COLUMN_DELETE = 'delete column',
  TASK_CREATE = 'create new task',
  TASK_DELETE = 'delete task',
  USER_DELETE = 'delete user account',
}

type ModalType = {
  message?: string;
  title?: string;
  inputTitle?: string;
  inputDescr?: string;
  color: BtnColor;
  btnText: string;
  action: ModalAction;
};

type ModalState = {
  modalOpen: boolean;
  modalAction: ModalAction | null | undefined;
  modal: ModalType | null;
  userInputTitle: string;
  userInputDescr: string;
  taskOpen: boolean;
};

export const initialState: ModalState = {
  modalOpen: false,
  modalAction: null,
  modal: null,
  userInputTitle: '',
  userInputDescr: '',
  taskOpen: false,
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

    //task
    setTaskModalOpen: (state) => {
      state.modalOpen = true;
      state.taskOpen = true;
    },
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
} = modalSlice.actions;

export const modalStatusSelector = (state: RootState) => state.modal.modalOpen;
export const taskStatusSelector = (state: RootState) => state.modal.taskOpen;
export const modalActionSelector = (state: RootState) => state.modal.modalAction;
export const modalSelector = (state: RootState) => state.modal.modal;
export const userTitleSelector = (state: RootState) => state.modal.userInputTitle;
export const userDescriptionSelector = (state: RootState) => state.modal.userInputDescr;

export default modalSlice.reducer;
