import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserOpsComponent } from './user-ops/user-ops.component';

const routes: Routes = [
  {
    path: 'users',
    component: UserOpsComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
