import { BASE, AUTH, USERS } from 'api/config';
import { getLocalStorage } from './localStorage';

const isEnglish = true;

const localization = {
  error: isEnglish ? 'what went wrong' : 'что то пошло не так',
};

export type User = {
  _id: string;
  name: string;
  login: string;
  password: string;
};

type Auth = {
  name: string;
  login: string;
  password: string;
  _id: string;
  token: string;
};

export type SighUp = Omit<Auth, '_id' | 'token'>;
export type SignIn = Pick<Auth, 'login' | 'password'>;

export async function fetchSignIn(options: SignIn): Promise<Response> {
  const response = await fetch(`${AUTH}/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify(options),
  });
  return response;
}

export async function fetchSignUp(options: SighUp): Promise<Response> {
  const response = await fetch(`${AUTH}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify(options),
  });
  return response;
}

export async function getAllUsers() {
  const token = getLocalStorage();

  if (token) {
    const res = await fetch(`${USERS}`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  }
}
