import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IStockServiceProvider } from '../core/primary-ports/stock.service.interface';
import { StockService } from '../core/services/stock.service';
import { StockGateway } from './gateways/stock.gateway';
import {Stock} from '../infrastructure/stock.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Stock])],
  providers:
    [
      StockGateway,
      {
        provide: IStockServiceProvider,
        useClass: StockService
      }
    ],
})
export class StockModule {}
