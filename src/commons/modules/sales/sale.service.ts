import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Sales } from '../../schemas';
import { STATUS } from 'src/commons/const/generic.const';

@Injectable()
export class SaleService {
  private logger = new Logger(`::${SaleService.name}::`);

  constructor(
    @InjectModel(Sales.name) private readonly salesModel: Model<Sales>,
  ) {}

  async findProductsForPeriod(matchPeriod: any) {
    return await this.salesModel.aggregate([
      {
        $match: {
          'auditProperties.dateCreate': matchPeriod,
        },
      },
      {
        $unwind: '$details',
      },
      {
        $group: {
          _id: '$details.code',
          product: { $first: '$details.name' },
          sale_price: { $first: '$details.sale_price' },
          quantity: { $sum: '$details.quantity' },
          total_price: { $sum: '$details.total_price' },
        },
      },
      {
        $project: {
          _id: 0,
          code: '$_id',
          product: 1,
          sale_price: 1,
          quantity: 1,
          total_price: 1,
        },
      },
    ]);
  }

  async findSalesForDay(matchPeriod: any) {
    return await this.salesModel.aggregate([
      {
        $match: {
          'auditProperties.status.code': STATUS.SALE.REGISTER_TO_PRINT.VALUE,
          'auditProperties.dateUpdate': matchPeriod,
        },
      },
      {
        $project: {
          date: {
            $dateToString: {
              format: '%d%m%Y',
              date: '$auditProperties.dateUpdate',
            },
          },
          total_sale_price: 1,
        },
      },
      {
        $group: {
          _id: '$date',
          quantity: { $sum: 1 },
          total_price: { $sum: '$total_sale_price' },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
  }

  async findSalesForWeek(matchPeriod: any) {
    return await this.salesModel.aggregate([
      {
        $match: {
          'auditProperties.status.code': STATUS.SALE.REGISTER_TO_PRINT.VALUE,
          'auditProperties.dateUpdate': matchPeriod,
        },
      },
      {
        $project: {
          week: { $isoWeek: '$auditProperties.dateUpdate' },
          total_sale_price: 1,
        },
      },
      {
        $group: {
          _id: '$week',
          quantity: { $sum: 1 },
          total_price: { $sum: '$total_sale_price' },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
  }

  async findSalesForMonth(matchPeriod: any) {
    return await this.salesModel.aggregate([
      {
        $match: {
          'auditProperties.status.code': STATUS.SALE.REGISTER_TO_PRINT.VALUE,
          'auditProperties.dateUpdate': matchPeriod,
        },
      },
      {
        $project: {
          yearMonth: {
            $dateToString: {
              format: '%Y-%m',
              date: '$auditProperties.dateUpdate',
            },
          },
          total_sale_price: 1,
        },
      },
      {
        $group: {
          _id: '$yearMonth',
          quantity: { $sum: 1 },
          total_price: { $sum: '$total_sale_price' },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
  }
}
