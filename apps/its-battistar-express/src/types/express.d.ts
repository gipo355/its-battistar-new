/* eslint-disable @typescript-eslint/consistent-type-imports */
declare namespace Express {
  export interface Request {
    account:
      | import('../routes/api/users/accounts.model').AccountDocument
      | null;
    requestTime: string | undefined;
    tokenPayload: import('../utils/jwt').CustomJWTClaims | null;
    user: import('../routes/api/users/users.model').UserDocument | null;
  }
}
