// https://github.com/panva/paseto/discussions/32
// import { createHash } from 'node:crypto';

import { createSecretKey } from 'crypto';
import { V3 } from 'paseto';

import { e } from '../environments';

// "v3.local secret key must be 32 bytes long symmetric key"
// const hashedKey = createHash('sha256').update(e.JWT_SECRET).digest('base64');
// const bytesArray = Buffer.from( new Array(48).fill('a').join(''));
// const key = V3.bytesToKeyObject(Buffer.from(e.JWT_SECRET, 'base64'));
const key = createSecretKey(
  Buffer.from(
    // 'b244ac595fbe3a6ea8c3fad93f66d15221121428fd03dcccf32203e364f504ed', #pragma: allowlist secret
    e.JWT_SECRET,
    'hex'
  )
);

// TODO: workerpool?

export const createJWT = async (
  payload: Record<string, unknown>
): Promise<string> =>
  V3.encrypt(payload, key, {
    audience: 'urn:example:audience',
    expiresIn: '2h',
    iat: true,
    issuer: 'urn:example:issuer',
    jti: '123',
  });

export const verifyJWT = async (
  token: string
): Promise<Record<string, unknown>> =>
  V3.decrypt(token, key, {
    audience: 'urn:example:audience',
    issuer: 'urn:example:issuer',
    maxTokenAge: '2h',
  });
