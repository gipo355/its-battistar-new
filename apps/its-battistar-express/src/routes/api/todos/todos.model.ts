/* eslint-disable no-magic-numbers */
import type { ITodo } from '@its-battistar/shared-types';
import { ETodoColorOptions } from '@its-battistar/shared-types';
import mongoose from 'mongoose';
import isAscii from 'validator/lib/isAscii';
import isURL from 'validator/lib/isURL';

const todoSchema = new mongoose.Schema<ITodo>(
  {
    title: {
      type: String,
      required: [true, 'A todo must have a title'],
      trim: true,
      maxlength: [
        40,
        'A todo title must have less or equal then 40 characters',
      ],
      validate: {
        validator: function validator(value: string) {
          return isAscii(value);
        },
        message: 'A todo title must only contain ASCII characters',
      },
    },

    color: {
      type: String,
      enum: {
        values: Object.keys(ETodoColorOptions),
        message: `Color is either: ${Object.keys(ETodoColorOptions).join(', ')}`,
      },
      default: 'default',
    },

    description: {
      type: String,
      trim: true,
      maxlength: [
        300,
        'A todo description must have less or equal then 200 characters',
      ],
      validate: {
        validator: function validator(value: string) {
          return isAscii(value);
        },
        message: 'A todo description must only contain ASCII characters',
      },
    },

    dueDate: {
      type: Date,
    },

    image: {
      type: String,
      validate: {
        validator: function validator(value: string) {
          return isURL(value);
        },
        message: 'A todo image must be a valid URL',
      },
    },

    completed: {
      type: Boolean,
      default: false,
    },

    createdAt: {
      type: Date,
      default: Date.now(),
    },

    updatedAt: {
      type: Date,
      default: Date.now(),
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    toJSON: {
      virtuals: true,
      transform: function (_, ret) {
        ret.id = ret._id as string;
        delete ret._id;
        delete ret.__v;
      },
    },
    toObject: { virtuals: true },
  }
);

todoSchema.virtual('expired').get(function getDurationWeeks() {
  if (!this.dueDate) return false;
  return this.dueDate < new Date();
});

todoSchema.pre<ITodo>('save', function setUpdatedAt(next) {
  this.updatedAt = new Date();
  next();
});

export const TodoModel = mongoose.model('Todo', todoSchema);

export type TodoDocument = InstanceType<typeof TodoModel>;
