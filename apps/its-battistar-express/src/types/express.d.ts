/* eslint-disable @typescript-eslint/consistent-type-imports */
declare namespace Express {
  export interface Request {
    requestTime: string | undefined;
    user: import('../routes/api/users/users.model').UserDocument | null;
    account:
      | import('../routes/api/users/accounts.model').AccountDocument
      | null;
    tokenPayload: import('../utils/jwt').CustomJWTClaims | null;
  }
}
