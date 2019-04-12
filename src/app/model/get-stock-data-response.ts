import {StockItem} from './stock-item';

export interface GetStockDataResponse {
  message: string;
  symbols_requested: number;
  symbols_returned: number;
  data: StockItem[];
}
