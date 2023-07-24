import { UserEntity } from '@opize/calendar2notion-object';
import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      token?: any;
    }

    interface Response {
      sse?: any;
    }
  }
}
