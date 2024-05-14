import { IsEmail, IsString } from 'class-validator';

export class LoginNestAuthDto {
  @IsEmail()
  email!: string;
  @IsString()
  password!: string;
}
