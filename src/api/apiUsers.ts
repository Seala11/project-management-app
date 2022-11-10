import { USERS } from 'api/config';

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
