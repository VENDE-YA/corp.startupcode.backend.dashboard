import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HomeProducts } from '../../schemas';
import { AuditsService } from '../audits/audits.service';

@Injectable()
export class HomeProductService {
  constructor(
    private readonly auditsService: AuditsService,
    @InjectModel(HomeProducts.name)
    private readonly homeProductsModel: Model<HomeProducts>,
  ) {}

  async findHomeProductsForYear(year: number) {
    return await this.homeProductsModel.findOne({ year });
  }

  async createHomeProductYearHeader(year: number, guiid: string) {
    const getAuditGenerateForCreate =
      this.auditsService.getAuditPropertiesForCreate('');
    return await this.homeProductsModel.create({
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
    await this.homeProductsModel.bulkWrite(bulkWrite);
  }
}
