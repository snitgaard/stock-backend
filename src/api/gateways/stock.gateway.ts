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
      const stockModel: StockValue = {
        id: stockValue.id,
        stockName: stockValue.stockName,
        description: stockValue.description,
        initValue: stockValue.initValue,
        currentValue: stockValue.currentValue
      }
      const stockClient = await this.stockService.newStock(stockModel);
      const stockClients = await this.stockService.getStocks();
      const stockDTO: StockDTO = {
        stocks: stockClients,
        stock: stockClient
      };
      stock.emit('stockDTO', stockDTO);
      this.server.emit('stocks', stockClients);
    } catch(e) {
      console.log("Gay")
    }
  }




}
