import { Component, Input, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { News } from '../../models/news';
import { AuthService } from '../../Services/auth-service ';

const basUrl = "https://localhost:4001/images";

@Component({
  selector: 'app-news-item',
  standalone: true,
  imports: [RouterModule, DatePipe, CommonModule],

  template: `
  
    <div *ngIf="newsItem" class="card shadow-sm" [ngClass]="{'read-news': newsItem.isRead}" style="width: 250px;">
    <a [routerLink]="['/detail', newsItem.id]" class="news-item-link">
      <img [src]="pictureUrl" class="actuImg">
    </a>
      <div class="card-body">
        <div class="creator-info">
          <small>Créé par {{ getFullName() | titlecase }}</small>
        </div>
        <div *ngIf="newsItem.creatorEmail === currentUserEmail" class="float-right">
          <a [routerLink]="['/edit', newsItem.id]" class="link-primary"><i class="fa-regular fa-rectangle-list"></i></a>
          <a (click)="onDelete()" class="link-primary"><i class="fa-solid fa-trash"></i></a>
        </div>
        <div class="card-text mt-4 text-truncate"><small>{{ newsItem.title }}</small></div>
      </div>
      <div class="card-footer text-muted">
        <small><i class="fa-regular fa-calendar"></i> {{ newsItem.publicationDate | date: 'dd/MM/yyyy' }}</small>
        <small *ngIf="newsItem.isRead" class="float-right">Lu</small>
      </div>
    </div>
  `
  ,
  styleUrl: './news-item.component.css',
})
export class NewsItemComponent implements OnInit{
  @Input() newsItem: News | undefined;
  @Output() delete = new EventEmitter<string>();

  authService : AuthService = inject(AuthService);
  pictureUrl : string = '';
  currentUserEmail: string = '';
  
  onDelete(): void {
    const confirmDelete = confirm('Are you sure you want to delete this item?');
    if (confirmDelete){
      this.delete.emit(this.newsItem?.id); 
    }
  }

  ngOnInit()
  {
    this.pictureUrl = this.newsItem?.picture ? `${basUrl}/${this.newsItem.id}/${this.newsItem.picture}` : `${basUrl}/default.jpg`;
    this.currentUserEmail = this.authService.getUser()?.email ?? '';
  }

  getFullName(): string  {
    const regex = /^([a-zA-Z]+)\.([a-zA-Z]+)@.*$/;
    const match = this.newsItem?.creatorEmail.match(regex);
  
    if (match) {
      return `${match[1]} ${match[2]}`;
    }
    return this.newsItem?.creatorEmail ?? ''; 
  }
}
