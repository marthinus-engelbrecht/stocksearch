import {TestBed} from '@angular/core/testing';

import {StocksService} from './stocks.service';
import {cold, getTestScheduler, initTestScheduler} from 'jasmine-marbles';
import {successfulGetStockPricesResponse} from '../../../testing/mock-data/successful-stock-prices-response';
import {HttpClient} from '@angular/common/http';
import createSpyObj = jasmine.createSpyObj;
import {StocksEndpoints} from './stocks.endpoints';
import {Observable} from 'rxjs';
import {CurrencyService} from '../currency/currency.service';
import {availableStockItems} from './available-stock-items.constant';

describe('Unit Under Test: StockDataService', () => {
  const http = createSpyObj(HttpClient.name, ['get']);
  const currencyService = createSpyObj(CurrencyService.name, ['getLatestRate']);

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      {provide: HttpClient, useValue: http},
      {provide: CurrencyService, useValue: currencyService}
    ]
  }));

  describe('Given stock data exists for a set of stocks', () => {
    availableStockItems.forEach((stockSymbol) => {
      const stockItemData = successfulGetStockPricesResponse.data.find((item) => item.symbol === stockSymbol);
      const expectedCurrencyArgument = stockItemData.currency === 'GBX' ? 'GBP' : stockItemData.currency;

      describe(`When getPrice is called with the stock symbol ${expectedCurrencyArgument}`, () => {
        let response$: Observable<number>;
        const conversionRate = 0.86083;
        const expectedUrl = StocksEndpoints.data;
        const stockPriceInEuro = stockItemData.price;
        const penceToPound = 100;
        const convertedPrice = stockPriceInEuro * conversionRate;
        const expectedPrice = stockItemData.currency === 'GBX' ? convertedPrice / penceToPound : convertedPrice;

        beforeEach(() => {
          initTestScheduler();
          const stockPrice$ = cold('a|', {a: successfulGetStockPricesResponse});
          const currencyRate$ = cold('a|', {a: conversionRate});

          http.get.and.returnValue(stockPrice$);
          currencyService.getLatestRate.and.returnValue(currencyRate$);

          const service = TestBed.get(StocksService);
          response$ = service.getPrice(stockSymbol);
        });

        it(`Then it should make a GET http call to ${StocksEndpoints.data} with the symbols as query parameters`, () => {
          expect(http.get).toHaveBeenCalledWith(expectedUrl, {
            params: {
              symbol: availableStockItems.join(','),
              api_token: 'demo'
            }
          });
        });

        it(`Then is should call currencyService.getLatestRate() with the GBP`, () => {
          response$.subscribe(() => {
            expect(currencyService.getLatestRate).toHaveBeenCalledWith(expectedCurrencyArgument);
          });
          getTestScheduler().flush();
        });

        it('Then it should return the stock price of that stock in Euro', () => {
          response$.subscribe((actualPrice) => {
            expect(expectedPrice).toEqual(actualPrice);
          });
          getTestScheduler().flush();
        });

        afterEach(currencyService.getLatestRate.calls.reset);
      });
    });
  });
});
