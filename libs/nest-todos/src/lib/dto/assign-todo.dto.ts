import { IsString } from 'class-validator';

export class AssignTodoDto {
  @IsString()
  userId!: string;
}
