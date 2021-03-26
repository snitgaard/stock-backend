import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Inject } from '@nestjs/common';
import { IStockService, IStockServiceProvider } from '../../core/primary-ports/stock.service.interface';
import {Socket} from 'socket.io';

@WebSocketGateway()
export class StockGateway {
  constructor(@Inject(IStockServiceProvider) private stockService: IStockService)
  {
    this.stockService.newStock('hehe','m8',2,21,'noob');
  }
  @WebSocketServer() server;

  @SubscribeMessage('stock')
  async handleStockEvent(
    @MessageBody() stockName: string, initValue: number, currentValue: number, description: string,
    @ConnectedSocket() stock: Socket,
  ): Promise<void> {
    try {
      const stockClient = await this.stockService.newStock(stock.id, stockName, initValue, currentValue, description);
      const stockClients = await this.stockService.getStocks();
      this.server.emit('stock', stockClient);
      this.server.emit('stocks', stockClients);
    } catch(e) {
      stock._error(e.message);
    }
  }




}
