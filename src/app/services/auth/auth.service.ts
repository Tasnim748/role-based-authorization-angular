import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, retry } from 'rxjs';

import { apiEndpoint } from '../../utilsAndAPIEndpoints/apiEndpoints';
import { getToken } from '../../utilsAndAPIEndpoints/cookieOperations';

import { User } from '../../utilsAndAPIEndpoints/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  currentUser!: any

  verifyAccess(): Observable<any> {
    let token = getToken('accessToken')
    let headers = {
      'Authorization': `Bearer ${token}`
    }

    return this.http.get(`${apiEndpoint}auth/verify-access`, { headers: headers })
  }

  // validateRefresh(): Observable<any> {
  //   let token = getToken('refreshToken')
  //   let headers = {
  //     'Authorization': `Bearer ${token}`
  //   }

  //   return this.http.get(`${apiEndpoint}auth/validate-refresh`, { headers: headers })
  // }
  
  isTokenExpired(): boolean {
    // let token = getToken('refreshToken')
    // let jwtExpiry!: number
    // if (token) {
    //   try {
    //     jwtExpiry = JSON.parse(window.atob(token.split('.')[1])).exp * 1000
    //   } catch(e) {
    //     return true
    //   }
    // } else {
    //   return true
    // }
    let currentTime = new Date().getTime()
    return this.currentUser.tokenExpiry < currentTime
  }

  signIn(username: string, password: string): Observable<any> {
    let body = {
      username: username,
      password: password
    }

    let headers = {
      'Content-Type': 'application/json'
    }

    return this.http.post(
      `${apiEndpoint}auth/login`,
      body,
      { headers: headers }
    )
  }

  refreshToken(): Observable<any> {
    let token = getToken('refreshToken')
    let headers = {
      'Authorization': `Bearer ${token}`
    }

    return this.http.get(
      `${apiEndpoint}auth/token`,
      { headers: headers }
    )
  }

  logout(): Observable<any> {
    let token = getToken('refreshToken')
    let headers = {
      'Authorization': `Bearer ${token}`
    }

    return this.http.get(
      `${apiEndpoint}auth/logout`,
      { headers: headers }
    )
  }

  setCurrentUser(user: any) {
    this.currentUser = user
  }
}
