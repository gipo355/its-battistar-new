import type { StatusCodes } from 'http-status-codes';

interface IErrorMessage {
    /**
     * The status code of the error.
     */
    details?: Record<string, unknown>;
    /**
     * The message of the error.
     */
    error: string;
    /**
     * The status code of the error.
     */
    message: string;
    /**
     * The status code of the error.
     */
    status: (typeof StatusCodes)[keyof typeof StatusCodes];
}

export class ErrorMessage implements IErrorMessage {
    error: string;
    message: string;
    status: (typeof StatusCodes)[keyof typeof StatusCodes];
    details?: Record<string, unknown>;

    constructor({ message, status, error, details }: IErrorMessage) {
        this.status = status;
        this.details = {
            ...details,
        };
        this.error = JSON.stringify(error);
        this.message = message;
    }
}
