import { Repository } from 'ngx-crudx';

import { User } from '../user.model';

export class UserOpsRepository extends Repository<User> {
  constructor() {
    super(User);
  }
}
