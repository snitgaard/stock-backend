import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IStockService } from '../primary-ports/stock.service.interface';
import { StockValue } from '../models/stock.model';
import {Stock} from '../../infrastructure/stock.entity';

@Injectable()
export class StockService implements IStockService {
  alLStocks: StockValue[] = [];
  constructor(
    @InjectRepository(Stock)
    private stockRepository: Repository<Stock>,
  ) {}

  async delete(id: string): Promise<void> {
    await this.stockRepository.delete({id: id});
    this.alLStocks = this.alLStocks.filter((s) => s.id !== id);
  }

  async getStocks(): Promise<StockValue[]> {
    const stocks = await this.stockRepository.find();
    const stockEntities: StockValue[] = JSON.parse(JSON.stringify(stocks));
    return stockEntities;
  }

  async newStock(stockValue: StockValue): Promise<StockValue> {
    const stockDb = await this.stockRepository.findOne({
      stockName: stockValue.stockName,
    });
    if (!stockDb)
    {
      let stock = this.stockRepository.create();
      stock.id = stockValue.id;
      stock.stockName = stockValue.stockName;
      stock.initValue = stockValue.initValue;
      stock.currentValue = stockValue.currentValue;
      stock.description = stockValue.description;
      stock = await this.stockRepository.save(stock);
      return {
        id: '' + stock.id,
        stockName: stock.stockName,
        initValue: stock.initValue,
        currentValue: stock.currentValue,
        description: stock.description,
      };
    }
    if(stockDb.id)
    {
      return {
        id: stockDb.id,
        stockName: stockDb.stockName,
        initValue: stockDb.initValue,
        currentValue: stockDb.currentValue,
        description: stockDb.description,
      };
    }
    else {
      throw new Error('Stock already exists');
    }
  }
}
