import { BASE } from 'api/config';

export function getTokenFromLS() {
  const store = localStorage.getItem(BASE);
  const res = store && typeof store === 'string' && JSON.parse(store);
  return res?.token;
}

export function setTokenToLS(token: string) {
  localStorage.setItem(BASE, JSON.stringify({ token }));
}

export function removeTokenFromLS() {
  localStorage.removeItem(BASE);
}
