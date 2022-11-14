import { BoardResponseType } from 'store/boardsSlice';

export const parseBoardObj = (board: BoardResponseType) => {
  return {
    _id: board._id,
    owner: board.owner,
    title: JSON.parse(board.title),
    users: board.users,
  };
};
