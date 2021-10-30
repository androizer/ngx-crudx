import { Entity } from 'ngx-crudx';

type uuid = string;

@Entity({
  path: 'posts',
})
export class Post {
  id: uuid;
  title: string;
  content: string;
  votes: uuid[];
  authorId: uuid;
  commentIds: uuid[];
  bookmarkedIds: uuid[];
  tags: string[];
  createdBy?: string;
  modifiedBy?: string;
  createdOn?: Date;
  modifiedOn?: Date;
  deletedOn?: Date;

  constructor(data: Partial<Post> = {}) {
    this.id = data.id;
    this.title = data.title;
    this.content = data.content;
    this.votes = data.votes;
    this.authorId = data.authorId;
    this.commentIds = data.commentIds;
    this.bookmarkedIds = data.bookmarkedIds;
    this.tags = data.tags;
    this.createdBy = data.createdBy;
    this.modifiedBy = data.modifiedBy;
    this.createdOn = data.createdOn;
    this.modifiedOn = data.modifiedOn;
    this.deletedOn = data.deletedOn;
  }
}
