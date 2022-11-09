import { BASE } from 'api/config';

const isEnglish = true;

const localization = {
  error: isEnglish ? 'what went wrong' : 'что то пошло не так',
};

type Auth = {
  name: string;
  login: string;
  password: string;
  _id: string;
  token: string;
};

export async function fetchSignIn(options: Pick<Auth, 'login' | 'password'>): Promise<Response> {
  const response = await fetch(`${BASE}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify(options),
  });
  return response;
}

export async function fetchSignUp(options: Omit<Auth, '_id' | 'token'>): Promise<Response> {
  const response = await fetch(`${BASE}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify(options),
  });
  return response;
}
