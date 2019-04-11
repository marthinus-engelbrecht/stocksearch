export interface RatesResponse {
  rates: {
    [key: string]: number
  };
  date: string;
  base: string;
}
