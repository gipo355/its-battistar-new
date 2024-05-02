import { todoSchema, todoSchemaInput } from '@its-battistar/shared-types';
import fastJsonStringify from 'fast-json-stringify';

import {ajvInstance} from './ajv';

// Utility functions
export const stringifyTodo = fastJsonStringify(todoSchema);

export const validateTodo = ajvInstance.compile(todoSchemaInput);
