import type { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { getReasonPhrase } from 'http-status-codes';
import type { HTTPError } from 'ky';
import { TimeoutError } from 'ky';

interface IErrorJSON {
    cause?: {
        message: string;
        name: string;
    };
    code: StatusCodes | undefined;
    message: string;
    name: string;
    reason: string | undefined;
    type: TErrorType | undefined;
    unknownError: boolean | undefined;
}

type TErrorType = 'http' | 'app' | 'unknown';

/**
 * `AppError` is a custom error class that extends the built-in `Error` class.
 * It provides additional properties for better error handling and debugging.
 */
export class AppError extends Error {
    /**
     * Indicates if the error is operational, coming from us.
     * Default is `true`.
     */
    isOperational? = true;

    /**
     * Indicates if the error source is unknown.
     * Default is `false`.
     */
    unknownError? = false;

    /**
     * A flag indicating whether this is a safe error to display to the user
     */
    isSafe = true;

    /**
     * The original message of the error.
     * Automatically set when passing the original error as the cause.
     */
    originalMessage?: string;

    /**
     * The HTTP status code associated with the error.
     * Automatically set when the error is of type `http` and the cause is an instance of `HTTPError` or `TimeoutError`.
     */
    code: StatusCodes;

    /**
     * The reason for the error. Could be a detailed description of the error.
     */
    reason: string;

    /**
     * Additional details about the error.
     */
    details?: Record<string, unknown>;

    /**
     * The underlying error that caused this error, if any.
     */
    cause?: Error;

    /**
     * The type of the error.
     * Could be `http`, `app`, or `unknown`.
     * Default is `app`.
     */
    type?: TErrorType = 'app';

    /**
     * The HTTP stack associated with the error.
     * Comes from the `ky` library.
     * Automatically set when the error is of type `http` and the cause is an instance of `HTTPError` or `TimeoutError`.
     */
    httpStack?: {
        options?: HTTPError['options'];
        request: HTTPError['request'];
        response?: HTTPError['response'];
    };

    /**
     * Constructs a new `AppError`.
     */
    constructor({
        message,
        code,
        unknownError,
        cause,
        type,
        isSafe = true,
    }: {
        /**
         * The original error that caused this AppError, if any
         */
        cause?: Error;

        code: (typeof StatusCodes)[keyof typeof StatusCodes];

        /**
         * A flag indicating whether this is a safe error
         */
        isSafe?: boolean;

        /**
         * A human-readable description of the error
         */
        message: string;

        /**
         * A detailed reason for the error, if any
         */
        reason?: string;

        /**
         * The type of the error, if any
         */
        type?: TErrorType;

        /**
         * A flag indicating whether this is an unknown error
         */
        unknownError?: boolean;
    }) {
        // Call the parent constructor and set the error message
        super(message);

        // Set the error name
        this.name = 'AppError';

        // Capture the stack trace of the error
        Error.captureStackTrace(this, this.constructor);

        this.code = code;
        this.reason = getReasonPhrase(code);

        this.unknownError = unknownError;
        this.cause = cause;
        this.type = type;
        this.isSafe = isSafe;

        // Set the original message of the error from the cause if it exists
        this.originalMessage = cause?.message;
    }

    /**
     * Converts the error to a JSON object.
     * This method is called when the error is passed to `JSON.stringify`.
     * It controls what information about the error is included in the resulting JSON string.
     *
     * @returns A JSON object representation of the error.
     */

    /**
     * Converts the error to a JSON object.
     */
    toJSON(): IErrorJSON {
        return {
            name: this.name,
            message: this.message,
            code: this.code,
            type: this.type,
            reason: this.reason,
            unknownError: this.unknownError,
            cause: this.cause
                ? { message: this.cause.message, name: this.cause.name }
                : undefined,
        };
    }
}
