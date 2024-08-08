import type { Credentials, IUser } from '../users/user.entity';

interface Token {
    token: string;
}

export type LoginResponse = Token & {
    user: IUser;
};

export type TRegisterDTO = Pick<IUser, 'firstName' | 'lastName' | 'picture'> &
    Credentials;

export type RegisterResponse = Token & IUser;
