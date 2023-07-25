import { PostAuthGoogleRes } from 'moyeo-object';

export class GoogleAuthResDto implements PostAuthGoogleRes {
  accessToken: string;
  isNewUser?: boolean;
}
