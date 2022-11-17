import { TaskType } from 'store/boardSlice';
import { BoardResponseType } from 'store/boardsSlice';

export const parseBoardObj = (board: BoardResponseType) => {
  return {
    _id: board._id,
    owner: board.owner,
    title: JSON.parse(board.title),
    users: board.users,
  };
};

export const parseTaskObj = (task: TaskType) => {
  return {
    _id: task._id,
    title: task.title,
    order: task.order,
    boardId: task.boardId,
    description: JSON.parse(task.description),
    userId: task.userId,
    users: task.users,
    files: task.files,
  };
};
