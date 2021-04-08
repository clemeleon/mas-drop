/**
 * Package: Mas Drop.
 * 08 April 2021
 */
export class Address {
  public readonly city: string;
  public readonly street: string;
  public readonly number: number;
  public readonly zipcode: string;
  public readonly geolocation: { lat: string; long: string };

  constructor({
    city,
    street,
    number,
    zipcode,
    geolocation,
  }: {
    city: string;
    street: string;
    number: number;
    zipcode: string;
    geolocation: { lat: string; long: string };
  }) {
    this.city = city;
    this.street = street;
    this.number = number;
    this.zipcode = zipcode;
    this.geolocation = geolocation;
  }
}
