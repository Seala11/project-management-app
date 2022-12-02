import { BOARDS, BOARDS_SET } from 'api/config';
import { newBoard } from './types';

export async function fetchGetBoards(token: string): Promise<Response> {
  const response = await fetch(`${BOARDS}`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
}

export async function fetchGetBoardsByUserId(userId: string, token: string): Promise<Response> {
  const response = await fetch(`${BOARDS_SET}/${userId}`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
}

export async function fetchCreateBoard(options: newBoard, token: string): Promise<Response> {
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

export async function fetchUpdateBoard(
  options: newBoard,
  token: string,
  boardId: string
): Promise<Response> {
  const response = await fetch(`${BOARDS}/${boardId}`, {
    method: 'PUT',
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
