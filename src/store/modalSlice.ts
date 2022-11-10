import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'store';

export enum BtnColor {
  RED = 'red',
  BLUE = 'blue',
}

type ModalType = {
  message?: string;
  title?: string;
  input1?: string;
  input2?: string;
  color: BtnColor;
  btnText: string;
};

type ModalState = {
  modalOpen: boolean;
  modalAction: boolean;
  modal: ModalType | null;
};

export const initialState: ModalState = {
  modalOpen: false,
  modalAction: false,
  modal: null,
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
    },
    setModalAction: (state) => {
      state.modalAction = true;
    },
    removeModalAction: (state) => {
      state.modalAction = false;
    },
  },
});

export const { setModalOpen, setModalClose, setModalAction, removeModalAction } =
  modalSlice.actions;

export const modalStatusSelector = (state: RootState) => state.modal.modalOpen;
export const modalActionSelector = (state: RootState) => state.modal.modalAction;
export const modalSelector = (state: RootState) => state.modal.modal;

export default modalSlice.reducer;
