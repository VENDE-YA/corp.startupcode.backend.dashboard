import { Injectable, Logger } from '@nestjs/common';

import * as express from 'express';

import * as commonsExceptions from 'src/commons/exceptions';
import * as commonsDtos from 'src/commons/dto';
import { HomeSaleService } from 'src/commons/modules/home-sale/home-sale.service';
import { PERIOD } from 'src/commons/const/generic.const';

@Injectable()
export class FnSalesService {
  private logger = new Logger(`::${FnSalesService.name}::`);
  constructor(private readonly homeSaleService: HomeSaleService) {}

  async execute(request: express.Request) {
    const { guiid, clientIp }: any = request;
    const { day, week, month } = this.getFormattedDate();
    this.logger.debug(`::execute::parameters::${guiid}`);

    const findHomeSalesForYear: any =
      await this.homeSaleService.findHomeSalesForYear(this.getYear());
    if (!findHomeSalesForYear) {
      return <commonsDtos.ResponseDto>{
        message: 'Processo exitoso',
        operation: `::${FnSalesService.name}::execute`,
        data: [
          this.calculateSale([], PERIOD.DAY),
          this.calculateSale([], PERIOD.WEEK),
          this.calculateSale([], PERIOD.MONTH),
        ],
      };
    }

    const { recordDay, recordWeek, recordMonth } = this.getSaleForPeriod(
      findHomeSalesForYear.details,
      day,
      week,
      month,
    );

    return <commonsDtos.ResponseDto>{
      message: 'Processo exitoso',
      operation: `::${FnSalesService.name}::execute`,
      data: [recordDay, recordWeek, recordMonth],
    };
  }

  private getYear() {
    const currentYear = new Date().getFullYear();
    return currentYear;
  }

  private getSaleForPeriod(
    details: any[],
    day: string,
    week: string,
    month: string,
  ) {
    const { records: recordsDay } = details.find(
      (detail) => detail.period === PERIOD.DAY,
    );
    const { records: recordsWeek } = details.find(
      (detail) => detail.period === PERIOD.WEEK,
    );
    const { records: recordsMonth } = details.find(
      (detail) => detail.period == PERIOD.MONTH,
    );
    const recordDay = recordsDay.filter(
      (record: { period_format: string }) => record.period_format == day,
    );
    const recordWeek = recordsWeek.filter(
      (record: { period_format: string }) => record.period_format == week,
    );
    const recordMonth = recordsMonth.filter(
      (record: { period_format: string }) => record.period_format == month,
    );

    return {
      recordDay: recordDay.length > 0 ? recordDay[0] : this.calculateSale([], PERIOD.DAY), 
      recordWeek: recordWeek.length > 0 ? recordWeek[0] : this.calculateSale([], PERIOD.WEEK),
      recordMonth: recordMonth.length > 0 ? recordMonth[0] : this.calculateSale([], PERIOD.MONTH),
    };
  }

  private getFormattedDate(): { day: string; week: string; month: string } {
    const now = new Date();

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

  private calculateSale(records: any, period: string) {
    let totals = records.reduce(
      (totals: { quantity: number; total_price: number }, detail: any) => {
        totals.quantity += 1;
        totals.total_price += detail.total_price;
        return totals;
      },
      { quantity: 0, total_price: 0 },
    );
    return { ...totals, period };
  }
}
