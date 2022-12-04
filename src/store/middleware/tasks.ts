import { createAsyncThunk } from '@reduxjs/toolkit';
import { TASK_SET } from 'api/config';
import { fetchCreateTask, fetchDeleteTask, fetchGetTasks, fetchUpdateTask } from 'api/taskApi';
import { DropResult } from 'react-beautiful-dnd';
import { RootState } from 'store';
import { setTaskId } from 'store/modalSlice';
import { getErrorMessage } from 'utils/func/handleError';
import { getTokenFromLS } from 'utils/func/localStorage';
import { TaskObjectType, TaskParsedType, TaskType, updateTasksState } from '../boardSlice';

export type TaskResponseType = {
  column: string;
  tasks: TaskType[];
};

export type TaskRequestDataType = {
  boardId: string;
  columnId: string;
};

export const thunkGetAllTasks = createAsyncThunk<
  TaskResponseType | boolean,
  TaskRequestDataType,
  { rejectValue: string }
>('task/getAllTasks', async ({ boardId, columnId }, { getState, rejectWithValue }) => {
  const token = getTokenFromLS();
  const state = getState() as RootState;
  const error = state.board.error;
  if (error) {
    return false;
  }
  try {
    const response = await fetchGetTasks(boardId, columnId, token);
    if (!response.ok) {
      const resp = await response.json();
      throw new Error(`${resp?.statusCode}/${resp.message}`);
    }
    const data: TaskType[] = await response.json();
    return { column: columnId, tasks: data.sort((a, b) => a.order - b.order) };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

// create Task
type CreateTaskRequestType = {
  boardId: string;
  columnId: string;
  userId: string;
  title: string;
  description: string;
  order: number;
};

type CreateTaskResponseType = {
  column: string;
  task: TaskType;
};

export const thunkCreateTask = createAsyncThunk<
  CreateTaskResponseType,
  CreateTaskRequestType,
  { rejectValue: string }
>(
  'task/createTask',
  async ({ boardId, columnId, title, description, order, userId }, { rejectWithValue }) => {
    const token = getTokenFromLS();
    try {
      const response = await fetchCreateTask(
        boardId,
        columnId,
        userId,
        title,
        description,
        order,
        token
      );

      if (!response.ok) {
        const resp = await response.json();
        throw new Error(`${resp?.statusCode}/${resp.message}`);
      }
      const task: TaskType = await response.json();
      return { column: columnId, task: task };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// delete Task

type DeleteTaskRequestType = {
  boardId: string;
  columnId: string;
  taskId: string;
};

export type DeleteTaskResponseType = {
  column: string;
  task: TaskType;
};

export const thunkDeleteTasks = createAsyncThunk<
  DeleteTaskResponseType,
  DeleteTaskRequestType,
  { rejectValue: string }
>('task/deleteTask', async ({ boardId, columnId, taskId }, { rejectWithValue }) => {
  const token = getTokenFromLS();
  try {
    const response = await fetchDeleteTask(boardId, columnId, taskId, token);
    if (!response.ok) {
      const resp = await response.json();
      throw new Error(`${resp?.statusCode}/${resp.message}`);
    }
    const task: TaskType = await response.json();
    return { column: columnId, task: task };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

//update task

type UpdateTaskRequestType = {
  _id: string;
  columnId: string;
  newData: { key: string; value: string | string[] };
};

export type UpdateTaskResponseType = {
  column: string;
  task: TaskType;
};

export enum TaskDataKeys {
  TITLE = 'title',
  DESCR = 'description',
  COLOR = 'color',
  USERS = 'users',
}

export const thunkUpdateTaskInfo = createAsyncThunk<
  UpdateTaskResponseType,
  UpdateTaskRequestType,
  { rejectValue: string }
>(
  'board/updateTask',
  async (data, { rejectWithValue, getState, dispatch }) => {
    const { columnId, _id, newData } = data;
    const token = getTokenFromLS();

    const state = getState() as RootState;
    const tasks = state.board.tasks[columnId];
    const task = tasks.find((task) => task._id === _id);

    if (!task) {
      throw new Error(`${404}/${'No such element exist'}`);
    }

    const newTile =
      newData.key === TaskDataKeys.TITLE && typeof newData.value === 'string'
        ? newData.value
        : task?.title;

    const newDescr =
      newData.key === TaskDataKeys.DESCR && typeof newData.value === 'string'
        ? newData.value
        : task?.description.description;

    const newColor =
      newData.key === TaskDataKeys.COLOR && typeof newData.value === 'string'
        ? newData.value
        : task?.description.color;

    const newUsers =
      newData.key === TaskDataKeys.USERS && typeof newData.value !== 'string'
        ? newData.value
        : task?.users;

    const newTaskData = {
      _id: task?._id,
      boardId: task?.boardId,
      columnId: columnId,
      userId: task?.userId,
      title: newTile,
      description: JSON.stringify({
        description: newDescr,
        color: newColor,
      }),
      order: task?.order,
      users: newUsers,
    };

    try {
      const response = await fetchUpdateTask(newTaskData, token);

      if (!response.ok) {
        const resp = await response.json();
        throw new Error(`${resp?.statusCode}/${resp.message}`);
      }

      const newTaskIdData = {
        _id: task?._id,
        boardId: task?.boardId,
        columnId: columnId,
        userId: task?.userId,
        title: newTile,
        description: {
          description: newDescr,
          color: newColor,
        },
        order: task?.order,
        users: newUsers,
      };
      dispatch(setTaskId(newTaskIdData));

      const updatedTask = await response.json();
      return { column: columnId, task: updatedTask };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
  {
    condition: (_, { getState }) => {
      const state = getState() as RootState;
      const error = state.board.error;
      if (error) {
        return false;
      }
    },
  }
);

type TaskSetType = {
  _id: string;
  order: number;
  columnId: string;
};

export const thunkUpdateTaskOrder = createAsyncThunk<
  undefined | boolean,
  TaskSetType[],
  { rejectValue: string }
>('board/updateTaskOnServer', async (data, { rejectWithValue }) => {
  const token = getTokenFromLS();
  try {
    const response = await fetch(`${TASK_SET}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const resp = await response.json();
      throw new Error(`${resp?.statusCode}/${resp.message}`);
    }
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

const getSetOfTasks = (tasks: TaskParsedType[], columnId: string) => {
  return tasks.map((task) => {
    return { _id: task._id, order: task.order, columnId: columnId };
  });
};

type DragEndTasksEntires = {
  result: DropResult;
  tasks: TaskObjectType;
};

export const thunkDragEndTasks = createAsyncThunk<void, DragEndTasksEntires>(
  'column/handleDragEndTasks',
  async (data: DragEndTasksEntires, { dispatch }) => {
    const { result, tasks } = data;
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
    const dragSpanIndex = source.index - destination.index;
    const draggableTask = {
      ...newSourceTasks.filter((task) => task._id === draggableId)[0],
      order: destOrder,
    };
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
      newSourceTasks = newSourceTasks
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

    try {
      await dispatch(
        thunkUpdateTaskOrder([
          {
            _id: draggableTask._id,
            order: draggableTask.order,
            columnId: destination.droppableId,
          },
        ])
      ).unwrap();
      if (newSourceTasks.length) {
        await dispatch(
          thunkUpdateTaskOrder(getSetOfTasks(newSourceTasks, source.droppableId))
        ).unwrap();
      }
      await dispatch(
        thunkUpdateTaskOrder(getSetOfTasks(newDestTasks, destination.droppableId))
      ).unwrap();
    } catch (error) {
      dispatch(
        updateTasksState({ tasks: tasks[source.droppableId], destColumnId: source.droppableId })
      );
      dispatch(
        updateTasksState({
          tasks: tasks[destination.droppableId],
          destColumnId: destination.droppableId,
        })
      );
      console.error(`Error: ${error}, return state!`);
    }
  }
);
