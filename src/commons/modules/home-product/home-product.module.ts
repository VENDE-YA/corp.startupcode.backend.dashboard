import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HomeProducts, HomeProductsSchema } from '../../schemas';
import { AuditsModule } from '../audits/audits.module';
import { HomeProductService } from './home-product.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HomeProducts.name, schema: HomeProductsSchema },
    ]),
    AuditsModule,
  ],
  providers: [HomeProductService],
  exports: [HomeProductService],
})
export class HomeProductModule {}
