import type { Credentials, IUser } from './user.schema';

interface Token {
    token: string;
}

export type LoginDTO = Credentials;

export type LoginResponse = Token & {
    user: IUser;
};

export type RegisterDTO = Pick<IUser, 'firstName' | 'lastName' | 'picture'> &
    Credentials;

export type RegisterResponse = Token & IUser;
