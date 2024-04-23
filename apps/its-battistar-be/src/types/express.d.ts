declare namespace Express {
  export interface Request {
    requestTime: string | undefined;
    user: import('@its-battistar/shared-types').IUser | null;
  }
}
