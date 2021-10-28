import { Component, OnInit } from '@angular/core';
import { UserOpsRepository } from './user-ops.repository';

@Component({
  selector: 'app-user-ops',
  templateUrl: './user-ops.component.html',
  styleUrls: ['./user-ops.component.scss']
})
export class UserOpsComponent implements OnInit {

  constructor(private readonly userRepo: UserOpsRepository) { }

  ngOnInit(): void {
    this.userRepo.findAll().subscribe(resp => {
      console.log(resp);
    })
  }
}
