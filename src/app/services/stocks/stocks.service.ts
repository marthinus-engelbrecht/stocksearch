import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CurrencyService} from '../currency/currency.service';
import {StocksEndpoints} from './stocks.endpoints';
import {Observable} from 'rxjs';
import {GetStockDataResponse} from '../../model/get-stock-data-response';
import {map, mergeMap} from 'rxjs/operators';
import {availableStockItems} from './available-stock-items.constant';

@Injectable({
  providedIn: 'root'
})
export class StocksService {

  constructor(private http: HttpClient, private currencyService: CurrencyService) {
  }

  public getPrice(symbol: string): Observable<number> {
    return this.http.get<GetStockDataResponse>(StocksEndpoints.data, {
      params: {
        symbol: availableStockItems.join(','),
        api_token: 'demo'
      }
    }).pipe(
      mergeMap((response) => {
        const stockItem = response.data.find((item) => item.symbol === symbol);
        const {price, currencySymbol} = this.normalizeCurrency(stockItem.price, stockItem.currency);

        return this.currencyService.getLatestRate(currencySymbol)
          .pipe(
            map((rate) =>  {
              return rate * price;
            })
          );
      })
    );
  }

  private normalizeCurrency(price: number, currencySymbol: string) {
    if (this.isPenceSterling(currencySymbol)) {
      price = this.convertToPoundSterling(price);
      currencySymbol = 'GBP';
    }

    return {price, currencySymbol};
  }

  private isPenceSterling(currency: string) {
    return currency === 'GBX';
  }

  private convertToPoundSterling(price: number) {
    return price / 100;
  }
}
