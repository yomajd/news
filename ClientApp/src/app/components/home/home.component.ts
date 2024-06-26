import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsService } from '../../Services/news-service';
import { AuthService } from '../../Services/auth-service ';
import { NewsItemComponent } from '../news-item/news-item.component';
import { News } from '../../models/news';
import {RouterModule} from '@angular/router';
import { Filter } from '../../models/filter';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NewsItemComponent, RouterModule],
  template: `
    <span class="p-2">
      Bienvenue {{authService.getFullname() | titlecase}}
    </span>
    <hr />
    <div *ngIf="userProfile =='direction'"class="float-end">
      <button class="btn btn-outline-primary" [routerLink]="['/create']" >Ajouter une actualite</button>
    </div>
    <br/>
    <br/>
    <div class="results py-2">
      <app-news-item
        *ngFor="let newsItem of newsList"
        [newsItem]="newsItem"
        (delete)="handleDelete($event)">
      </app-news-item>
    </div>

    <div class="float-end p-4">
      <button [routerLink]="['/list']" class="btn btn-outline-primary">Voir toutes les actualites</button>
    </div>
  `,
  styleUrl:'./home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy{
  newsService : NewsService = inject(NewsService);
  authService : AuthService = inject(AuthService);
  newsList: News[] = [];
  userProfile: string ='';

  private subscriptions = new Subscription();

  ngOnInit(): void {
      const sub = this.newsService.getNews(new Filter()).subscribe(data => this.newsList = data);
      this.userProfile = this.authService.getUserProfile();
      this.subscriptions.add(sub);
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  handleDelete(newsId: string) {
    const sub = this.newsService.deleteNews(newsId).subscribe(() => {
      const index = this.newsList.findIndex(n => n.id === newsId);
      if (index != -1){
        this.newsList.splice(index, 1);
      }
    });
    this.subscriptions.add(sub);
  }
}
