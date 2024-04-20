import { ITodo } from '@its-battistar/shared-types';
import mongoose from 'mongoose';

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
          return value !== '';
        },
        message: 'A todo title must not be empty',
      },
    },
    dueDate: {
      type: Date,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

todoSchema.virtual('expired').get(function getDurationWeeks() {
  return this.dueDate < new Date();
});

/**
 * ## No big performance overhead
 * only guides and admins will be able to see the bookings
 */
todoSchema.pre(/^find/, function preFind(next) {
  /**
   * ## populate
   */
  // TODO: typescript remove any?
  void (this as mongoose.Query<any, any>)
    // .populate('user')
    .populate({
      path: 'tour',
      /**
       * ## this will populate with guides too:
       * in the pre find tour we add all the guides with populate
       */
      select: 'name id',
    })
    .populate({
      path: 'user',
      select: 'name email id',
    });

  next();
});

const TodoModel = mongoose.model('Todo', todoSchema);

export { TodoModel };
