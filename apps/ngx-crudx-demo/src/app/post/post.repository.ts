import { Injectable } from '@angular/core';
import { Repository } from 'ngx-crudx';

import { Post } from './post.model';

@Injectable()
export class PostRepository extends Repository<Post> {
  constructor() {
    super(Post);
  }
}
