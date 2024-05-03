import type {
  ESocialStrategy,
  GithubUser2,
  ReturnedGithubUser,
  TGithubUsers,
} from '@its-battistar/shared-types';
import {
  assertAjvValidationOrThrow,
  validateGithubUser2,
  validateGithubUsers,
} from '@its-battistar/shared-utils';
import { StatusCodes } from 'http-status-codes';
import { Client } from 'undici';

import { AppError } from './app-error';
import { logger } from './logger';

const clientAddresses: Record<keyof typeof ESocialStrategy, string> = {
  GITHUB: 'https://api.github.com',
  GOOGLE: 'https://www.googleapis.com',
};

const clientAddressesPaths: Record<keyof typeof ESocialStrategy, string> = {
  GITHUB: '/user',
  GOOGLE: '/oauth2/v3/userinfo',
};

const clientGithub = new Client(clientAddresses.GITHUB);
const clientGoogle = new Client(clientAddresses.GOOGLE);

// FIXME: reduce complexity and add google case ( check fastify )

export const getUserInfoFromOauthToken = async (
  token: string,
  strategy: keyof typeof ESocialStrategy
): Promise<ReturnedGithubUser | null> => {
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
      'User-Agent': 'its-battistar',
      Authorization: `Bearer ${token}`,
      ...(provider === 'GITHUB' && {
        Accept: 'application/vnd.github+json',
      }),
      ...(provider === 'GITHUB' && {
        ['X-Github-Api-Version']: '2022-11-28',
      }),
    },
  });

  let payload = '';

  response.body.setEncoding('utf8');

  for await (const chunk of response.body) {
    if (typeof chunk === 'string') payload += chunk;
  }

  if (response.statusCode >= StatusCodes.BAD_REQUEST.valueOf()) {
    logger.error({
      message: 'Error in getUserInfoFromOauthToken',
      response: JSON.stringify(response),
      payload,
      token,
      provider,
    });
    throw new AppError('Authenticate again 1', StatusCodes.UNAUTHORIZED);
  }

  // eslint-disable-next-line no-magic-numbers
  if (payload.length === 0) {
    logger.error('Error in getUserInfoFromOauthToken, payload is empty');
    throw new AppError('Authenticate again 2', StatusCodes.UNAUTHORIZED);
  }

  /**
   * this part of the code will fetch the user info
   */

  /**
   * ## GITHUB CASE
   */
  if (provider === 'GITHUB') {
    const githubUser: ReturnedGithubUser = {
      email: '',
      firstName: '',
      providerUid: '',
    };

    /**
     * ## Get user email from payload
     */

    // const parsedPayload: TGithubUser[] = JSON.parse(payload);
    const parsedPayload = JSON.parse(payload);
    assertAjvValidationOrThrow<TGithubUsers>(
      parsedPayload,
      validateGithubUsers,
      (errors) => {
        let messages = '';
        if (errors)
          for (const error of errors) {
            if (typeof error.message === 'string')
              messages += error.message + '\n';
          }
        new AppError(messages, StatusCodes.INTERNAL_SERVER_ERROR);
      }
    );

    // lenght > 0 and not undefined
    // if (!parsedPayload) {
    //   throw new AppError('Authenticate again 3', StatusCodes.UNAUTHORIZED);
    // }

    // only one email is primary
    for (const ele of parsedPayload) {
      if (ele.primary) githubUser.email = ele.email;
    }

    if (!githubUser.email) {
      logger.error('Error in getUserInfoFromOauthToken, email not found');
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
      logger.error('Error in getUserInfoFromOauthToken', {
        response: JSON.stringify(response2),
        token,
        provider,
      });
      throw new AppError('Authenticate again 5', StatusCodes.UNAUTHORIZED);
    }

    let payload2 = '';
    response2.body.setEncoding('utf8');
    for await (const chunk of response2.body) {
      if (typeof chunk === 'string') {
        payload2 += chunk;
      }
    }

    // const parsedPayload2: GithubUser2 = JSON.parse(payload2);
    const parsedPayload2 = JSON.parse(payload2);
    assertAjvValidationOrThrow<GithubUser2>(
      parsedPayload2,
      validateGithubUser2,
      (errors) => {
        let messages = '';
        if (errors)
          for (const error of errors) {
            if (typeof error.message === 'string')
              messages += error.message + '\n';
          }
        new AppError(messages, StatusCodes.INTERNAL_SERVER_ERROR);
      }
    );

    githubUser.firstName = parsedPayload2.login;
    githubUser.providerUid = parsedPayload2.id.toString();

    return githubUser;
  }

  return null;
};
