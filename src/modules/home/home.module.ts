import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { HomeController } from './home.controller';
import { HomeSaleModule } from 'src/commons/modules/home-sale/home-sale.module';
import * as services from './services';
import { HomeProductModule } from 'src/commons/modules/home-product/home-product.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        global: true,
        secret: config.get('jwt.secret'),
        signOptions: { expiresIn: '60s' },
      }),
    }),
    HomeSaleModule,
    HomeProductModule,
  ],
  controllers: [HomeController],
  providers: [services.FnProductsService, services.FnSalesService],
})
export class HomeModule {}
