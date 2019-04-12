import {TestBed} from '@angular/core/testing';

import {CurrencyService} from './currency.service';
import {cold, getTestScheduler, initTestScheduler} from 'jasmine-marbles';
import createSpyObj = jasmine.createSpyObj;
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CurrencyEndpoints} from './currency.endpoints';
import {successFulLatestCurrencyRates} from '../../../testing/mock-data/successful-latest-currency-rates';

describe('CurrencyService', () => {
  const http = createSpyObj(HttpClient.name, ['get']);
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      {provide: HttpClient, useValue: http}
    ]
  }));

  describe('Given the latest currency data is available', () => {
    const symbol = 'GBP';

    describe('When getLatestRate() is called with a currency symbol', () => {
      let expectedRate: number;
      let response$: Observable<number>;

      beforeEach(() => {
        initTestScheduler();
        const mockResponse$ = cold('a|', {a: successFulLatestCurrencyRates});
        http.get.and.returnValue(mockResponse$);
        const service = TestBed.get(CurrencyService);

        expectedRate = successFulLatestCurrencyRates.rates[symbol];
        response$ = service.getLatestRate(symbol);
      });

      it('Then it should return the latest rate for the currency', () => {
        response$.subscribe((actualRate) => {
          expect(expectedRate).toEqual(actualRate);
        });
        getTestScheduler().flush();
      });

      it(`Then it should make an https request to ${CurrencyEndpoints.latest}`, () => {
        expect(http.get).toHaveBeenCalledWith(CurrencyEndpoints.latest);
      });

      afterEach(http.get.calls.reset);
    });
  });
});
