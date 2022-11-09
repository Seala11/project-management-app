import { BASE } from './config';

export function getLocalStorage() {
  if (localStorage.getItem(BASE)) {
    return localStorage.getItem(BASE);
  }
  console.log('user is not authorization');
}

export function setLocalStorage(token: string) {
  localStorage.setItem(BASE, JSON.stringify({ token }));
}
