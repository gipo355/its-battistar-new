import type { IAccount } from '@its-battistar/shared-types';
import { EStrategy } from '@its-battistar/shared-types';
import type { Model } from 'mongoose';
import mongoose from 'mongoose';
import isEmail from 'validator/lib/isEmail';

import { APP_CONFIG as c } from '../../../app.config';
import {
  easyEncrypt,
  generateRandomBytes,
  hashPassword,
  verifyPassword,
} from '../../../utils';

// TODO: big problem with this
// we need to handle multiple emails per user that can be equal
//
// but must be unique for all users
// and must be unique per user-strategy
//
// no multiple primary accounts
//
// the fields i can work with are: userId, email, strategy, primary

interface IAccountMethods {
  clearPasswordResetToken: () => void;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
  createEmailVerificationToken: () => Promise<string>;
  hasPasswordChangedSinceTokenIssuance: (iat: number) => boolean;
}

// eslint-disable-next-line @typescript-eslint/ban-types
type TAccountModel = Model<IAccount, {}, IAccountMethods>;

const accountSchema = new mongoose.Schema<
  IAccount,
  TAccountModel,
  IAccountMethods
>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    /**
     * FIXME: Difficult: how to handle multiple emails per user?
     * but there can't be multiple users with same email
     *
     * the first email should be primary by default
     */
    email: {
      type: String,
      required: true,
      // unique: true,
      trim: true,
      lowercase: true,
      validate: [isEmail, 'Must be a valid email address'],
    },
    verified: {
      type: Boolean,
      default: false,
    },
    primary: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
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

    // social
    strategy: {
      type: String,
      enum: Object.keys(EStrategy),
      required: true,
    },
    providerId: {
      type: String,
    },
    providerAccessToken: {
      type: String,
    },

    // local
    password: {
      type: String,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: Date,
    },
    passwordChangedAt: {
      type: Date,
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

/**
 * ## hash password before saving
 * validate password and passwordConfirm
 */
accountSchema.pre('save', async function preSave(next) {
  try {
    if (this.password && this.isModified('password')) {
      this.password = await hashPassword(this.password);
    }

    // void this.save();

    next();
  } catch (error) {
    if (error instanceof Error) {
      error.message = `Error in preSave: ${error.message}`;
      next(error);
      return;
    }
    next(new Error('Error in preSave'));
  }
});

/**
 * ## set deletedAt to current date if active is changed to false
 * doesn't work with updates, must save
 */
accountSchema.pre('save', function preSave(next) {
  try {
    if (!this.isNew && this.active && this.isModified('active')) {
      this.deletedAt = new Date();
    }

    // does it conflict with the other preSave and future save?
    // void this.save();

    next();
  } catch (error) {
    if (error instanceof Error) {
      error.message = `Error in preHook: ${error.message}`;
      next(error);
      return;
    }
    next(new Error('Error in preHook'));
  }
});

/**
 * ## update passwordChangedAt when password is modified
 */
accountSchema.pre('save', function updatePasswordModified(next) {
  if (this.isNew || !this.isModified('password')) {
    next();
    return;
  }

  // NOTE: must remove 500ms or conflicts with the json web token expiry. (iat in seconds)
  // eslint-disable-next-line no-magic-numbers
  this.passwordChangedAt = new Date(Date.now() - 500);

  // void this.save();

  next();
});

// not just find, any query that starts with find
// use function or this won't be pointing to the correct object
/**
 * ## filter out inactive accounts
 */
accountSchema.pre(/^find/, function prequery(next) {
  // this points to the current query

  // can also select: false directly in the model properties to prevent showing it
  // void this.select('-password -passwordConfirm'); // this will prevent finding it to comparePassword

  // find only docs with active = true
  if (this instanceof mongoose.Query) {
    void this.find({ active: { $ne: false } });
  }

  next();
});

// IMP: must not use arrow function to access this as document
/**
 * ## check if provided password is the same as the one in the db
 * by hashing the provided password and comparing it to the one in the db
 */
accountSchema.methods.comparePassword = async function comparePassword(
  candidatePassword: string
): Promise<boolean> {
  try {
    // this.password is not available if we use select: false

    const userPasswordHash = this.password;

    if (!userPasswordHash) {
      return false;
    }

    const isValid = await verifyPassword({
      candidatePassword,
      hash: userPasswordHash,
    });

    return isValid;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error in comparePassword: ${error.message}`);
    }
    throw new Error('Error in comparePassword');
  }
};

/**
 * Creates a password reset token and saves it in the db with an expiry date
 * must be sent via email to on a link with query params
 * On click, user is redirected to a page where he can enter a new password
 * if the token is valid
 *
 * The same happens for email verification
 */
accountSchema.methods.createEmailVerificationToken = async function () {
  /**
   * ## generate random bytes to send to user
   */
  const generatedRandomToken = await generateRandomBytes(c.RANDOM_BYTES_VALUE);

  /**
   * ## encrypt token to save in db - we will confront the encrypted token in the db with the unencrypted one in the url ( by encrypting it )
   */
  const encryptedToken = easyEncrypt(generatedRandomToken);

  this.passwordResetToken = encryptedToken;

  this.passwordResetExpires = new Date(
    // eslint-disable-next-line no-magic-numbers
    Date.now() + 1000 * 60 * c.RESET_TOKEN_EXPIRY_MINS
  );

  // NOTE: we need to save the document to save the token and expiry date in db
  // IMP: we need validateBeforeSave false because
  // otherwise it asks to insert all required fields
  await this.save({ validateBeforeSave: false }); // if i await save, does it block the next step?

  return generatedRandomToken;
};

accountSchema.methods.clearPasswordResetToken =
  function clearPasswordResetToken() {
    this.passwordResetToken = undefined;
    this.passwordResetExpires = undefined;

    // IMP: we need validateBeforeSave because otherwise it asks to insert all required fields
  };

export const AccountModel = mongoose.model<IAccount, TAccountModel>(
  'Account',
  accountSchema
);
export type AccountDocument = InstanceType<typeof AccountModel>;
