import { BASE } from 'api/config';

export function getTokenFromLS() {
  const store = localStorage.getItem(BASE);
  const { token } = store && typeof store === 'string' && JSON.parse(store);
  return token;
}

export function setTokenToLS(token: string) {
  localStorage.setItem(BASE, JSON.stringify({ token }));
}
