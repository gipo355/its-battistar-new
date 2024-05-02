import { hash, verify } from '@node-rs/argon2';

import { e } from '../environments';

// TODO: workerpool?

export const enum Algorithm {
  Argon2d,
  Argon2i,
  Argon2id,
}
export const enum Version {
  /** Version 16 (0x10 in hex) */
  V0x10,
  /**
   * Default value
   * Version 19 (0x13 in hex, default)
   */
  V0x13,
}

const argonOptions = {
  /**
   * The amount of memory to be used by the hash function, in kilobytes. Each thread will have a memory pool of this size. Note that large values for highly concurrent usage will cause starvation and thrashing if your system memory gets full.
   *
   * Value is an integer in decimal (1 to 10 digits), between 1 and (2^32)-1.
   *
   * The default value is 4096, meaning a pool of 4 MiB per thread.
   */
  // memoryCost?: number | undefined | null
  /**
   * The time cost is the amount of passes (iterations) used by the hash function. It increases hash strength at the cost of time required to compute.
   *
   * Value is an integer in decimal (1 to 10 digits), between 1 and (2^32)-1.
   *
   * The default value is 3.
   */
  // timeCost?: number | undefined | null
  /**
   * The hash length is the length of the hash function output in bytes. Note that the resulting hash is encoded with Base 64, so the digest will be ~1/3 longer.
   *
   * The default value is 32, which produces raw hashes of 32 bytes or digests of 43 characters.
   */
  // outputLen?: number | undefined | null
  /**
   * The amount of threads to compute the hash on. Each thread has a memory pool with memoryCost size. Note that changing it also changes the resulting hash.
   *
   * Value is an integer in decimal (1 to 3 digits), between 1 and 255.
   *
   * The default value is 1, meaning a single thread is used.
   */
  // parallelism?: number | undefined | null
  algorithm: 2,
  // version?: Version | undefined | null
  secret: Buffer.from(e.ARGON2_SECRET),
};

export const hashPassword = async (password: string): Promise<string> => {
  const hashed = await hash(password, argonOptions);
  return hashed;
};

export const verifyPassword = async ({
  candidatePassword,
  hash,
}: {
  candidatePassword: string;
  hash: string;
}): Promise<boolean> => {
  const isValid = await verify(hash, candidatePassword, argonOptions);
  return isValid;
};
