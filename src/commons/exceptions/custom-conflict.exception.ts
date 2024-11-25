import { ConflictException } from '@nestjs/common';

export class InvalidCredentialsEmailCustomException extends ConflictException {
  constructor(customCode: string) {
    super(`El correo ingresado no existe en la base de datos [${customCode}`);
  }
}

export class InvalidCredentialsPasswordCustomException extends ConflictException {
  constructor(customCode: string) {
    super(`Parece que esta contraseña no es la correcta [${customCode}`);
  }
}

export class InvalidEmailCustomException extends ConflictException {
  constructor(customCode: string) {
    super(
      `La dirección de correo electrónico del destinatario no es válida [${customCode}`,
    );
  }
}

export class PendingToRegisterAccountCustomException extends ConflictException {
  constructor(customCode: string) {
    super(
      `El usuario tiene un registro pendiente, por favor debe completar el flujo. [${customCode}`,
    );
  }
}

export class InvalidHashCustomException extends ConflictException {
  constructor(originException: string) {
    super(`hash incorrectos o vencidos [${originException}`);
  }
}

export class InvalidValidateCodeCustomException extends ConflictException {
  constructor(originException: string) {
    super(`Código de validación de correo incorrecto [${originException}`);
  }
}

export class ExistStudentCustomException extends ConflictException {
  constructor(customCode: string) {
    super(
      `Por favor, usa el correo para iniciar sesión o crea uno nuevo [${customCode}`,
    );
  }
}

export class ExistStudentRegisterPendingCustomException extends ConflictException {
  constructor(customCode: string) {
    super(
      `Por favor, debe realizar la verificación de su cuenta para poder registrarla [${customCode}`,
    );
  }
}

export class NotExistStudentRecoveryCustomException extends ConflictException {
  constructor(customCode: string) {
    super(`El correo colocado no está registrado [${customCode}`);
  }
}

export class NotExistUniversityRegisterCustomException extends ConflictException {
  constructor(customCode: string) {
    super(`Los datos universitarios no existen [${customCode}`);
  }
}

export class NotMatchStudentCustomException extends ConflictException {
  constructor(customCode: string) {
    super(`Los datos brindados tiene un error de codificacion [${customCode}`);
  }
}
