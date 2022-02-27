import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgCrudxModule } from 'ngx-crudx';

import { UserOpsComponent } from './user-ops/user-ops.component';
import { UserOpsRepository } from './user-ops/user-ops.repository';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    NgCrudxModule.forFeature([UserOpsRepository]),
  ],
  declarations: [UserOpsComponent],
  providers: [],
})
export class UserModule {}
