import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { AccessTokenPayload } from './types/accessTokenPayload';

@Injectable()
export class TokenService {
  createAccessToken(userId: number, permissions: string[]) {
    const payload: AccessTokenPayload = {
      type: 'user',
      userId: userId,
      version: 'v1',
      permissions: permissions,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      issuer: 'moyeo.la',
      subject: 'user',
    });

    return token;
  }

  verifyAccessToken(token: string) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET, {
        issuer: 'moyeo.la',
        subject: 'user',
      }) as AccessTokenPayload;

      return {
        isValid: true,
        payload,
      };
    } catch (err) {
      return {
        isValid: false,
      };
    }
  }
}
