import { BOARDS } from 'api/config';

export async function fetchCreateTask(
  boardId: string,
  columnId: string,
  userId: string,
  title: string,
  description: string,
  order: number,
  token: string
) {
  const users = [userId];
  const response = await fetch(`${BOARDS}/${boardId}/columns/${columnId}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, order, description, userId, users }),
  });
  return response;
}
