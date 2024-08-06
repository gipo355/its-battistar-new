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

export interface Todo {
    assignedTo?: User;
    completed?: boolean;
    createdBy?: User;
    /**
     * data entro la quale completare il task
     */
    dueDate?: string;
    /**
     * true se il todo ha una dueDate, la data è passata e il task non è completato
     */
    expired?: boolean;
    /**
     * id univoco generato lato server
     */
    id?: string;
    title?: string;
}
