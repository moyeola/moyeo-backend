import { BadRequestException, Injectable } from '@nestjs/common';
import { google } from 'googleapis';

@Injectable()
export class GoogleAuthService {
  async getUserProfile(token: string) {
    const oauth2 = this.getGoogleClient(token);

    try {
      const res = await oauth2.userinfo.get();
      const { data } = res;

      return data;
    } catch (err) {
      if ('response' in err) {
        const { response } = err;
        if (response.status === 401) {
          throw new BadRequestException({
            code: 'invalid_token',
          });
        }
      }

      throw err;
    }
  }

  getGoogleClient(token: string) {
    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_CLIENT_CALLBACKS,
    );

    oAuth2Client.setCredentials({
      access_token: token,
    });

    const oauth2 = google.oauth2({
      auth: oAuth2Client,
      version: 'v2',
    });

    return oauth2;
  }
}
