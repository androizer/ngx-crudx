import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgCrudxModule } from 'ngx-crudx';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgCrudxModule.forRoot({ basePath: 'https://jsonplaceholder.typicode.com' }),
    PostModule,
    UserModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
