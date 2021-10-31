import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgCrudxModule } from 'ngx-crudx';

import { PostRoutingModule } from './post-routing.module';
import { Post } from './post.model';
import { PostRepository } from './post.repository';
import { PostComponent } from './post/post.component';

@NgModule({
  declarations: [PostComponent],
  imports: [
    CommonModule,
    PostRoutingModule,
    NgCrudxModule.forFeature([PostRepository]),
  ],
  providers: [],
})
export class PostModule {}
