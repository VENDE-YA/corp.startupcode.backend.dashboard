import { Inject, Injectable } from '@nestjs/common';
import { ClientTCP } from '@nestjs/microservices';
import { CLIENT } from 'src/commons/const/generic.const';

@Injectable()
export class SecurityService {
  constructor(
    @Inject(CLIENT.SECURITY)
    private readonly client: ClientTCP,
  ) {}

  callFxValidateToken<TResult = any, TInput = any>(
    dto: TInput,
  ): Promise<TResult> {
    const pattern = {
      subjet: 'client-security',
      function: 'call-fx-validate-token',
    };
    return this.client.send<TResult, TInput>(pattern, dto).toPromise();
  }
}
