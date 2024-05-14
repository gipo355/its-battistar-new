import { isAscii, isBoolean } from 'class-validator';
import mongoose from 'mongoose';

export class Todo {
  id!: number;
  title!: string;
  dueDate!: Date;
  assignedTo!: string | mongoose.Schema.Types.ObjectId;
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  completed: {
    type: Boolean,
    required: true,
    validate: isBoolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

todoSchema.virtual('expired').get(function () {
  return this.dueDate < new Date();
});

export const TodoModel = mongoose.model('Todo', todoSchema);

export type TodoDocument = InstanceType<typeof TodoModel>;
