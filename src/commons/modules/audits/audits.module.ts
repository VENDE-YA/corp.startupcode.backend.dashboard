import { Module } from '@nestjs/common';
import { AuditsService } from './audits.service';

@Module({
  imports: [],
  providers: [AuditsService],
  exports: [AuditsService],
})
export class AuditsModule {}
