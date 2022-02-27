import { Injectable } from '@angular/core';
import { RepositoryMixin } from 'ngx-crudx';

import { User } from '../user.model';

@Injectable()
export class UserOpsRepository extends RepositoryMixin(User) {
  constructor() {
    super();
  }
}
