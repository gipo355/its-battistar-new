import { EStrategy } from '@its-battistar/shared-types';
import { type Static, Type } from '@sinclair/typebox';
import { StatusCodes } from 'http-status-codes';
import { Client } from 'undici';

import { AppError } from './app-error';

// TODO: refactor, too much code

const GithubUserSchema = Type.Object({
  email: Type.String(),
  primary: Type.Boolean(),
  verified: Type.Boolean(),
  visibility: Type.Optional(Type.String()),
});
type GithubUser = Static<typeof GithubUserSchema>;

interface ReturnedUser {
  email: string;
  firstName: string;
  providerUid: string;
}

const clientAddresses: Record<keyof typeof EStrategy, string> = {
  GITHUB: 'https://api.github.com',
  GOOGLE: 'https://www.googleapis.com',
  LOCAL: '',
};

const clientAddressesPaths: Record<keyof typeof EStrategy, string> = {
  GITHUB: '/user',
  GOOGLE: '/oauth2/v3/userinfo',
  LOCAL: '',
};

const clientGithub = new Client(clientAddresses.GITHUB);
const clientGoogle = new Client(clientAddresses.GOOGLE);

// FIXME: reduce complexity and add google case ( check fastify )

export const getUserInfoFromOauthToken = async (
  token: string,
  strategy: keyof typeof EStrategy
): Promise<ReturnedUser | null> => {
  const provider = strategy;

  const client = provider === 'GITHUB' ? clientGithub : clientGoogle;

  /**
   * this part of the code will fetch the emails
   */
  const response = await client.request({
    method: 'GET',
    path:
      provider === 'GITHUB'
        ? `${clientAddressesPaths[provider]}/emails`
        : clientAddressesPaths[provider],
    headers: {
      'User-Agent': 'fastify-example',
      Authorization: `Bearer ${token}`,
      ...(provider === 'GITHUB' && {
        Accept: 'application/vnd.github+json',
      }),
    },
  });

  if (response.statusCode >= StatusCodes.BAD_REQUEST.valueOf()) {
    throw new AppError('Authenticate again 1', StatusCodes.UNAUTHORIZED);
  }

  let payload = '';

  response.body.setEncoding('utf8');

  for await (const chunk of response.body) {
    if (typeof chunk === 'string') payload += chunk;
  }

  // eslint-disable-next-line no-magic-numbers
  if (payload.length === 0) {
    throw new AppError('Authenticate again 2', StatusCodes.UNAUTHORIZED);
  }

  /**
   * this part of the code will fetch the user info
   */

  /**
   * ## GITHUB CASE
   */
  if (provider === 'GITHUB') {
    const githubUser: ReturnedUser = {
      email: '',
      firstName: '',
      providerUid: '',
    };

    /**
     * ## Get user email from payload
     */
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const parsedPayload: GithubUser[] | undefined = JSON.parse(payload);

    // lenght > 0 and not undefined
    if (!parsedPayload) {
      throw new AppError('Authenticate again 3', StatusCodes.UNAUTHORIZED);
    }

    // only one email is primary
    for (const ele of parsedPayload) {
      if (ele.primary) githubUser.email = ele.email;
    }

    if (!githubUser.email) {
      throw new AppError('Authenticate again 4', StatusCodes.UNAUTHORIZED);
    }

    /**
     * ## Get user first name
     */
    const response2 = await client.request({
      method: 'GET',
      path: clientAddressesPaths[provider],
      headers: {
        'User-Agent': 'fastify-example',
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
      },
    });

    if (response2.statusCode >= StatusCodes.BAD_REQUEST.valueOf()) {
      throw new AppError('Authenticate again 5', StatusCodes.UNAUTHORIZED);
    }

    let payload2 = '';
    response2.body.setEncoding('utf8');
    for await (const chunk of response2.body) {
      if (typeof chunk === 'string') {
        payload2 += chunk;
      }
    }

    interface GithubUser2 {
      login: string;
      id: number;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const parsedPayload2: GithubUser2 = JSON.parse(payload2);

    // console.log(parsedPayload2, 'parsedPayload2');

    githubUser.firstName = parsedPayload2.login;
    githubUser.providerUid = parsedPayload2.id.toString();

    return githubUser;
  }

  return null;
};
