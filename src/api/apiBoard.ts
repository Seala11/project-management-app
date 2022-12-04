import { BOARDS } from 'api/config';

export async function fetchGetBoard(boardId: string, token: string): Promise<Response> {
  const response = await fetch(`${BOARDS}/${boardId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
}

export async function fetchGetColumns(boardId: string, token: string): Promise<Response> {
  const response = await fetch(`${BOARDS}/${boardId}/columns`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
}

export async function fetchGetColumn(
  boardId: string,
  columnId: string,
  token: string
): Promise<Response> {
  const response = await fetch(`${BOARDS}/${boardId}/columns/${columnId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
}
