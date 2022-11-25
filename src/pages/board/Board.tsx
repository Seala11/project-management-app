import React, { useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { thunkGetSingleBoard, updateColumnsOrder, updateTasksState } from 'store/boardSlice';
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
  modalColumnIdSelector,
  resetModal,
  setModalOpen,
} from 'store/modalSlice';
import { useTranslation } from 'react-i18next';
import Column from './column/Column';
import { thunkCreateTask, thunkDeleteTasks } from 'store/middleware/tasks';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';

/* ToDo
- оттестировать ошибки errors
- logOut() ??
- task component
- colors for task
*/

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

  const handleDragEndTasks = useCallback(
    (result: DropResult) => {
      const { destination, source, draggableId } = result;
      if (!destination) return;
      let newDestTasks = tasks[destination.droppableId];
      let newSourceTasks = tasks[source.droppableId];
      const getDestinationOrder = () => {
        let order = 0;
        if (newDestTasks.length !== 0) {
          order = newDestTasks[destination.index]
            ? newDestTasks[destination.index].order
            : newDestTasks.at(-1)!.order + 1;
          if (destination.droppableId !== source.droppableId) {
            order - 1;
          }
        }
        return order;
      };
      const destOrder = getDestinationOrder();
      console.log(destOrder);
      const dragSpanIndex = source.index - destination.index;
      if (destination.droppableId === source.droppableId) {
        // if drug task in the same column
        newDestTasks = newDestTasks
          .map((item, i) => {
            if (i === source.index) return { ...item, order: destOrder };
            else if (dragSpanIndex > 0 && i >= destination.index && i < source.index)
              return { ...item, order: item.order + 1 };
            else if (dragSpanIndex < 0 && i <= destination.index && i > source.index)
              return { ...item, order: item.order - 1 };
            return item;
          })
          .sort((a, b) => a.order - b.order);
      } else {
        // if drug task in another column
        // delete task in source and decrease order
        newSourceTasks = tasks[source.droppableId]
          .filter((task) => task._id !== draggableId)
          .map((item, i) => {
            if (i >= source.index) return { ...item, order: item.order - 1 };
            return item;
          });

        // add source task to dest and increase order
        newDestTasks = newDestTasks.map((item, i) => {
          if (i >= destination.index) return { ...item, order: item.order + 1 };
          return item;
        });
        newDestTasks.push({
          ...tasks[source.droppableId].filter((task) => task._id === draggableId)[0],
          order: destOrder,
        });
        newDestTasks.sort((a, b) => a.order - b.order);
      }
      dispatch(updateTasksState({ tasks: newSourceTasks, destColumnId: source.droppableId }));
      dispatch(updateTasksState({ tasks: newDestTasks, destColumnId: destination.droppableId }));
      /*  newColumns.forEach((column) => {
        dispatch(
          thunkUpdateColumn({
            boardId: `${id}`,
            columnId: column._id,
            title: column.title,
            order: column.order,
          })
        );
      });*/
    },
    [tasks, dispatch]
  );

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
        handleDragEndTasks(result);
        console.log(result);
      }
    },
    [handleDragEndColumns, handleDragEndTasks]
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
