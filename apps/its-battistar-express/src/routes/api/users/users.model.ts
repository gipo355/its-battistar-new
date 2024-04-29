import { ERole, IUser } from '@its-battistar/shared-types';
import mongoose from 'mongoose';
import isEmail from 'validator/lib/isEmail';
// import isAscii from 'validator/lib/isAscii';

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: [isEmail, 'Must be a valid email address'],
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
    active: {
      type: Boolean,
      default: true,
    },
    verified: {
      type: Boolean,
      default: false,
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
