import type { JwtPayload } from 'jsonwebtoken';
import { sign, verify } from 'jsonwebtoken';

const SECRET = 'secret';

export const generateToken = (user: string): string => {
    const token = sign({ user }, SECRET);

    return token;
};

export const verifyToken = (token: string): string | JwtPayload => {
    return verify(token, SECRET);
};
