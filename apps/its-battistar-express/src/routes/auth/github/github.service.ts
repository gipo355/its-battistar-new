import {
  // ClientCredentials,
  // ResourceOwnerPassword,
  AuthorizationCode,
} from 'simple-oauth2';

import { e } from '../../../environments';

export const oauthGithubClient = new AuthorizationCode({
  client: {
    id: e.GITHUB_CLIENT_ID,
    secret: e.GITHUB_CLIENT_SECRET,
  },
  auth: {
    tokenHost: 'https://github.com',
    tokenPath: '/login/oauth/access_token',
    authorizePath: '/login/oauth/authorize',
  },
});

// Authorization uri definition
export const githubAuthorizationUri = oauthGithubClient.authorizeURL({
  redirect_uri: e.GITHUB_CALLBACK_URL,
  scope: ['user:email'], // BUG: if i put a variable here it won't work why??
  state: e.GITHUB_STATE,
});
