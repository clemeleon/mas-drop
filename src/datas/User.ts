/**
 * Package: Mas Drop.
 * 08 April 2021
 */
import { Address } from "./Address";
import { IData } from "../faces/IData";

export type UserType = {
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
  parent: number;
};

export class User implements IData {
  public readonly id: number;
  public readonly username: string;
  public readonly name: { firstname: string; lastname: string };
  public readonly address: Address;
  private readonly email: string;
  private readonly password: string;
  private readonly phone?: string;
  private readonly parent: number;

  constructor({
    id,
    email,
    username,
    password,
    phone,
    name,
    address,
    parent,
  }: UserType) {
    this.id = id;
    this.email = email;
    this.username = username;
    this.password = password;
    this.name = name;
    this.phone = phone;
    this.address = new Address(address);
    this.parent = parent;
  }
}
