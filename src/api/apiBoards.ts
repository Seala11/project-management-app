import { BOARDS, BOARDS_SET } from 'api/config';

type newBoard = {
  title: string;
  owner: string;
  users: string[];
};

export async function fetchGetBoards(userId: string, token: string): Promise<Response> {
  const response = await fetch(`${BOARDS_SET}/${userId}`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
}

export async function fetchCreateBoards(options: newBoard, token: string): Promise<Response> {
  const response = await fetch(`${BOARDS}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(options),
  });
  return response;
}

export async function fetchDeleteBoard(boardId: string, token: string): Promise<Response> {
  const response = await fetch(`${BOARDS}/${boardId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(boardId),
  });
  return response;
}
