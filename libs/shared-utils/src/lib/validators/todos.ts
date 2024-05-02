import { todoSchemaInput } from '@its-battistar/shared-types';

import { ajvInstance } from '../utils/ajv';

/**
 * Validation and serialization functions for the schemas provided
 */

export const validateTodoInput = ajvInstance.compile(todoSchemaInput);
