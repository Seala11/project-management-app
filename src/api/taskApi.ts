import { BOARDS } from 'api/config';

export async function fetchGetTasks(boardId: string, columnId: string, token: string) {
  const response = await fetch(`${BOARDS}/${boardId}/columns/${columnId}/tasks`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
}

export async function fetchCreateTask(
  boardId: string,
  columnId: string,
  userId: string,
  title: string,
  description: string,
  order: number,
  token: string
) {
  const users: string[] = [];
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

export async function fetchDeleteTask(
  boardId: string,
  columnId: string,
  taskId: string,
  token: string
) {
  const response = await fetch(`${BOARDS}/${boardId}/columns/${columnId}/tasks/${taskId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
}

type UpdateTaskRequestType = {
  _id: string;
  boardId: string;
  columnId: string;
  userId: string;
  title: string;
  description: string;
  order: number;
  users: string[];
};

export async function fetchUpdateTask(data: UpdateTaskRequestType, token: string) {
  const { _id, boardId, columnId, userId, title, description, order, users } = data;
  const response = await fetch(`${BOARDS}/${boardId}/columns/${columnId}/tasks/${_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, order, description, columnId, userId, users }),
  });
  return response;
}
