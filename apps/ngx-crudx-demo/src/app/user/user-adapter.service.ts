import { Injectable } from '@angular/core';
import { classToPlain, plainToClass } from 'class-transformer';

import { User } from './user.model';

import type { Transform, AnyObject } from 'ngx-crudx';

@Injectable()
export class UserAdapter implements Transform {
  transformFromEntity(data: User) {
    return classToPlain(data);
  }

  transformToEntity(resp: AnyObject) {
    return plainToClass(User, resp);
  }
}
