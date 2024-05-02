import type { ESocialStrategy } from '@its-battistar/shared-types';
import {
  ajvInstance,
  assertAjvValidationOrThrow,
} from '@its-battistar/shared-utils';
import { type Static, Type } from '@sinclair/typebox';
import { StatusCodes } from 'http-status-codes';

import { AppError } from './app-error';
import { logger } from './logger';

// TODO: refactor, too much code

// TODO: those util functions, together with services and utils all around the project,
// should be extracted to external lib to make it reusable like plugins
const githubUserSchema = Type.Object(
  {
    email: Type.String(),
    primary: Type.Boolean(),
    verified: Type.Boolean(),
  },
  { additionalProperties: true }
);
const githubUsersSchema = Type.Array(githubUserSchema);
type TGithubUsers = Static<typeof githubUsersSchema>;
const validateGithubUsers = ajvInstance.compile(githubUsersSchema);

const githubUserSchema2 = Type.Object({
  login: Type.String(),
  id: Type.Number(),
});
type GithubUser2 = Static<typeof githubUserSchema2>;
const validateGithubUser2 = ajvInstance.compile(githubUserSchema2);

interface ReturnedUser {
  email: string;
  firstName: string;
  providerUid: string;
}

const GITHUB_CLIENT_ADDRESS = 'https://api.github.com';
const GITHUB_CLIENT_USER_PATH = `${GITHUB_CLIENT_ADDRESS}/user`;
const GITHUB_CLIENT_EMAILS_PATH = `${GITHUB_CLIENT_USER_PATH}/emails`;

export const getGithubUserInfoFromOauthTokenFetch = async (
  token: string,
  strategy: keyof typeof ESocialStrategy
): Promise<ReturnedUser | null> => {
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

  const githubUser: ReturnedUser = {
    email: '',
    firstName: '',
    providerUid: '',
  };

  /**
   * ## Get user email from payload
   */
  console.log(userData);
  // [{
  //   email: '',
  //   primary: true,
  //   verified: true,
  //   visibility: 'private' // not in schema can be null
  // }]
  assertAjvValidationOrThrow<TGithubUsers>(
    userData,
    validateGithubUsers,
    new AppError('Authenticate again 3', StatusCodes.UNAUTHORIZED),
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
    new AppError('Authenticate again 6', StatusCodes.UNAUTHORIZED)
  );

  githubUser.firstName = userData2.login;
  githubUser.providerUid = userData2.id.toString();

  return githubUser;
};
