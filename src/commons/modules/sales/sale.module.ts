import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Sales, SalesSchema } from '../../schemas';
import { AuditsModule } from '../audits/audits.module';
import { SaleService } from './sale.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Sales.name, schema: SalesSchema }]),
    AuditsModule,
  ],
  providers: [SaleService],
  exports: [SaleService],
})
export class SaleModule {}
