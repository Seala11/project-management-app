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

export type Signup = Omit<Auth, '_id' | 'token'>;
export type Signin = Pick<Auth, 'login' | 'password'>;

export type newBoard = {
  title: string;
  owner: string;
  users: string[];
};
