import { BASE } from './config';
import { User } from './types';

export function getTokenFromLS() {
  const store = localStorage.getItem(BASE);
  const res = store && typeof store === 'string' && JSON.parse(store);
  return res?.token;
}

export function setTokenToLS(token: string) {
  localStorage.setItem(BASE, JSON.stringify({ token }));
}

export function setUserToLS(user: Omit<User, 'password'>) {
  localStorage.setItem(`user${BASE}`, JSON.stringify(user));
}

export function getUserFromLS() {
  const user = localStorage.getItem(`user${BASE}`);
  const res: Omit<User, 'password'> = user && JSON.parse(user);
  return res;
}

export function removeTokenFromLS() {
  localStorage.removeItem(BASE);
}
