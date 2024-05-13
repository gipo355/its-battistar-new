import { IsAscii, isAscii, isBoolean } from 'class-validator';
import mongoose from 'mongoose';

export class Todo {
  id!: number;
  title!: string;
  dueDate!: Date;
  assignedTo!: string;
  completed!: boolean;
  expired!: boolean;
  createdBy!: string | mongoose.Schema.Types.ObjectId;
}

const todoSchema = new mongoose.Schema<Todo>({
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
    validate: isAscii,
  },
  dueDate: {
    type: Date,
  },
  assignedTo: {
    type: String,
    required: true,
    validate: IsAscii,
  },
  completed: {
    type: Boolean,
    required: true,
    validate: isBoolean,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

todoSchema.virtual('expired').get(function (this: any) {
  return this.dueDate < new Date();
});

export const TodoModel = mongoose.model('Todo', todoSchema);

export type TodoDocument = InstanceType<typeof TodoModel>;
