/**
 * Package: Mas Drop.
 * 08 April 2021
 */
import { Address } from "./Address";

export class User {
  public readonly id: number;
  public readonly username: string;
  public readonly name: { firstname: string; lastname: string };
  public readonly address: Address;
  private readonly email: string;
  private readonly password: string;
  private readonly phone?: string;

  constructor({
    id,
    email,
    username,
    password,
    phone,
    name,
    address,
  }: {
    id: number;
    email: string;
    username: string;
    password: string;
    phone?: string;
    name: { firstname: string; lastname: string };
    address: {
      geolocation: { lat: string; long: string };
      city: string;
      street: string;
      number: number;
      zipcode: string;
    };
  }) {
    this.id = id;
    this.email = email;
    this.username = username;
    this.password = password;
    this.name = name;
    this.phone = phone;
    this.address = new Address(address);
  }
}
