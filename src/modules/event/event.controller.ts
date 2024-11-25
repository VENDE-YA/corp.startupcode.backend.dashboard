import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import * as services from './services';
import * as interfaces from './interfaces';

@Controller('events')
export class EventsController {
  constructor(
    private readonly fnHomeProductPeriodService: services.FnHomeProductPeriodService,
    private readonly fnHomeSalePeriodService: services.FnHomeSalePeriodService,
  ) {}

  @EventPattern('event.dashboard.home-sale-period')
  async handleEventDashboardHomeSalePeriod(
    payload: interfaces.IDashboardHomeSalePeriod,
  ) {
    await this.fnHomeSalePeriodService.execute(payload);
  }
  @EventPattern('event.dashboard.home-product-period')
  async handleEventDashboardHomeProductPeriod(
    payload: interfaces.IDashboardHomeProductPeriod,
  ) {
    await this.fnHomeProductPeriodService.execute(payload);
  }
}
