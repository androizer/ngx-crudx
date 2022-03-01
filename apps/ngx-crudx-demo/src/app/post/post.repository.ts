import { Injectable } from '@angular/core';
import { RepositoryMixin } from 'ngx-crudx';

import { Post } from './post.model';

@Injectable()
export class PostRepository extends RepositoryMixin(Post) {
  constructor() {
    super();
  }
}
