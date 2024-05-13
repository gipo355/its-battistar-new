import { IsDate, IsString, MinDate } from 'class-validator';
import { Transform } from 'class-transformer';
export class CreateTodoDto {
  @IsString()
  title?: string;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  @MinDate(new Date())
  dueDate?: Date;

  @IsString()
  assignedTo?: string;
}
