import { plainToClass, Type } from 'class-transformer';
import { RepoEntity } from 'ngx-crudx';

import { UserAdapter } from './user-adapter.service';

@RepoEntity({
  path: 'users',
  routes: {
    findAll: {
      transform: {
        transformToEntity: (resp) => {
          return resp.map((item) => {
            return plainToClass(User, item);
          });
        },
      },
    },
    createOne: {
      transform: UserAdapter,
    },
  },
})
export class User {
  id: number;
  name: string;
  username: string;
  email: string;
  @Type(() => Address)
  address?: Address;
  phone: string;
  website: string;
  @Type(() => Company)
  company?: Company;
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
