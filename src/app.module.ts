import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import configuration from './configs/configuration';
import { AppController } from './app.controller';
import { HeadersMiddleware } from './commons/middlewares';
import { HomeController } from './modules/home/home.controller';
import { HomeModule } from './modules/home/home.module';
import { EventModule } from './modules/event/event.module';
import { SecurityModule } from './commons/client/security/security.module';
import { EventsController } from './modules/event/event.controller';
import { FnHomeProductPeriodService, FnHomeSalePeriodService } from './modules/event/services';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
    }),
    SecurityModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        configService.get('client.security'),
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('mongodb'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([]),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ttl: config.get('http.throttle.ttl'),
        limit: config.get('http.throttle.limit'),
      }),
    }),
    HomeModule,
    EventModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HeadersMiddleware).forRoutes(HomeController);
  }
}
