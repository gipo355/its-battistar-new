import type { Static } from '@sinclair/typebox';
import { Type } from '@sinclair/typebox';

const githubUserSchema = Type.Object(
  {
    email: Type.String(),
    primary: Type.Boolean(),
    verified: Type.Boolean(),
    // visibility: Type.Optional(Type.String()), can be null
  },
  { additionalProperties: true }
);
export const githubUsersSchema = Type.Array(githubUserSchema);
export type TGithubUsers = Static<typeof githubUsersSchema>;

export const githubUserSchema2 = Type.Object({
  login: Type.String(),
  id: Type.Number(),
});
export type GithubUser2 = Static<typeof githubUserSchema2>;

export interface ReturnedGithubUser {
  email: string;
  firstName: string;
  providerUid: string;
}
