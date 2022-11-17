import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { thunkGetSingleBoard } from 'store/boardSlice';
import styles from './board.module.scss';
import { useAppSelector, useAppDispatch } from 'store/hooks';
import ROUTES from 'utils/constants/ROUTES';
import { thunkGetAllColumns, thunkCreateColumn } from 'store/middleware/columns';
import { setAuth } from 'store/authSlice';
import Icon from 'components/Icon/Icon';
import {
  BtnColor,
  ModalAction,
  modalActionSelector,
  resetModal,
  setModalOpen,
  userTitleSelector,
} from 'store/modalSlice';
import { useTranslation } from 'react-i18next';
import Column from './column/Column';

/* ToDo
- оттестировать ошибки errors
- logOut() ??
- column component
- task component
*/

const Board = () => {
  const { title, error, columns } = useAppSelector((state) => state.board);
  const dispatch = useAppDispatch();
  const { id } = useParams<'id'>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // MODAL ACTIONS AND HANDLERS
  const modalAction = useAppSelector(modalActionSelector);
  const userInputTitle = useAppSelector(userTitleSelector);

  useEffect(() => {
    dispatch(thunkGetSingleBoard(`${id}`));
    dispatch(thunkGetAllColumns(`${id}`));
    console.log('useEffect');
  }, [id, dispatch]);

  useEffect(() => {
    if (error) {
      const [code] = error.split('/');
      if (code) {
        if (+code === 401) {
          dispatch(setAuth(false));
          navigate(ROUTES.signIn, { replace: true });
        } else {
          navigate(ROUTES.notFound, { replace: true });
        }
      }
    }
  }, [error, dispatch, navigate]);

  useEffect(() => {
    if (modalAction === ModalAction.COLUMN_CREATE) {
      dispatch(
        thunkCreateColumn({
          boardId: `${id}`,
          title: userInputTitle,
          order: columns.length ? columns[columns.length - 1].order + 1 : 0,
        })
      );

      dispatch(resetModal());
    }

    // после того как ты разнесешь на компоненты - зависисмоти почищу, можно рефами вынести
  }, [columns, dispatch, id, modalAction, userInputTitle]);

  const createColumn = () => {
    dispatch(
      setModalOpen({
        title: `${t('BOARD.CREATE_COLUMN_TITLE')}`,
        inputTitle: `${t('MODAL.TITLE')}`,
        color: BtnColor.BLUE,
        btnText: `${t('MODAL.CREATE')}`,
        action: ModalAction.COLUMN_CREATE,
      })
    );
  };

  return (
    <>
      <section className={styles.wrapper}>
        <div className={styles.mainContent}>
          <h2 className={styles.title}>
            {title.title} <span className={styles.description}>({title.descr})</span>
          </h2>
          <ul className={styles.columnsList}>
            {[...columns]
              .sort((a, b) => a.order - b.order)
              .map((column) => (
                <Column key={column._id} columnData={column} />
              ))}
            <li className={`${styles.columnButton} ${styles.addButton}`} onClick={createColumn}>
              {t('BOARD.CREATE_COLUMN_BUTTON')}
              <Icon color="#0047FF" size={100} icon="add" className={styles.icon} />
            </li>
          </ul>
        </div>
      </section>
    </>
  );
};

export default Board;
