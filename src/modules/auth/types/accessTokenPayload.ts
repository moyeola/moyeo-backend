export type AccessTokenPayload = {
  userId: number;
  type: 'user';
  version: 'v1';
  permissions: string[];
};
