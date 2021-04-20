import { StockValue } from '../models/stock.model';
export const IStockServiceProvider = 'IStockServiceProvider';

export interface IStockService {
  newStock(id: string, stockValue: StockValue): Promise<StockValue>;

  getStocks(): Promise<StockValue[]>;

  update(id: string, stock: StockValue): Promise<StockValue>;

  delete(id: string): Promise<void>;

}
