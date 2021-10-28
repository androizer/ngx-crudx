import { Component, OnInit } from '@angular/core';
import { AnyObject } from 'ngx-crudx';

import { Post } from '../post.model';
import { PostRepository } from '../post.repository';

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
    // @Inject(RepoToken(Post))
    // private readonly postRepo: Repository<Post>,
    private readonly postRepo: PostRepository
  ) {}

  ngOnInit(): void {
    // --> findAll <--
    this.postRepo.findAll<FindAllResponse<Post>>().subscribe((resp) => {
      console.log(resp);
    });
    // --> FindOne <--
    // this.postRepo.findOne(1).subscribe(resp => {
    //   console.log(resp)
    // })
    // --> CreateOne <--
    // this.postRepo
    //   .createOne({
    //     title: 'foo',
    //     body: 'bar',
    //     userId: 1,
    //   })
    //   .subscribe((resp) => {
    //     console.log(resp);
    //   });
    // --> UpdateOne <--
    // this.postRepo.updateOne(1, {
    //   title: 'foo',
    // }).subscribe(resp => {
    //   console.log(resp);
    // })
    // --> ReplaceOne <--
    // this.postRepo.replaceOne(1, {
    //   id: 1,
    //   title: 'foo',
    //   body: 'bar',
    //   userId: 1,
    // }).subscribe(resp => {
    //   console.log(resp);
    // })
    // --> DeleteOne <--
    // this.postRepo.deleteOne(1).subscribe(resp => {
    //   console.log(resp);
    // })
  }
}
