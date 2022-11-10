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
