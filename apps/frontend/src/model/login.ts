/**
 * ITS 2023
 * Esercitazione 1
 *
 * OpenAPI spec version: 1
 *
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import type { User } from './user';

export interface Login {
    /**
     * JWT token
     */
    token?: string;
    user?: User;
}
