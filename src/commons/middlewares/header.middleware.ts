import {
  Injectable,
  NestMiddleware,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express'; // O 'fastify' si usas Fastify

@Injectable()
export class HeadersMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const apiVersion = req.headers['api-version'];
    const guiid = req.headers['guiid'];
    const clientIp =
      req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress;

    if (!apiVersion) {
      throw new BadRequestException('Missing api-version header');
    }

    if (!guiid) {
      throw new BadRequestException('Missing guiid header');
    }

    req['apiVersion'] = apiVersion;
    req['guiid'] = guiid;
    req['clientIp'] = clientIp;

    next();
  }
}
