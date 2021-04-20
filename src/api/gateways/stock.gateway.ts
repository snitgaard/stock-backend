import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Inject } from '@nestjs/common';
import { IStockService, IStockServiceProvider } from '../../core/primary-ports/stock.service.interface';
import {StockDTO} from '../dto/stock.dto';
import {StockValue} from '../../core/models/stock.model';
import {Socket} from 'socket.io';

@WebSocketGateway()
export class StockGateway {
  constructor(@Inject(IStockServiceProvider) private stockService: IStockService)
  {
  }
  @WebSocketServer() server;

  @SubscribeMessage('stock')
  async handleStockEvent(
    @MessageBody() stockValue: StockValue,
    @ConnectedSocket() stock: Socket,
  ): Promise<void> {
    try {
      const stockClient = await this.stockService.newStock(stock.id, stockValue);
      const stockClients = await this.stockService.getStocks();
      const stockDTO: StockDTO = {
        stocks: stockClients,
        stock: stockClient
      };
      stock.emit('stockDTO', stockDTO);
      this.server.emit('stocks', stockClients);
    } catch(e) {
      console.log("Didnt create")
    }
  }
  @SubscribeMessage('updateStock')
  async handleUpdateStockEvent(
      @MessageBody() stockValue: StockValue,
      @ConnectedSocket() stock: Socket,
  ): Promise<void> {
    try {
      console.log('', stockValue);
      const stockUpdate = await this.stockService.update(stockValue.id, stockValue);
      const stocks = await this.stockService.getStocks();
      const stockDTO: StockDTO = {
        stocks: stocks,
        stock: stockUpdate
      };
      stock.emit('stockDTO', stockDTO);
      this.server.emit('stocks', stocks);
    } catch(e) {
      console.log('Error', e);
    }
  }

  @SubscribeMessage('welcomeStock')
  async handleWelcomeStockEvent(
      @ConnectedSocket() stock: Socket,
  ): Promise<void> {
    const stockClients = await this.stockService.getStocks();
    stock.emit('stocks', stockClients)
  }
}
