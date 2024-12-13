import { Controller, UseFilters } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import * as services from './services';
import * as interfaces from './interfaces';
import { AllExceptionsFilter } from 'src/commons/exceptions';

@Controller('events')
export class EventsController {
  constructor(
    private readonly fnHomeProductPeriodService: services.FnHomeProductPeriodService,
    private readonly fnHomeSalePeriodService: services.FnHomeSalePeriodService,
  ) {}

  //@EventPattern('event.dashboard.home-sale-period')
  @UseFilters(new AllExceptionsFilter())
  @MessagePattern({
    subjet: 'client-dashboard',
    function: 'call-fx-home-sale-period',
  })
  async handleEventDashboardHomeSalePeriod(
    payload: interfaces.IDashboardHomeSalePeriod,
  ) {
    await this.fnHomeSalePeriodService.execute(payload);
  }

  //@EventPattern('event.dashboard.home-product-period')
  @UseFilters(new AllExceptionsFilter())
  @MessagePattern({
    subjet: 'client-dashboard',
    function: 'call-fx-home-product-period',
  })
  async handleEventDashboardHomeProductPeriod(
    payload: interfaces.IDashboardHomeProductPeriod,
  ) {
    await this.fnHomeProductPeriodService.execute(payload);
  }
}
