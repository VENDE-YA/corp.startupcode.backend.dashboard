import { Injectable } from '@nestjs/common';

@Injectable()
export class AuditsService {
  getAuditPropertiesForCreate(clientIp: string): any {
    const now = new Date();
    return {
      dateCreate: now,
      dateUpdate: null,
      recordActive: true,
      status: {
        code: 1,
        description: 'CREATED',
      },
      userUpdate: null,
      userCreate: clientIp,
    };
  }

  getAuditPropertiesForUpdate(clientIp?: string): any {
    const now = new Date();
    return {
      dateUpdate: now,
      status: {
        code: 2,
        description: 'UPDATED',
      },
      userUpdate: clientIp || null,
    };
  }
}
