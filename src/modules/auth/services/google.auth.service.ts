import { BadRequestException, Injectable } from '@nestjs/common';
import { google } from 'googleapis';

@Injectable()
export class GoogleAuthService {
    async getTokens(code: string, redirectUri?: string) {
        const oAuth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            redirectUri,
        );

        try {
            const tokens = await oAuth2Client.getToken({
                code: code,
                redirect_uri: redirectUri,
            });
            return {
                access_token: tokens.tokens.access_token,
                refresh_token: tokens.tokens.refresh_token,
            };
        } catch (err) {
            console.log(err);
        }
    }

    async getUserProfile(
        tokens: {
            access_token: string;
            refresh_token: string;
        },
        redirectUri?: string,
    ) {
        const oauth2 = this.getGoogleClient(
            {
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token,
            },
            redirectUri,
        );

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

    getGoogleClient(
        tokens: {
            access_token: string;
            refresh_token: string;
        },
        redirectUri?: string,
    ) {
        const oAuth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            redirectUri || process.env.GOOGLE_CLIENT_CALLBACKS,
        );

        oAuth2Client.setCredentials({
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
        });

        const oauth2 = google.oauth2({
            auth: oAuth2Client,
            version: 'v2',
        });

        return oauth2;
    }
}
