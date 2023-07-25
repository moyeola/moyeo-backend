import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';

@Injectable()
export class GoogleAuthService {
  async getUserProfile(token: string) {
    const oauth2 = this.getGoogleClient(token);

    const res = await oauth2.userinfo.get();
    const { data } = res;

    return data;
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
