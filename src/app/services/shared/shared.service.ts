import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }
  title: string = 'Welcome!'

  setTitle(title: string) {
    this.title = title
  }
}
