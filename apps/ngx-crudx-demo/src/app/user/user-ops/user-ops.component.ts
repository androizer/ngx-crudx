import { Component, Inject, OnInit } from '@angular/core';
import { Repository, RepoToken } from 'ngx-crudx';
import { User } from '../user.model';
import { UserOpsRepository } from './user-ops.repository';

@Component({
  selector: 'app-user-ops',
  templateUrl: './user-ops.component.html',
  styleUrls: ['./user-ops.component.scss']
})
export class UserOpsComponent implements OnInit {

  constructor(@Inject(RepoToken(User)) private readonly userRepo: Repository<User>) { }

  ngOnInit(): void {
    this.userRepo.findAll().subscribe(resp => {
      console.log(resp);
    })
  }
}
