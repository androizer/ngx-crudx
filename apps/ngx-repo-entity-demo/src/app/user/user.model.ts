import { plainToClass, Type } from 'class-transformer';
import { RepoEntity } from 'ngx-modrepo';

@RepoEntity({
  path: 'users',
  routes: {
    findAll: {
      adapter: {
        adaptToModel: (resp) => {
          return resp.map(item => plainToClass(User, item))
        }
      }
    }
  }
})
export class User {
  id: string;
  name: string;
  username: string;
  email: string;
  @Type(() => Address)
  address: Address;
  phone: string;
  website: string;
  @Type(() => Company)
  company: Company;
}

export class Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: {
    lat: string;
    lng: string;
  };
}

export class Company {
  name: string;
  catchPhrase: string;
  bs: string;
}
