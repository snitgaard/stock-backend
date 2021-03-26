import { StockValue } from '../models/stock.model';
export const IStockServiceProvider = 'IStockServiceProvider';
export interface IStockService {
  newStock(id: string, stockName: string, initValue: number, currentValue: number, description: string): Promise<StockValue>;

  getStocks(): Promise<StockValue[]>;

  delete(id: string): Promise<void>;
}
