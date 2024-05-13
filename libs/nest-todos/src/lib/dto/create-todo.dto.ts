import { IsDate, IsString } from 'class-validator';
export class CreateTodoDto {
  @IsString()
  title!: string;

  @IsDate()
  dueDate!: Date;

  @IsString()
  assignedTo!: string;
}
