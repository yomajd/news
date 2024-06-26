import { Component, OnInit, inject } from '@angular/core';
import { News } from '../../models/news';
import { AuthService } from '../../Services/auth-service ';
import {CommonModule, Location} from '@angular/common';
import { FileService } from '../../Services/file-service';
import { ActivatedRoute } from '@angular/router';
import { NewsService } from '../../Services/news-service';

const baseUrl = "https://localhost:4001/images";
const filesUrl = "https://localhost:4001/api/files";

@Component({
  selector: 'app-news-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './news-detail.component.html',
  styleUrl: './news-detail.component.css'
})
export class NewsDetailComponent implements OnInit{
  news: News | undefined;
  pictureUrl : string = '';
  currentUserEmail: string = '';
  newsId: string = '';
  fileLinks: { name: string, url: string }[] | undefined = [];

  newsService : NewsService = inject(NewsService);
  authService : AuthService = inject(AuthService);
  FileService : FileService = inject(FileService);
  location : Location = inject(Location);
  route : ActivatedRoute = inject(ActivatedRoute);

  ngOnInit()
  {
    this.newsId = this.route.snapshot.paramMap.get('id')!;
    this.newsService.getNewsById(this.newsId).subscribe(news => {
      this.news = news;
      this.pictureUrl = news.picture ? `${baseUrl}/${this.newsId}/${news.picture}` : `${baseUrl}/default.jpg`;
    });

    this.currentUserEmail = this.authService.getUser()?.email ?? '';

    this.newsService.markNewsAsRead(this.newsId);

    this.loadFileLinks();
  }

  getFullName(): string  {
    const regex = /^([a-zA-Z]+)\.([a-zA-Z]+)@.*$/;
    const match = this.news?.creatorEmail.match(regex);

    if (match) {
      return `${match[1]} ${match[2]}`;
    }
    return this.news?.creatorEmail ?? '';
  }
  goBack(): void{
    this.location.back();
  }

  private loadFileLinks(): void {
    this.fileLinks = this.news?.pjs?.map(fileName => ({
      name: fileName, 
      url: `${filesUrl}/?id=${this.newsId}&fileName=${fileName}`
    }))        
  }
}
