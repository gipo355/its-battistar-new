import { IsEmail, IsStrongPassword } from 'class-validator';

export class RegisterNestAuthDto {
  @IsEmail()
  email!: string;
  @IsStrongPassword()
  password!: string;
}
