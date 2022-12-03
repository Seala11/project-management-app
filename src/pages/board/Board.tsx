import React, { useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { clearBoardErrors, clearState, thunkGetSingleBoard } from 'store/boardSlice';
import styles from './board.module.scss';
import { useAppSelector, useAppDispatch } from 'store/hooks';
import {
  thunkCreateColumn,
  thunkDeleteColumn,
  thunkDragEndColumns,
} from 'store/middleware/columns';
import { setAuth, userSelector } from 'store/authSlice';
import Icon from 'components/Icon/Icon';
import {
  BtnColor,
  ModalAction,
  modalColumnIdSelector,
  resetModal,
  setModalClose,
  setModalOpen,
  setTaskModalClose,
} from 'store/modalSlice';
import { useTranslation } from 'react-i18next';
import Column from './column/Column';
import { thunkCreateTask, thunkDeleteTasks, thunkDragEndTasks } from 'store/middleware/tasks';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getMsgErrorBoard } from 'utils/func/getMsgErrorBoard';
import ROUTES from 'utils/constants/ROUTES';

const Board = () => {
  const { title, error, columns, tasks } = useAppSelector((state) => state.board);
  const { modalAction, userInputTitle, userInputDescr, taskId, taskOrder } = useAppSelector(
    (state) => state.modal
  );
  const dispatch = useAppDispatch();
  const { id } = useParams<'id'>();
  const navigate = useNavigate();
  const modalColumnId = useAppSelector(modalColumnIdSelector);
  const { t } = useTranslation();
  const user = useAppSelector(userSelector);

  useEffect(() => {
    dispatch(thunkGetSingleBoard(`${id}`));
    return () => {
      dispatch(clearState());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (error) {
      const [code, message] = error.split('/');
      let errorMessageCode = code;
      if (code) {
        if (code === '403') {
          dispatch(setAuth(false));
          dispatch(setTaskModalClose());
          dispatch(setModalClose());
        }
        if (message === 'Board was not founded!') {
          navigate(ROUTES.boards, { replace: true });
          errorMessageCode = code + '_BOARD';
        }
        toast.error(t(getMsgErrorBoard(errorMessageCode)));
        dispatch(clearBoardErrors());
      }
    }
    return () => {
      dispatch(clearBoardErrors());
    };
  }, [error, dispatch, navigate, t]);

  useEffect(() => {
    if (modalAction === ModalAction.COLUMN_DELETE) {
      dispatch(thunkDeleteColumn({ boardId: `${id}`, columnId: modalColumnId }));
      dispatch(resetModal());
    }

    if (modalAction === ModalAction.TASK_CREATE) {
      const newDescr = JSON.stringify({ description: userInputDescr, color: '' });
      dispatch(
        thunkCreateTask({
          boardId: `${id}`,
          columnId: modalColumnId,
          title: userInputTitle,
          description: newDescr,
          order: taskOrder,
          userId: user._id,
        })
      );
      dispatch(resetModal());
    }

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

    if (modalAction === ModalAction.TASK_DELETE && taskId) {
      dispatch(
        thunkDeleteTasks({
          boardId: `${id}`,
          columnId: modalColumnId,
          taskId: taskId._id,
        })
      );
      dispatch(resetModal());
    }
  }, [
    modalAction,
    columns,
    dispatch,
    id,
    userInputTitle,
    user,
    userInputDescr,
    modalColumnId,
    taskId,
    taskOrder,
  ]);

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

  const onDragEnd = useCallback(
    async (result: DropResult) => {
      const { destination, source, type } = result;
      if (
        !destination ||
        (destination.index === source.index && destination.droppableId === source.droppableId)
      ) {
        return;
      }
      if (type === 'COLUMN') {
        await dispatch(thunkDragEndColumns({ result, columns, id }));
      } else {
        dispatch(thunkDragEndTasks({ result, tasks }));
      }
    },
    [dispatch, id, columns, tasks]
  );
  return (
    <>
      <section className={styles.wrapper}>
        <div className={styles.mainContent}>
          <h2 className={styles.title}>
            <>
              {title.title}{' '}
              {title.descr !== '' && <span className={styles.description}>({title.descr})</span>}
            </>
          </h2>
          <div className={styles.columnsWrapper}>
            {columns.length > 0 && (
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable
                  droppableId="boardId"
                  direction={'horizontal'}
                  mode={'standard'}
                  type="COLUMN"
                >
                  {(provided) => (
                    <ul
                      className={styles.columnsList}
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {[...columns].map((column, index) => (
                        <Column key={column._id} columnData={column} index={index} />
                      ))}
                      {provided.placeholder}
                    </ul>
                  )}
                </Droppable>
              </DragDropContext>
            )}
            <div className={`${styles.columnButton} ${styles.addButton}`} onClick={createColumn}>
              {t('BOARD.CREATE_COLUMN_BUTTON')}
              <Icon color="#0047FF" size={100} icon="add" className={styles.icon} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Board;
