import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxModRepoModule } from 'ngx-modrepo';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxModRepoModule.forRoot({ basePath: 'https://jsonplaceholder.typicode.com' }),
    PostModule,
    UserModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
