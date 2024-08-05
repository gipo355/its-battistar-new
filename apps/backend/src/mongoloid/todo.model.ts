/* eslint-disable no-magic-numbers */
import mongoose from 'mongoose';
import isAscii from 'validator/lib/isAscii';

import type { ITodoMongoose } from '../schemas/todo.schema';

const todoSchema = new mongoose.Schema<ITodoMongoose>(
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

        dueDate: {
            type: Date,
        },

        createdAt: {
            type: Date,
            default: Date.now,
        },

        completed: {
            type: Boolean,
            default: false,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'A todo must have a creator'],
        },

        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        toJSON: {
            virtuals: true,
        },
        toObject: { virtuals: true },
    }
);

todoSchema.virtual('expired').get(function getDurationWeeks() {
    if (!this.dueDate) {
        return false;
    }
    return this.dueDate < new Date();
});

export const TodoModel = mongoose.model('Todo', todoSchema);

export type TodoDocument = InstanceType<typeof TodoModel>;
