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

  async getStock(id: string): Promise<StockValue> {
    const stockDb = await this.stockRepository.findOne({id: id})
    const stockValue: StockValue = {
      id: stockDb.id,
      currentValue: stockDb.currentValue,
      initValue: stockDb.initValue,
      description: stockDb.description,
      stockName: stockDb.stockName
    };
    return stockValue;
  }

  async newStock(id: string, stockValue: StockValue): Promise<StockValue>
  {
    const stockDb = await this.stockRepository.findOne({
      stockName: stockValue.stockName,
    });
    if (!stockDb)
    {
      let stock = this.stockRepository.create();
      stock.id = id;
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
    if(stockDb.id === id)
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
