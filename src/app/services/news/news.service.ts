import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { apiEndpoint } from '../../utilsAndAPIEndpoints/apiEndpoints';
import { getToken } from '../../utilsAndAPIEndpoints/cookieOperations';

import { News } from '../../utilsAndAPIEndpoints/interfaces';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  constructor(private http: HttpClient) { }

  news = signal<News[]>([])

  getNews(): Observable<News[]> {
    const accessToken = getToken("accessToken")

    const headers = {
      'Authorization': `Bearer ${accessToken}`
    }

    return this.http.get<News[]>(
      `${apiEndpoint}news`,
      { headers: headers }
    )
  }

  createNews(body: any): Observable<News> {
    const accessToken = getToken("accessToken")
    const headers = {
      'Authorization': `Bearer ${accessToken}`
    }
    return this.http.post<News>(
      `${apiEndpoint}news`,
      body,
      { headers: headers }
    )
  }

  updateNews(body: any): Observable<News> {
    const accessToken = getToken("accessToken")
    const headers = {
      'Authorization': `Bearer ${accessToken}`
    }

    return this.http.put<News>(
      `${apiEndpoint}news`,
      body,
      { headers: headers },
    )
  }

  deleteNews(id: string): Observable<News> {
    let params = new HttpParams().set('id', id)
    const accessToken = getToken("accessToken")
    const headers = {
      'Authorization': `Bearer ${accessToken}`
    }

    return this.http.delete<News>(
      `${apiEndpoint}news`,
      {
        headers: headers,
        params: params
      }
    )
  }

  // update states
  setNews(news: News[]) {
    this.news.set(news)
  }

  createNewsState(newNews: News) {
    this.news.update(news => [...news, newNews])
  }

  updateNewsState(updatedNews: News) {
    this.news.update(news => news.map(news => {
      if (news._id === updatedNews._id) {
        return updatedNews
      } else {
        return news
      }
    }))
  }

  deleteNewsState(deletedNews: News) {
    this.news.update(news => news.filter(news => news._id != deletedNews._id))
  }
}
