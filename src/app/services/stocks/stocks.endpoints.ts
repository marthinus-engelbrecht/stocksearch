export class StocksEndpoints {
  private static base = 'https://www.worldtradingdata.com/api/v1';
  public static get data() {
    return this.base + '/stock';
  }
}
