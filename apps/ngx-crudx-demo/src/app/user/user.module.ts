import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxModRepoModule } from 'ngx-crudx';

import { UserOpsComponent } from './user-ops/user-ops.component';
import { UserOpsRepository } from './user-ops/user-ops.repository';
import { UserRoutingModule } from './user-routing.module';
import { User } from './user.model';

@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    NgxModRepoModule.forFeature([User]),
  ],
  declarations: [UserOpsComponent],
})
export class UserModule {}
