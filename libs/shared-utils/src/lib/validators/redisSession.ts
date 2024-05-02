import { redisSessionPayloadSchema } from '@its-battistar/shared-types';

import { ajvInstance } from '../utils';

export const validateRedisSessionPayload = ajvInstance.compile(
  redisSessionPayloadSchema
);
