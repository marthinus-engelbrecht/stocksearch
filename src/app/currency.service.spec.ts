import {TestBed} from '@angular/core/testing';

import {CurrencyService} from './currency.service';
import {cold, getTestScheduler, initTestScheduler} from 'jasmine-marbles';
import createSpyObj = jasmine.createSpyObj;
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {RatesResponse} from './model/rates-response';
import {CurrencyEndpoints} from './currency.endpoints';

describe('CurrencyService', () => {
  const http = createSpyObj(HttpClient.name, ['get']);
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      { provide: HttpClient, useValue: http }
    ]
  }));

  describe('Given the latest currency data is available', () => {
    const symbol = 'GBP';
    const mockHttpResponseData: RatesResponse = {
      "base": "EUR",
      "rates": {
        "BGN": 1.9558,
        "NZD": 1.6697,
        "ILS": 4.0351,
        "RUB": 72.86,
        "CAD": 1.5032,
        "USD": 1.1279,
        "PHP": 58.543,
        "CHF": 1.128,
        "ZAR": 15.7391,
        "AUD": 1.5785,
        "JPY": 125.38,
        "TRY": 6.4144,
        "HKD": 8.8405,
        "MYR": 4.6328,
        "THB": 35.839,
        "HRK": 7.4253,
        "NOK": 9.5895,
        "IDR": 15959.79,
        "DKK": 7.4652,
        "CZK": 25.608,
        "HUF": 321.84,
        "GBP": 0.86083,
        "MXN": 21.2783,
        "KRW": 1283.09,
        "ISK": 134.2,
        "SGD": 1.5258,
        "BRL": 4.3301,
        "PLN": 4.2833,
        "INR": 77.9945,
        "RON": 4.7605,
        "CNY": 7.5758,
        "SEK": 10.44
      },
      "date": "2019-04-10"
    };

    describe('When getLatestRate() is called with a currency symbol', () => {
      let expectedRate: number;
      let response$: Observable<number>;

      beforeEach(() => {
        initTestScheduler();
        const mockResponse$ = cold('a|', { a: mockHttpResponseData});
        http.get.and.returnValue(mockResponse$);
        const service = TestBed.get(CurrencyService);

        expectedRate = mockHttpResponseData.rates[symbol];
        response$ = service.getLatestRate(symbol);
      });

      it('Then it should return the latest rate for the currency', (done) => {
        response$.subscribe((actualRate) => {
          expect(expectedRate).toEqual(actualRate);
          done();
        });
        getTestScheduler().flush();
      });

      it(`Then it should make an https request to ${CurrencyEndpoints.latest}`, () =>{
        expect(http.get).toHaveBeenCalledWith(CurrencyEndpoints.latest);
      });

      afterEach(http.get.calls.reset);
    });
  });
});
