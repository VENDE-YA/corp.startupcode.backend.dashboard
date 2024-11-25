import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HomeSales } from '../../schemas';
import { AuditsService } from '../audits/audits.service';

@Injectable()
export class HomeSaleService {
  constructor(
    private readonly auditsService: AuditsService,
    @InjectModel(HomeSales.name)
    private readonly homeSalesModel: Model<HomeSales>,
  ) {}

  async findHomeSalesForYear(year: number) {
    return await this.homeSalesModel.findOne({ year });
  }

  async createHomeSaleYearHeader(year: number, guiid: string) {
    const getAuditGenerateForCreate =
      this.auditsService.getAuditPropertiesForCreate('');
    return await this.homeSalesModel.create({
      year,
      guiid,
      details: [
        { period: 'Dia', record: [] },
        { period: 'Semana', record: [] },
        { period: 'Mes', record: [] },
      ],
      auditProperties: getAuditGenerateForCreate,
    });
  }

  async updateRecords(bulkWrite: any[]) {
    await this.homeSalesModel.bulkWrite(bulkWrite);
  }
}
