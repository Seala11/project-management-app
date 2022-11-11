/* eslint-disable @typescript-eslint/no-unused-vars */
import { BASE, AUTH, USERS } from 'api/config';
import { Signup, Signin } from './types';

const isEnglish = true;

const localization = {
  error: isEnglish ? 'what went wrong' : 'что то пошло не так',
};

export async function fetchSignIn(options: Signin): Promise<Response> {
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

export async function fetchSignUp(options: Signup): Promise<Response> {
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
