import { Injectable, Logger } from '@nestjs/common';

import * as express from 'express';

import * as commonsExceptions from 'src/commons/exceptions';
import * as commonsDtos from 'src/commons/dto';
import { HomeProductService } from 'src/commons/modules/home-product/home-product.service';
import { PERIOD } from 'src/commons/const/generic.const';

@Injectable()
export class FnProductsService {
  private logger = new Logger(`::${FnProductsService.name}::`);
  constructor(private readonly homeProductService: HomeProductService) {}

  async execute(request: express.Request, filter: string) {
    const { guiid, clientIp }: any = request;
    const { day, week, month } = this.getFormattedDate();
    this.logger.debug(`::execute::parameters::${guiid}`);

    const findHomeProductsForYear: any =
      await this.homeProductService.findHomeProductsForYear(this.getYear());

    if (!findHomeProductsForYear) {
      return <commonsDtos.ResponseDto>{
        message: 'Processo exitoso',
        operation: `::${FnProductsService.name}::execute`,
        data: [[], [], []],
      };
    }

    const { recordDay, recordWeek, recordMonth } = this.getSaleForPeriod(
      findHomeProductsForYear.details,
      day,
      week,
      month,
    );

    return <commonsDtos.ResponseDto>{
      message: 'Processo exitoso',
      operation: `::${FnProductsService.name}::execute`,
      data: [recordDay, recordWeek, recordMonth],
    };
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

    return { recordDay, recordWeek, recordMonth };
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

  private getYear() {
    const currentYear = new Date().getFullYear();
    return currentYear;
  }
}
