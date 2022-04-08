import { IsInt, IsString, IsEmail } from 'class-validator';
import { Transform, plainToClass } from 'class-transformer';

class Geo {
  @IsString()
  lat: string;

  @IsString()
  lng: string;
}

class Company {
  @IsString()
  name: string;

  @IsString()
  catchPhrase: string;

  @IsString()
  bs: string;
}

class Address {
  @IsString()
  street: string;

  @IsString()
  suite: string;

  @IsString()
  city: string;

  @IsString()
  zipcode: string;

  @Transform(({ obj }) => plainToClass(Geo, obj))
  geo: Geo;
}

export class UserDto {
  @IsInt()
  id: number;

  @IsString()
  name: string;

  @IsString()
  username: string;

  @IsString()
  @IsEmail()
  email: string;

  @Transform(({ obj }) => plainToClass(Address, obj))
  address: Address;

  @IsString()
  phone: string;

  @IsString()
  website: string;

  @Transform(({ obj }) => plainToClass(Company, obj))
  company: Company;
}
