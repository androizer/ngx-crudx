import { CustomRepository, Repository } from 'ngx-modrepo';

import { User } from '../user.model';

@CustomRepository(User)
export class UserOpsRepository extends Repository<User> {}
