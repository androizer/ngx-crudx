import { Injectable } from '@angular/core';
import { classToPlain, plainToClass } from 'class-transformer';

import { User } from './user.model';

import type { Adapter, AnyObject } from 'ngx-crudx';

@Injectable()
export class UserAdapter implements Adapter {
  adaptFromModel(data: User) {
    return classToPlain(data);
  }

  adaptToModel(resp: AnyObject) {
    return plainToClass(User, resp);
  }
}
