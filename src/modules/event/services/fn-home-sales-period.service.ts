import { Injectable, Logger } from '@nestjs/common';
import { HomeSaleService } from 'src/commons/modules/home-sale/home-sale.service';
import { SaleService } from 'src/commons/modules/sales/sale.service';
import * as interfaces from '../interfaces';
import { PERIOD } from 'src/commons/const/generic.const';

@Injectable()
export class FnHomeSalePeriodService {
  private logger = new Logger(`::${FnHomeSalePeriodService.name}::`);

  constructor(
    private readonly saleService: SaleService,
    private readonly homeSaleService: HomeSaleService,
  ) {}

  async execute(payload: interfaces.IDashboardHomeSalePeriod) {
    this.logger.debug(`execute:payload`, JSON.stringify(payload));
    const now = new Date();
    const timezoneOffset = now.getTimezoneOffset();
    const currentYear = this.getYear(now);
    const { day, week, month } = this.getFormattedDate(now);

    let homeSaleCurrentYear = await this.homeSaleService.findHomeSalesForYear(
      currentYear,
    );
    if (!homeSaleCurrentYear) {
      homeSaleCurrentYear = await this.homeSaleService.createHomeSaleYearHeader(
        currentYear,
        '',
      );
    }

    const [saleForDay, saleForWeek, saleForMonth] = await Promise.all([
      this.saleService.findSalesForDay(this.getMatchForDay(now, timezoneOffset)),
      this.saleService.findSalesForWeek(this.getMatchForWeek(now, timezoneOffset)),
      this.saleService.findSalesForMonth(this.getMatchForMonth(now, timezoneOffset)),
    ]);

    this.logger.debug(`saleForDay ${JSON.stringify(saleForDay)}`);

    const [
      operationDayBulkWrite,
      operationWeekBulkWrite,
      operationMonthBulkWrite,
    ] = await Promise.all([
      this.getBulkWritePeriodOperation(
        PERIOD.DAY,
        day,
        homeSaleCurrentYear._id.toString(),
        saleForDay,
      ),
      this.getBulkWritePeriodOperation(
        PERIOD.WEEK,
        week,
        homeSaleCurrentYear._id.toString(),
        saleForWeek,
      ),
      this.getBulkWritePeriodOperation(
        PERIOD.MONTH,
        month,
        homeSaleCurrentYear._id.toString(),
        saleForMonth,
      ),
    ]);

    await this.homeSaleService.updateRecords([
      ...operationDayBulkWrite,
      ...operationWeekBulkWrite,
      ...operationMonthBulkWrite,
    ]);
  }

  private getYear(now: Date) {
    return now.getFullYear();
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
    homeSaleId: string,
    periodDay: any[],
  ) {
    const bulkOpsInsert = periodDay.map((update) => [
      {
        updateOne: {
          filter: {
            _id: homeSaleId,
            'details.period': period,
          },
          update: {
            $pull: {
              'details.$.records': { period_format },
            },
          },
        },
      },
      {
        updateOne: {
          filter: {
            _id: homeSaleId,
            'details.period': period,
          },
          update: {
            $addToSet: {
              'details.$.records': {
                period,
                period_format: period_format,
                quantity: update.quantity,
                total_price: update.total_price,
              },
            },
          },
        },
      },
    ]);

    return bulkOpsInsert.flat();
  }

  private getMatchForDay(now: Date, timezoneOffset: number) {
    const startDate = new Date(now.setHours(0, 0, 0, 0));
    const endDate = new Date(now.setHours(23, 59, 59, 999));
    //startDate.setMinutes(startDate.getMinutes() - timezoneOffset);
    //endDate.setMinutes(endDate.getMinutes() - timezoneOffset);  
    return { $gte: startDate, $lte: endDate };
  }

  private getMatchForWeek(now: Date, timezoneOffset: number) {
    const dayOfWeek = now.getDay();
  
    const startDate = new Date(now);
    startDate.setMinutes(startDate.getMinutes() - timezoneOffset);
    
    startDate.setDate(now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
    startDate.setHours(0, 0, 0, 0);
  
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    endDate.setHours(23, 59, 59, 999);
    
    //endDate.setMinutes(endDate.getMinutes() - timezoneOffset);
  
    return { $gte: startDate, $lte: endDate };
  }

  private getMatchForMonth(now: Date, timezoneOffset: number) {
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    endDate.setHours(23, 59, 59, 999);
    //startDate.setMinutes(startDate.getMinutes() - timezoneOffset);
    //endDate.setMinutes(endDate.getMinutes() - timezoneOffset);  
    return { $gte: startDate, $lte: endDate };
  }
}
