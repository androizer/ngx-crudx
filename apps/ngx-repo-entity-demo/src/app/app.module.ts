import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxRepoEntityModule } from 'ngx-repo-entity';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { PostModule } from './post/post.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxRepoEntityModule.forRoot({ basePath: 'http://localhost:3000' }),
    PostModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
