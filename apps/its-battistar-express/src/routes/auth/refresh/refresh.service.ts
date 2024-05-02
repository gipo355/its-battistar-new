export const getAuthTokenFromCookieOrHeader = ({
  token,
  bearer,
  priority = 'cookie',
  only,
}: {
  /**
   * The token from the cookie
   */
  token: string | undefined;
  /**
   * The token from the header
   * including the Bearer prefix
   */
  bearer: string | undefined;
  /**
   * The priority of the token if both are present.
   * default is cookie
   */
  priority?: 'cookie' | 'header';
  /**
   * if provided, only the token from the cookie or header will be checked
   */
  only?: 'cookie' | 'header';
}): {
  token: string;
  error: Error | null;
} => {
  if (!only && !token && !bearer) {
    return { token: '', error: new Error('No refresh token found') };
  }

  let tokenValue = '';

  // get the token
  if (priority === 'cookie' && token) {
    if (token) {
      tokenValue = token;
    } else if (bearer) {
      const [type, value] = bearer.split(' ');

      if (type !== 'Bearer') {
        return { token: '', error: new Error('Invalid token type in cookie') };
      }

      tokenValue = value;
    }
  } else {
    if (bearer) {
      const [type, value] = bearer.split(' ');

      if (type !== 'Bearer') {
        return { token: '', error: new Error('Invalid bearer token type') };
      }

      tokenValue = value;
    } else if (token) {
      tokenValue = token;
    }
  }

  return {
    token: tokenValue,
    error: null,
  };
};
