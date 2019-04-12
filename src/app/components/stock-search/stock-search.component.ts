import {Component, OnInit, ViewChild} from '@angular/core';
import {StocksService} from '../../services/stocks/stocks.service';
import {availableStockItems} from '../../services/stocks/available-stock-items.constant';

@Component({
  selector: 'app-stock-search',
  templateUrl: './stock-search.component.html',
  styleUrls: ['./stock-search.component.css']
})
export class StockSearchComponent implements OnInit {
  price = 0.00;
  symbols = availableStockItems;

  @ViewChild('select') select;

  constructor(private stockService: StocksService) { }

  ngOnInit() {
  }

  search() {
    this.stockService.getPrice(this.select.nativeElement.value).subscribe((price) => {
      this.price = price;
    });
  }
}
