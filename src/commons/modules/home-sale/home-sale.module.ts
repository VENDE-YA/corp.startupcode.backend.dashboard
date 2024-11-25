import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HomeSales, HomeSalesSchema } from '../../schemas';
import { AuditsModule } from '../audits/audits.module';
import { HomeSaleService } from './home-sale.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HomeSales.name, schema: HomeSalesSchema },
    ]),
    AuditsModule,
  ],
  providers: [HomeSaleService],
  exports: [HomeSaleService],
})
export class HomeSaleModule {}
