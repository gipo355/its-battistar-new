/**
 * @description Custom error class to handle operational error
 * IMPORTANT: This class is used to handle operational errors, not programming errors.
 *
 * When you create a new instance of this class, the isOperationalError property is set to true
 * by default.
 *
 * This is used to distinguish between operational errors and programming errors so that we can
 * forward operational errors to the client and not programming errors, to prevent leaking sensitive informations.
 */
class AppError extends Error {
  statusCode?: number;

  status?: 'error' | 'success' | 'fail';

  isOperationalError?: boolean;

  path?: string;

  code?: number;

  value?: string;

  keyValue?: {
    email?: string;
    name?: string;
  };

  errors?: Record<string, string>[];

  // Those are the only values i need to set. The rest is set by other parties (mongoose, express, etc.)
  constructor(message: string, statusCode: number, operational = true) {
    super(message);
    // we didn't call this.message = message because the parent class is Error and already sets the this.message
    // we already set the message prop to incoming message

    this.statusCode = statusCode;

    this.status = statusCode.toString().startsWith('4') ? 'fail' : 'error';

    // set a property to distinguish between operationa errors we defined with this class
    this.isOperationalError = operational;

    // this is object itself, AppError is this.constructor
    // when a new object is created and a constructor function is called, the function call is not going to appear in the stack trace and will not pollute it
    // this is needed to avoid polluting the stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

export { AppError };
