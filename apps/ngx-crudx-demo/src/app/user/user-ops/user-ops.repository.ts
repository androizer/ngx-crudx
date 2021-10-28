import { CustomRepository, Repository } from 'ngx-crudx';

import { User } from '../user.model';

@CustomRepository(User)
export class UserOpsRepository extends Repository<User> {}
