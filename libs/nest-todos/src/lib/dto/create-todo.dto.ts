import { Transform } from 'class-transformer';
import { IsDate, IsMongoId, IsString, MinDate } from 'class-validator';
export class CreateTodoDto {
  @IsString()
  title?: string;

  @Transform(({ value }) => {
    if (!value) {
      return undefined;
    }
    if (typeof value === 'string') {
      return new Date(value);
    }
    if (typeof value === 'number') {
      return new Date(value);
    }
    if (value instanceof Date) {
      return value;
    }
    return;
    // new Date(value);
  })
  @IsDate()
  @MinDate(new Date())
  dueDate?: Date;

  @IsMongoId()
  assignedTo?: string;
}
