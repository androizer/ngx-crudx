import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgCrudxModule } from 'ngx-crudx';

import { UserOpsComponent } from './user-ops/user-ops.component';
import { UserOpsRepository } from './user-ops/user-ops.repository';
import { UserRoutingModule } from './user-routing.module';
import { User } from './user.model';

@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    NgCrudxModule.forFeature([User]),
  ],
  declarations: [UserOpsComponent],
})
export class UserModule {}
