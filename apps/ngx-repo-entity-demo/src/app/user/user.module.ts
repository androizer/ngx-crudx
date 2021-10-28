import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxModRepoModule } from 'ngx-modrepo';

import { UserOpsComponent } from './user-ops/user-ops.component';
import { UserOpsRepository } from './user-ops/user-ops.repository';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    NgxModRepoModule.forFeature([UserOpsRepository]),
  ],
  declarations: [UserOpsComponent],
})
export class UserModule {}
