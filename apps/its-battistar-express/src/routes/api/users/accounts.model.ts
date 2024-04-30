import { EStrategy, IAccount } from '@its-battistar/shared-types';
import mongoose, { Model } from 'mongoose';

import { APP_CONFIG as c } from '../../../app.config';
import {
  easyEncrypt,
  generateRandomBytes,
  hashPassword,
  verifyPassword,
} from '../../../utils';

interface IAccountMethods {
  comparePassword: (candidatePassword: string) => Promise<boolean>;
  hasPasswordChangedSinceTokenIssuance: (iat: number) => boolean;
  createPasswordResetToken: () => Promise<string>;
  clearPasswordResetToken: () => void;
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
    strategy: {
      type: String,
      enum: Object.keys(EStrategy),
      required: true,
    },
    providerId: {
      type: String,
    },
    password: {
      type: String,
    },
    passwordConfirm: {
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
    if (this.password && this.passwordConfirm) {
      const isSame = this.password === this.passwordConfirm;
      if (!isSame) {
        throw new Error('Password and Confirm password did not match');
      }
    }

    if (this.password && this.isModified('password')) {
      this.password = await hashPassword(this.password);
      this.passwordConfirm = undefined;
    }

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
 * ## set deletedAt to current date if active is false
 * doesn't work with updates
 */
accountSchema.pre('save', function preSave(next) {
  try {
    if (!this.isNew && this.active && this.isModified('active')) {
      this.deletedAt = new Date();
    }

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
  // fixing problem of new document
  if (this.isNew) {
    next();
    return;
  }
  if (!this.isModified('password')) {
    next();
    return;
  }

  // eslint-disable-next-line no-magic-numbers
  this.passwordChangedAt = new Date(Date.now() - 500); // NOTE: must remove 500ms or conflicts with the json web token expiry. (iat in seconds)

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
accountSchema.methods.comparePassword = async function comparePassword(
  candidatePassword: string
): Promise<boolean> {
  try {
    // this.password is not available if we use select: false

    const userPasswordHash = this.password;

    console.log('userPasswordHash', userPasswordHash);
    console.log('candidatePassword', candidatePassword);

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

accountSchema.methods.hasPasswordChangedSinceTokenIssuance = function (
  iat: number
) {
  if (this.passwordChangedAt) {
    // eslint-disable-next-line no-magic-numbers
    const tokenIssuedTime = new Date(iat * 1000); // IAT is in seconds

    // if token issued time is smaller or equal than last modification time, it's been issued earlier than last pw modification
    return tokenIssuedTime <= this.passwordChangedAt;
  }

  return false; // set default for new users
};

accountSchema.methods.createPasswordResetToken =
  async function createPasswordResetToken() {
    //
    // randomBytes();
    /**
     * ## generate random bytes to send to user
     */
    const generatedRandomToken = await generateRandomBytes(
      c.RANDOM_BYTES_VALUE
    );

    /**
     * ## encrypt token to save in db - we will confront the encrypted token in the db with the unencrypted one in the url ( by encrypting it )
     */
    const encryptedToken = easyEncrypt(generatedRandomToken);

    this.passwordResetToken = encryptedToken;

    this.passwordResetExpires = new Date(
      // eslint-disable-next-line no-magic-numbers
      Date.now() + 1000 * 60 * c.RESET_TOKEN_EXPIRY_MINS
    );

    // NOTE: we need to save the document to save the token
    // IMP: we need validateBeforeSave because otherwise it asks to insert all required fields

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
