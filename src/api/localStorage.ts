import { BASE } from './config';

export function getLocalStorage() {
  if (localStorage.getItem(BASE)) {
    const { token } = JSON.parse(localStorage.getItem(BASE) as string);
    console.log(token);

    return token;
  }
  console.log('user is not authorization');
}

export function setLocalStorage(token: string) {
  localStorage.setItem(BASE, JSON.stringify({ token }));
}
