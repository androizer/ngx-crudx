import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxRepoEntityModule } from 'ngx-repo-entity';

import { PostRoutingModule } from './post-routing.module';
import { Post } from './post.model';
import { PostRepository } from './post.repository';
import { PostComponent } from './post/post.component';

@NgModule({
  declarations: [PostComponent],
  imports: [
    CommonModule,
    PostRoutingModule,
    NgxRepoEntityModule.forFeature([Post]),
  ],
  providers: [PostRepository],
})
export class PostModule {}
