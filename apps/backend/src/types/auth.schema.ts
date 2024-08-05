import type { Credentials, User } from './user.schema';

interface Token {
    token: string;
}

export type LoginDTO = Credentials;

export type LoginResponse = Token & {
    user: User;
};

export type RegisterDTO = Pick<User, 'firstName' | 'lastName' | 'picture'> &
    Credentials;

export type RegisterResponse = Token & User;
