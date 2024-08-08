/* eslint-disable no-magic-numbers */
import bcrypt from 'bcrypt';

export const hashPassword = async (password: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                reject(err);
            }

            resolve(hash);
        });
    });
};

export const comparePassword = async (
    password: string,
    hash: string
): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hash, (err, isMatch) => {
            if (err) {
                reject(err);
            }

            resolve(isMatch);
        });
    });
};
