import { Injectable } from '@angular/core';
import { CustomRepository, Repository } from 'ngx-modrepo';

import { Post } from './post.model';

@CustomRepository(Post)
@Injectable()
export class PostRepository extends Repository<Post> {}
