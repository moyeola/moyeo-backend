import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

type DevTokenPayload = {
  type: 'developer';
  developerName: string;
};

@Injectable()
export class DevAuthService {
  createDevToken(developerName: string) {
    const payload: DevTokenPayload = {
      type: 'developer',
      developerName,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      issuer: 'moyeo.la',
      subject: 'developer',
    });

    return token;
  }

  verifyDevToken(token: string) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET, {
        issuer: 'moyeo.la',
        subject: 'developer',
      }) as DevTokenPayload;

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
