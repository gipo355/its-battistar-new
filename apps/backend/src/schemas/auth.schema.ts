import { IsNotEmpty, IsString, IsStrongPassword, IsUrl } from 'class-validator';

import type { Credentials, IUser } from './user.schema';

interface Token {
    token: string;
}

export type LoginDTO = Credentials;

export type LoginResponse = Token & {
    user: IUser;
};

export type TRegisterDTO = Pick<IUser, 'firstName' | 'lastName' | 'picture'> &
    Credentials;

export type RegisterResponse = Token & IUser;

export class RegisterDTO {
    @IsString()
    @IsNotEmpty()
    firstName?: string;

    @IsString()
    @IsNotEmpty()
    lastName?: string;

    @IsString()
    @IsNotEmpty()
    @IsUrl()
    picture?: string;

    @IsString()
    @IsNotEmpty()
    username?: string;

    @IsStrongPassword(
        {},
        {
            message:
                'A user password must have more than 8 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character (between !@#$%^&*)',
        }
    )
    password?: string;

    constructor({
        firstName,
        lastName,
        picture,
        username,
        password,
    }: Partial<TRegisterDTO>) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.picture = picture;
        this.username = username;
        this.password = password;
    }
}
