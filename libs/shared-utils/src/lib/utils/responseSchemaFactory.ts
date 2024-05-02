import { customResponseSchemaFactory } from '@its-battistar/shared-types';
import { type TSchema } from '@sinclair/typebox';
import fastJsonStringify from 'fast-json-stringify';

/**
 * @description must pass the data schema to the function to stringify the response
 * Do it globally to cache the stringify function on startup
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const stringifyCustomResponseFactory = <T extends TSchema>(T: T) =>
  fastJsonStringify(customResponseSchemaFactory(T));
