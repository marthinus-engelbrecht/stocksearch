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
    describe('When getPrice is called with the stock symbol of one of those items', () => {
      let response$: Observable<number>;
      const poundEuroConversionRate = 0.86083;
      const expectedUrl = StocksEndpoints.data;
      const hcbalStockPriceInPenceSterling = 652.70;
      const penceToPound = 100;
      const expectedPrice = hcbalStockPriceInPenceSterling / penceToPound * poundEuroConversionRate;

      beforeEach(() => {
        initTestScheduler();
        const stock$ = cold('a|', {a: successfulGetStockPricesResponse});
        const currency$ = cold('a|', {a: poundEuroConversionRate});

        http.get.and.returnValue(stock$);
        currencyService.getLatestRate.and.returnValue(currency$);

        const service = TestBed.get(StocksService);
        response$ = service.getPrice('HSBA.L');
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
        response$.subscribe((actualPrice) => {
          expect(currencyService.getLatestRate).toHaveBeenCalledWith('GBP');
        });
        getTestScheduler().flush();
      });

      it('Then it should return the stock price of that stock in Euro', () => {
        response$.subscribe((actualPrice) => {
          expect(expectedPrice).toEqual(actualPrice);
        });
        getTestScheduler().flush();
      });
    });
  });
});
