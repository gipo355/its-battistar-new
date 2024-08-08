import { IsNotEmpty, IsString, IsStrongPassword, IsUrl } from 'class-validator';

import { TRegisterDTO } from '../auth/auth.entity';

export class UserDTO {
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
