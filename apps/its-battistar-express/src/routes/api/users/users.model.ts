import type { IUser } from '@its-battistar/shared-types';
import { ERole } from '@its-battistar/shared-types';
import mongoose from 'mongoose';
import isAscii from 'validator/lib/isAscii';
import isURL from 'validator/lib/isURL';

const userSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, 'A user must have a username'],
      validate: {
        validator: function validator(value: string) {
          // eslint-disable-next-line no-magic-numbers
          return value.length > 2 && isAscii(value);
        },
        message:
          'A user username must have more than 2 characters and only contain ASCII characters',
      },
      trim: true,
    },

    avatar: {
      type: String,
      validate: {
        validator: function validator(value: string) {
          return isURL(value);
        },
        message: 'A user avatar must be a valid URL',
      },
    },

    role: {
      type: String,
      required: true,
      default: ERole.USER,
      enum: Object.keys(ERole),
    },

    createdAt: {
      type: Date,
      default: Date.now(),
    },

    updatedAt: {
      type: Date,
      default: Date.now(),
    },

    deletedAt: {
      type: Date,
    },

    accounts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
      },
    ],

    todos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Todo',
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
      transform: function (_, ret) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
    toObject: { virtuals: true },
  }
);

userSchema.pre<IUser>('save', function setUpdatedAt(next) {
  this.updatedAt = new Date();
  next();
});

/**
 * filter out inactive users
 */
userSchema.pre(/^find/, function prequery(next) {
  // this points to the current query

  // can also select: false directly in the model properties to prevent showing it
  // void this.select('-password -passwordConfirm'); // this will prevent finding it to comparePassword

  // find only docs with active = true
  if (this instanceof mongoose.Query) {
    void this.find({ active: { $ne: false } });
  }

  next();
});

export const UserModel = mongoose.model('User', userSchema);

export type UserDocument = InstanceType<typeof UserModel>;
