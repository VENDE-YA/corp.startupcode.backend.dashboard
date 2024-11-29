import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { SecurityService } from '../client/security/security.service';
import { CryptoService } from '../crypto/crypto.service';

@Injectable()
export class SecurityGuard implements CanActivate {
  private logger = new Logger(SecurityGuard.name);

  constructor(
    private readonly securityService: SecurityService,
    private readonly cryptoService: CryptoService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const requestUnauthorized = request.headers.authorization;

    if (requestUnauthorized == undefined || requestUnauthorized == null) {
      throw new UnauthorizedException('not exist token in header');
    }

    const token = requestUnauthorized.split(' ')[1];
    try {
      const decryptToken = await this.cryptoService.decrypt(token);
      const { idUser } = await this.securityService.callFxValidateToken({
        token: decryptToken,
      });

      if (idUser.length == 0) {
        throw new UnauthorizedException('not valid token in database');
      }
      /*const configStudent = await this.securityService.callFxConfigStudent({
            idUser,
        });*/
      request.userSession = {
        idUser,
      };
      return true;
    } catch (error) {
      this.logger.error('securityguard:canactivate:error', error);
      return false;
    }
  }
}
