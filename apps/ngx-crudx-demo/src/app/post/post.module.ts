import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxModRepoModule } from 'ngx-crudx';

import { PostRoutingModule } from './post-routing.module';
import { PostRepository } from './post.repository';
import { PostComponent } from './post/post.component';

@NgModule({
  declarations: [PostComponent],
  imports: [
    CommonModule,
    PostRoutingModule,
    NgxModRepoModule.forFeature([PostRepository]),
  ],
  providers: [],
})
export class PostModule {}
