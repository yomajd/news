import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { News } from '../models/news';
import { Filter } from '../models/filter';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})

export class NewsService {
    private newsUrl = "https://localhost:4001/api/news";
    private newsList: News[] = [];
    fileNames: string[] = [];

    constructor(private http: HttpClient) {}

    getNews(filter:Filter) : Observable<News[]>{
        if(this.newsList.length >= (filter.skip + 1) * filter.take){
            return of(this.newsList.slice(filter.skip * filter.take, (filter.skip + 1) * filter.take));
        }

        return this.http.get<News[]>(`${this.newsUrl}?skip=${filter.skip}&take=${filter.take}`).pipe(
            map(data => {
                const uniqueNewsList = [...this.newsList, ...data].filter((value, index, newsList) =>
                    index === newsList.findIndex(news => news.id === value.id)
                );
                this.newsList = uniqueNewsList;
                return data;
            })
        );
    }

    getNewsById(id: string) : Observable<News>{
        let index = this.newsList.findIndex(n => n.id === id);
        if(index != -1){
            return of(this.newsList[index]);
        }
        return this.http.get<News>(`${this.newsUrl}/${id}`);
    }

    createNews(news: News){
        this.http.post<News>(this.newsUrl, news)
        .subscribe(data => {
            news.id = data.id;
            this.newsList.push(news);
        });
    }

    updateNews(id: string, formData: FormData) : Observable<HttpResponse<News>>{
        return this.http.put<News>(`${this.newsUrl}/${id}`, formData, { observe: 'response' })
        .pipe(
            tap( response => {
                if(response.body){
                    const index = this.newsList.findIndex(n => n.id === id);
                    if (index !== -1) {
                        this.newsList[index] = response.body;
                    }
                }
        }));
    }

    CreateNews(formData: FormData) : Observable<News>{
        return this.http.post<News>(`${this.newsUrl}`, formData)
        .pipe(tap(news => {
            if(news)
                this.newsList.unshift(news);
        }));
    }

    deleteNews(id: string) {
        return  this.http.delete<void>(`${this.newsUrl}/${id}`)
        .pipe(map(() => {
            const index = this.newsList.findIndex(n => n.id === id);
            if (index != -1){
                this.newsList.splice(index, 1);
            }
        }));
    }

    markNewsAsRead(newsId: string): void {
        const news = this.newsList.find(n => n.id === newsId);
        if(!news || news.isRead === true){
            return;
        }
        const httpOptions = {
             headers: new HttpHeaders({'Content-Type': 'application/json'})
        }
        this.http.put(`${this.newsUrl}/markRead`, JSON.stringify({ newsId }), httpOptions).subscribe(() => news.isRead = true);
    }
}


