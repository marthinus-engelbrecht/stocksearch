import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockSearchComponent } from './stock-search.component';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import createSpyObj = jasmine.createSpyObj;
import {StocksService} from '../../services/stocks/stocks.service';
import {cold, getTestScheduler, initTestScheduler} from 'jasmine-marbles';

describe('Unit Under Test: StockSearchComponent', () => {
  let component: StockSearchComponent;
  let fixture: ComponentFixture<StockSearchComponent>;
  let dropdown;
  let search;
  let price;

  const stocksService = createSpyObj(StocksService.name, ['getPrice']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockSearchComponent ],
      imports: [HttpClientModule],
      providers: [{provide: StocksService, useValue: stocksService}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockSearchComponent);
    component = fixture.componentInstance;
    dropdown = fixture.nativeElement.querySelector('select');
    search = fixture.nativeElement.querySelector('button');
    price = fixture.nativeElement.querySelector('h4');
    fixture.detectChanges();
  });

  describe('Given the component has been created', () => {
    describe('And a stock item has been selected from the dropdown',  () => {
      beforeEach(() => {
        dropdown.value = dropdown.options[2].value;
        dropdown.dispatchEvent(new Event('change'));
      });

      describe('And the call to getPrice will be successful', () => {
        const euroSymbol = `\u20AC`;
        const expectedPrice = 5;

        beforeEach(() => {
            initTestScheduler();
            const getPriceResponse$ = cold('a|', { a: expectedPrice});
            stocksService.getPrice.and.returnValue(getPriceResponse$);
        });

        describe('When search is clicked', () => {
          beforeEach(() => {
            search.click();
            getTestScheduler().flush();
            fixture.detectChanges();
          });
          it('Then it should call StocksService.getPrice() with the selected item', () => {
            expect(stocksService.getPrice).toHaveBeenCalledWith('HSBA.L');
          });
          it('Then it should display the expected result',  () => {
            expect(price.innerText).toEqual(`${euroSymbol} ${expectedPrice}`);
          });
        });
      });
    });
  });
});
