import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

import * as services from './services';
import { EventsController } from './event.controller';
import { SaleModule } from 'src/commons/modules/sales/sale.module';
import { HomeSaleModule } from 'src/commons/modules/home-sale/home-sale.module';
import { HomeProductModule } from 'src/commons/modules/home-product/home-product.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    SaleModule,
    HomeSaleModule,
    HomeProductModule
  ],
  controllers: [EventsController],
  providers: [
    services.FnHomeProductPeriodService,
    services.FnHomeSalePeriodService,
  ],
})
export class EventModule {}
