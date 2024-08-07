import type { StatusCodes } from 'http-status-codes';

export interface ApiError {
    details?: Record<string, unknown>;
    error: string;
    message: string;
    status: (typeof StatusCodes)[keyof typeof StatusCodes];
}
