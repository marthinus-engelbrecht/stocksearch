export class CurrencyEndpoints {
  private static base =  'https://api.exchangeratesapi.io';
  public static get latest() {
    return CurrencyEndpoints.base + '/latest';
  }
}
