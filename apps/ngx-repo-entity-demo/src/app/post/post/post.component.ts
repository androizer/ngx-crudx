import { Component, Inject, OnInit } from '@angular/core';
import { AnyObject, Repository, RepoToken } from 'ngx-repo-entity';

import { Post } from '../post.model';

type FindAllResponse<T = AnyObject> = {
  count: number;
  data: T[];
  page: number;
  pageCount: number;
  total: number;
};

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
  constructor(
    @Inject(RepoToken(Post))
    private readonly postRepo: Repository<Post>
  ) {}

  ngOnInit(): void {
    this.postRepo.findAll().subscribe(data => {
      console.log(data);
    })
  }
}
