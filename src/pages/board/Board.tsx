import React, { useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { thunkGetSingleBoard, updateColumnsOrder } from 'store/boardSlice';
import styles from './board.module.scss';
import { useAppSelector, useAppDispatch } from 'store/hooks';
import ROUTES from 'utils/constants/ROUTES';
import {
  thunkGetAllColumns,
  thunkCreateColumn,
  thunkDeleteColumn,
  thunkUpdateColumn,
} from 'store/middleware/columns';
import { setAuth, userSelector } from 'store/authSlice';
import Icon from 'components/Icon/Icon';
import {
  BtnColor,
  ModalAction,
  modalActionSelector,
  modalColumnIdSelector,
  resetModal,
  setModalOpen,
  taskIdSelector,
  userDescriptionSelector,
  userTitleSelector,
} from 'store/modalSlice';
import { useTranslation } from 'react-i18next';
import Column from './column/Column';
import { thunkCreateTasks, thunkDeleteTasks } from 'store/middleware/tasks';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';

/* ToDo
- оттестировать ошибки errors
- logOut() ??
- task component
- colors for task
*/

const Board = () => {
  const { title, error, columns } = useAppSelector((state) => state.board);
  const dispatch = useAppDispatch();
  const { id } = useParams<'id'>();
  const navigate = useNavigate();
  const modalColumnId = useAppSelector(modalColumnIdSelector);
  const { t } = useTranslation();

  // MODAL ACTIONS AND HANDLERS
  const modalAction = useAppSelector(modalActionSelector);
  const userInputTitle = useAppSelector(userTitleSelector);
  const userInputDescr = useAppSelector(userDescriptionSelector);
  const user = useAppSelector(userSelector);
  const selectedTask = useAppSelector(taskIdSelector);

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
    if (modalAction === ModalAction.COLUMN_DELETE) {
      dispatch(thunkDeleteColumn({ boardId: `${id}`, columnId: modalColumnId }));
      dispatch(resetModal());
    }

    if (modalAction === ModalAction.TASK_CREATE) {
      const newDescr = JSON.stringify({ description: userInputDescr, color: '' });
      dispatch(
        thunkCreateTasks({
          boardId: `${id}`,
          columnId: modalColumnId,
          title: userInputTitle,
          description: newDescr,
          order: 0,
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

    if (modalAction === ModalAction.TASK_DELETE && selectedTask) {
      dispatch(
        thunkDeleteTasks({
          boardId: `${id}`,
          columnId: modalColumnId,
          taskId: selectedTask._id,
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
    selectedTask,
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

  const handleDragEndColumns = useCallback(
    (result: DropResult) => {
      const { destination, source } = result;
      if (!destination) return;
      const destinationOrder = columns[destination.index].order;
      const dragSpanIndex = source.index - destination.index;
      const newColumns = columns
        .map((item, i) => {
          if (i === source.index) return { ...item, order: destinationOrder };
          else if (dragSpanIndex > 0 && i >= destination.index && i < source.index)
            return { ...item, order: item.order + 1 };
          else if (dragSpanIndex < 0 && i <= destination.index && i > source.index)
            return { ...item, order: item.order - 1 };
          return item;
        })
        .sort((a, b) => a.order - b.order);

      dispatch(updateColumnsOrder(newColumns));
      newColumns.forEach((column) => {
        dispatch(
          thunkUpdateColumn({
            boardId: `${id}`,
            columnId: column._id,
            title: column.title,
            order: column.order,
          })
        );
      });
    },
    [columns, dispatch, id]
  );

  /* const onBeforeCapture = useCallback(() => {

  }, []);
  const onBeforeDragStart = useCallback(() => {

  }, []);
  const onDragStart = useCallback(() => {

  }, []);
  const onDragUpdate = useCallback(() => {

  }, []);*/

  const onDragEnd = useCallback(
    (result: DropResult) => {
      const { destination, source } = result;
      if (
        !destination ||
        (destination.index === source.index && destination.droppableId === source.droppableId)
      ) {
        return;
      }

      if (destination.droppableId === 'boardId') {
        handleDragEndColumns(result);
      } else {
        console.log(result);
      }
    },
    [handleDragEndColumns]
  );
  return (
    <>
      <section className={styles.wrapper}>
        <div className={styles.mainContent}>
          <h2 className={styles.title}>
            {title.title !== '' && (
              <>
                {title.title} <span className={styles.description}>({title.descr})</span>
              </>
            )}
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
