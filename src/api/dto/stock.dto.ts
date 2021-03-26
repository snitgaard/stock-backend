import {StockValue} from '../../core/models/stock.model';

export interface StockDTO {
    stocks: StockValue[];
    stock: StockValue;

}
