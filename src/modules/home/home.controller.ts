import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  Param,
  Query,
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Request } from 'express';

import * as commonsDto from 'src/commons/dto';
import * as commonsExceptions from 'src/commons/exceptions';
import * as services from './services';

@Controller('home')
@ApiTags('HOME')
export class HomeController {
  constructor(
    private readonly fnProductsService: services.FnProductsService,
    private readonly fnSalesService: services.FnSalesService,
  ) {}

  @UseGuards(ThrottlerGuard)
  @Get('/v1.0/sales')
  @ApiCreatedResponse({
    description: 'The sales has been successfully created list.',
    type: commonsDto.ResponseDto,
  })
  @ApiConflictResponse({
    description: 'The sales has been failed by conflict created list',
  })
  @ApiInternalServerErrorResponse({
    description: 'The sales has been failed by created list.',
  })
  sales(@Req() request: Request): Promise<commonsDto.ResponseDto> {
    return this.fnSalesService.execute(request);
  }

  @UseGuards(ThrottlerGuard)
  @Get('/v1.0/products')
  @ApiCreatedResponse({
    description: 'The sales has been successfully created list.',
    type: commonsDto.ResponseDto,
  })
  @ApiConflictResponse({
    description: 'The sales has been failed by conflict created list',
  })
  @ApiInternalServerErrorResponse({
    description: 'The sales has been failed by created list.',
  })
  products(
    @Req() request: Request,
    @Query('filter') filter: string,
  ): Promise<commonsDto.ResponseDto> {
    return this.fnProductsService.execute(request, filter);
  }
}
