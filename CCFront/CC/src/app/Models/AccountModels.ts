export class Account {
  userId?: number;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash?: string;
  password: string;
  role?: string;
  token?: string;
}

export class LoginInfo {
  email: string;
  password: string;
}
