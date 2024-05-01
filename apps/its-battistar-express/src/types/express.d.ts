/* eslint-disable @typescript-eslint/consistent-type-imports */
declare namespace Express {
  export interface Request {
    requestTime: string | undefined;
    user: import('@its-battistar/shared-types').IUser | null;
  }
}
