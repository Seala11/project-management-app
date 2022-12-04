import { USERS } from 'api/config';
import { User } from './types';

export async function getAllUsers(token: string) {
  const res = await fetch(`${USERS}`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
}

export async function getUserById(userId: string, token: string) {
  const res = await fetch(`${USERS}/${userId}`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
}

export async function updateUser(user: User, token: string) {
  const { _id, name, login, password } = user;
  const res = await fetch(`${USERS}/${_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, login, password }),
  });
  return res;
}

export async function deleteUser(userId: string, token: string) {
  const res = await fetch(`${USERS}/${userId}`, {
    method: 'DELETE',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
}
