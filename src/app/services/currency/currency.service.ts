import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {RatesResponse} from '../../model/rates-response';
import {CurrencyEndpoints} from './currency.endpoints';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  constructor(private http: HttpClient) { }

  getLatestRate(symbol: string): Observable<number> {
    return this.http.get<RatesResponse>(CurrencyEndpoints.latest).pipe(
      map( (data) =>  {
        return data.rates[symbol];
      })
    );
  }
}
