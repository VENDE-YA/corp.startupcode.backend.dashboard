import { Injectable, Logger } from '@nestjs/common';
import { HomeProductService } from 'src/commons/modules/home-product/home-product.service';
import { SaleService } from 'src/commons/modules/sales/sale.service';
import * as interfaces from '../interfaces';
import { PERIOD } from 'src/commons/const/generic.const';

@Injectable()
export class FnHomeProductPeriodService {
  private logger = new Logger(`::${FnHomeProductPeriodService.name}::`);

  constructor(
    private readonly saleService: SaleService,
    private readonly homeProductService: HomeProductService,
  ) {}

  async execute(payload: interfaces.IDashboardHomeProductPeriod) {
    this.logger.debug(`execute:payload`, JSON.stringify(payload));
    const now = new Date();
    const timezoneOffset = now.getTimezoneOffset();
    const currentYear = this.getYear(now);
    const { guiid, operation } = payload;
    const { day, week, month } = this.getFormattedDate(now);

    let homeProductCurrentYear =
      await this.homeProductService.findHomeProductsForYear(currentYear);
    if (!homeProductCurrentYear) {
      homeProductCurrentYear =
        await this.homeProductService.createHomeProductYearHeader(
          currentYear,
          '',
        );
    }

    const [productsForDay, productsForWeek, productsForMonth] =
      await Promise.all([
        this.saleService.findProductsForPeriod(this.getMatchForDay(now, timezoneOffset)),
        this.saleService.findProductsForPeriod(this.getMatchForWeek(now, timezoneOffset)),
        this.saleService.findProductsForPeriod(this.getMatchForMonth(now, timezoneOffset)),
      ]);
    
      const [
      operationDayBulkWrite,
      operationWeekBulkWrite,
      operationMonthBulkWrite,
    ] = await Promise.all([
      this.getBulkWritePeriodOperation(
        PERIOD.DAY,
        day,
        homeProductCurrentYear._id.toString(),
        productsForDay,
        operation,
      ),
      this.getBulkWritePeriodOperation(
        PERIOD.WEEK,
        week,
        homeProductCurrentYear._id.toString(),
        productsForWeek,
        operation,
      ),
      this.getBulkWritePeriodOperation(
        PERIOD.MONTH,
        month,
        homeProductCurrentYear._id.toString(),
        productsForMonth,
        operation,
      ),
    ]);

    await this.homeProductService.updateRecords([
      ...operationDayBulkWrite,
      ...operationWeekBulkWrite,
      ...operationMonthBulkWrite,
    ]);
  }

  private getYear(now: Date) {
    return now.getFullYear();
  }

  private getMatchForDay(now: Date, timezoneOffset: number) {
    const startDate = new Date(now.setHours(0, 0, 0, 0));
    const endDate = new Date(now.setHours(23, 59, 59, 999));
    startDate.setMinutes(startDate.getMinutes() - timezoneOffset);
    endDate.setMinutes(endDate.getMinutes() - timezoneOffset);  
    return { $gte: startDate, $lte: endDate };
  }

  private getMatchForWeek(now: Date, timezoneOffset: number) {
    const dayOfWeek = now.getDay();
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - dayOfWeek + 1);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    endDate.setHours(23, 59, 59, 999);
    startDate.setMinutes(startDate.getMinutes() - timezoneOffset);
    endDate.setMinutes(endDate.getMinutes() - timezoneOffset);  
    return { $gte: startDate, $lte: endDate };
  }

  private getMatchForMonth(now: Date, timezoneOffset: number) {
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    endDate.setHours(23, 59, 59, 999);
    startDate.setMinutes(startDate.getMinutes() - timezoneOffset);
    endDate.setMinutes(endDate.getMinutes() - timezoneOffset);  
    return { $gte: startDate, $lte: endDate };
  }

  private getFormattedDate(now: Date): {
    day: string;
    week: string;
    month: string;
  } {
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const formattedDay = `${day}${month}${year}`;

    const startOfYear = new Date(year, 0, 1);
    const diffInTime = now.getTime() - startOfYear.getTime();
    const daysInYear = Math.floor(diffInTime / (1000 * 3600 * 24));
    const week = Math.ceil((daysInYear + 1) / 7);
    const formattedWeek = `${year}${String(week).padStart(2, '0')}`;

    const months = [
      'ENE',
      'FEB',
      'MAR',
      'ABR',
      'MAY',
      'JUN',
      'JUL',
      'AGO',
      'SEP',
      'OCT',
      'NOV',
      'DIC',
    ];
    const formattedMonth = months[now.getMonth()];

    return {
      day: formattedDay,
      week: formattedWeek,
      month: formattedMonth,
    };
  }

  private getBulkWritePeriodOperation(
    period: string,
    period_format: string,
    homeProductId: string,
    periodDay: any[],
    operation: string,
  ) {

    const baseFilter = {
      _id: homeProductId,
      'details.period': period,
    };

    const pullOperation = {
      updateOne: {
        filter: baseFilter,
        update: {
          $pull: {
            'details.$.records': { period_format },
          },
        },
      },
    };

    if (operation === 'DELETE') {
      const bulkOpsDelete =
        periodDay.length > 0
          ? periodDay.map((update) => [
              pullOperation,
              {
                updateOne: {
                  filter: baseFilter,
                  update: {
                    $addToSet: {
                      'details.$.records': {
                        period,
                        period_format: period_format,
                        quantity: update.quantity,
                        total_price: update.total_price,
                        code: update.code,
                        product: update.product,
                      },
                    },
                  },
                },
              },
            ])
          : [pullOperation];

      return bulkOpsDelete.flat();
    }

    const bulkOpsInsert = periodDay.map((update) => [
      {
        updateOne: {
          filter: {
            ...baseFilter,
          },
          update: {
            $pull: {
              'details.$.records': { code: update.code },
            },
          },
        },
      },
      {
        updateOne: {
          filter: {
            ...baseFilter,
          },
          update: {
            $addToSet: {
              'details.$.records': {
                period,
                period_format: period_format,
                quantity: update.quantity,
                total_price: update.total_price,
                code: update.code,
                product: update.product,
              },
            },
          },
        },
      },
    ]);

    return bulkOpsInsert.flat();
  }
}
