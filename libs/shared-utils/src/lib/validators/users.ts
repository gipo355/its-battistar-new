import { userSchema, userSchemaInput } from '@its-battistar/shared-types';
import fastJsonStringify from 'fast-json-stringify';

import { ajvInstance } from '../utils/ajv';

// TODO: fix validation for different use cases and data types
export const stringifyUser = fastJsonStringify(userSchema);

export const validateUser = ajvInstance.compile(userSchemaInput);
