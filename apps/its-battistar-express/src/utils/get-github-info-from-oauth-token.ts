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

import { AppError } from './app-error';
import { logger } from './logger';

const GITHUB_CLIENT_ADDRESS = 'https://api.github.com';
const GITHUB_CLIENT_USER_PATH = `${GITHUB_CLIENT_ADDRESS}/user`;
const GITHUB_CLIENT_EMAILS_PATH = `${GITHUB_CLIENT_USER_PATH}/emails`;

export const getGithubUserInfoFromOauthTokenFetch = async (
  token: string,
  strategy: keyof typeof ESocialStrategy
): Promise<ReturnedGithubUser | null> => {
  const provider = strategy;

  const response = await fetch(GITHUB_CLIENT_EMAILS_PATH, {
    headers: {
      'User-Agent': 'its-battistar',
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-Github-Api-Version': '2022-11-28',
    },
  });

  const userData = await response.json();

  if (!response.ok) {
    logger.error({
      message: 'Error in getUserInfoFromOauthToken',
      response,
      data: userData,
      token,
      provider,
    });
    throw new AppError('Authenticate again 1', StatusCodes.UNAUTHORIZED);
  }

  /**
   * this part of the code will fetch the user info
   */

  const githubUser: ReturnedGithubUser = {
    email: '',
    firstName: '',
    providerUid: '',
  };

  /**
   * ## Get user email from payload
   */
  // [{
  //   email: '',
  //   primary: true,
  //   verified: true,
  //   visibility: 'private' // not in schema can be null
  // }]
  assertAjvValidationOrThrow<TGithubUsers>(
    userData,
    validateGithubUsers,
    (errors) => {
      let messages = '';
      if (errors)
        for (const error of errors) {
          if (typeof error.message === 'string')
            messages += error.message + '\n';
        }
      new AppError(messages, StatusCodes.INTERNAL_SERVER_ERROR);
    },
    logger
  );

  // only one email is primary
  for (const account of userData) {
    if (account.primary) githubUser.email = account.email;
  }

  if (!githubUser.email) {
    logger.error('Error in getUserInfoFromOauthToken, email not found');
    throw new AppError('Authenticate again 4', StatusCodes.UNAUTHORIZED);
  }

  /**
   * get user info
   */
  const response2 = await fetch(GITHUB_CLIENT_USER_PATH, {
    headers: {
      'User-Agent': 'its-battistar',
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
    },
  });

  const userData2 = await response2.json();

  if (!response2.ok) {
    logger.error('Error in getUserInfoFromOauthToken', {
      response: JSON.stringify(response2),
      userData2,
      provider,
    });
    throw new AppError('Authenticate again 5', StatusCodes.UNAUTHORIZED);
  }

  assertAjvValidationOrThrow<GithubUser2>(
    userData2,
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

  githubUser.firstName = userData2.login;
  githubUser.providerUid = userData2.id.toString();

  return githubUser;
};
