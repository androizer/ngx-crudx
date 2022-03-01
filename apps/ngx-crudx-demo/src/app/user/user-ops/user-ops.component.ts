import { Component, OnInit } from '@angular/core';
import { plainToClass } from 'class-transformer';

import { User } from '../user.model';
import { UserOpsRepository } from './user-ops.repository';

@Component({
  selector: 'app-user-ops',
  templateUrl: './user-ops.component.html',
  styleUrls: ['./user-ops.component.scss'],
})
export class UserOpsComponent implements OnInit {
  constructor(
    // @Inject(RepoToken(User)) private readonly userRepo: Repository<User>,
    private readonly userRepo: UserOpsRepository,
  ) {}

  ngOnInit(): void {
    // this.userRepo.findAll().subscribe(resp => {
    //   console.log(resp);
    // })
    const user = plainToClass(User, {
      id: 11,
      email: 'user@yopmail.com',
      name: 'John Doe',
      phone: '+91-9595959595',
      username: 'john_doe',
      website: 'john-doe.com',
    });
    this.userRepo.createOne(user).subscribe((value) => {
      console.log(value);
    });
  }
}
