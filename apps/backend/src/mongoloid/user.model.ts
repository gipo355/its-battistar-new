import mongoose from 'mongoose';
import { isStrongPassword } from 'validator';
import isAscii from 'validator/lib/isAscii';
import isURL from 'validator/lib/isURL';

import type { FullUser } from '../schemas/user.schema';
import { comparePassword, hashPassword } from '../utils/bcrypt';

interface IUserMethods {
    comparePassword(password: string): Promise<boolean>;
}

// eslint-disable-next-line @typescript-eslint/ban-types
const userSchema = new mongoose.Schema<FullUser, {}, IUserMethods>(
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

        lastName: {
            type: String,
            required: [true, 'A user must have a last name'],
            trim: true,
            validate: {
                validator: function validator(value: string) {
                    // eslint-disable-next-line no-magic-numbers
                    return value.length > 2 && isAscii(value);
                },
                message:
                    'A user last name must have more than 2 characters and only contain ASCII characters',
            },
        },

        firstName: {
            type: String,
            required: [true, 'A user must have a first name'],
            trim: true,
            validate: {
                validator: function validator(value: string) {
                    // eslint-disable-next-line no-magic-numbers
                    return value.length > 2 && isAscii(value);
                },
                message:
                    'A user first name must have more than 2 characters and only contain ASCII characters',
            },
        },

        password: {
            type: String,
            required: [true, 'A user must have a password'],
            trim: true,
            validate: {
                validator: function validator(value: string) {
                    return isStrongPassword(value);
                },
                message:
                    'A user password must have more than 8 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character',
            },
        },

        picture: {
            type: String,
            validate: {
                validator: function validator(value: string) {
                    return isURL(value);
                },
                message: 'A user picture must be a valid URL',
            },
        },
    },
    {
        toJSON: {
            virtuals: true,
        },
        toObject: { virtuals: true },
    }
);

/**
 * Virtual full name
 */
userSchema.virtual('fullName').get(function getFullName() {
    return `${this.firstName} ${this.lastName}`;
});

/**
 * encrypt password before saving
 */
userSchema.pre('save', async function encryptPassword(next) {
    if (this.isModified('password')) {
        this.password = await hashPassword(this.password);
    }

    next();
});

/**
 * method to compare passwords
 */
userSchema.methods.comparePassword = async function (
    password: string
): Promise<boolean> {
    return comparePassword(password, this.password);
};

export const UserModel = mongoose.model('User', userSchema);

export type UserDocument = InstanceType<typeof UserModel>;
