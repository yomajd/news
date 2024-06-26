import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsService } from '../../Services/news-service';
import { NewsItemComponent } from '../news-item/news-item.component';
import { News } from '../../models/news';
import { Filter } from '../../models/filter';
import {RouterModule} from '@angular/router';
import {Location} from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-news-list',
  standalone: true,
  imports: [CommonModule, NewsItemComponent, RouterModule],
  template: `
<span class="p-2">
  <a (click)="goBack()" class="link-primary"><i class="fa-solid fa-chevron-left"> Retour</i></a>
</span>
    <hr />
    <br/>
    <br/>
  <div class="results py-2"> 
    <app-news-item 
        *ngFor="let newsItem of newsList"
        [newsItem]="newsItem"
        (delete)="handleDelete($event)">
      </app-news-item>
  </div>
  <div class="text-center py-2">
    <button *ngIf="canGetNews; else nomore"  type="button" class="btn btn-primary rounded-pill" (click)="LoadMore()">More</button>
  </div>
  <ng-template #nomore>
    <button type="button"class="btn btn-secondary rounded-pill" >No more to fetch</button>
  </ng-template>
`,
  styleUrl: './news-list.component.css'
})
export class NewsListComponent implements OnInit, OnDestroy{
  newsService = inject(NewsService);
  location = inject(Location);

  private subscriptions = new Subscription();
  newsList : News[] = [];
  filter : Filter;
  canGetNews : boolean;

  constructor(){
    this.filter = new Filter();
    this.canGetNews = true;
  }

  ngOnInit(): void {
    const sub = this.newsService.getNews(this.filter).subscribe(data => this.newsList = data);
    this.filter.skip++;
    this.subscriptions.add(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe(); 
  }

  handleDelete(newsId: string) {
    this.newsService.deleteNews(newsId).subscribe(() => {
      const index = this.newsList.findIndex(n => n.id === newsId);
      if (index != -1){
        this.newsList.splice(index, 1);
      }
    });
  }

  LoadMore(): void{
    const sub =this.newsService.getNews(this.filter).subscribe(data => {
      this.newsList.push(...data);
      if(data.length < this.filter.take ){
        this.canGetNews = false;
      }else{
        this.filter.skip++;
      }
    });
    this.subscriptions.add(sub);
  }

  goBack(): void{
    this.location.back();
  }
}
