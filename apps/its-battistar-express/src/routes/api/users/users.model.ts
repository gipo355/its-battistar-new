 
import { IUser } from '@its-battistar/shared-types';
import mongoose from 'mongoose';
// import isAscii from 'validator/lib/isAscii';

const userSchema = new mongoose.Schema<IUser>(
  {
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
    },
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

const UserModel = mongoose.model('User', userSchema);

export { UserModel };
