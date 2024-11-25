import { InternalServerErrorException } from '@nestjs/common';

export class GenerateTokenInternalException extends InternalServerErrorException {
  constructor() {
    super(`${GenerateTokenInternalException.name}`);
  }
}

export class GenerateHashKeysInternalException extends InternalServerErrorException {
  constructor() {
    super(`${GenerateHashKeysInternalException.name}`);
  }
}

export class RegisterSecurityInternalException extends InternalServerErrorException {
  constructor() {
    super(`${RegisterSecurityInternalException.name}`);
  }
}

export class RegisterHashInternalException extends InternalServerErrorException {
  constructor() {
    super(`${RegisterHashInternalException.name}`);
  }
}

export class DeleteTokenInSecurityException extends InternalServerErrorException {
  constructor() {
    super(`${DeleteTokenInSecurityException.name}`);
  }
}
