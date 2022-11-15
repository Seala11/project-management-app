import { BASE } from './config';
import { User } from './types';

export function getTokenFromLS() {
  const store = localStorage.getItem(BASE);
  const { token } = store && typeof store === 'string' && JSON.parse(store);
  return token;
}

export function setTokenToLS(token: string) {
  localStorage.setItem(BASE, JSON.stringify({ token }));
}

export function setIsLogged(value: boolean) {
  localStorage.setItem(`isLogged${BASE}`, JSON.stringify({ value }));
}

export function getIsLogged() {
  const store = localStorage.getItem(`isLogged${BASE}`);
  const res: { value: boolean } = store && typeof store === 'string' && JSON.parse(store);
  return res?.value || false;
}

export function setUserToLS(user: Omit<User, 'password'>) {
  localStorage.setItem(`user${BASE}`, JSON.stringify(user));
}

export function getUserFromLS() {
  const user = localStorage.getItem(`user${BASE}`);
  const res: Omit<User, 'password'> = user && JSON.parse(user);
  return res;
}
