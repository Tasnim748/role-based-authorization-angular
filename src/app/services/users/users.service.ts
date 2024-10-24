import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { apiEndpoint } from '../../utilsAndAPIEndpoints/apiEndpoints';
import { getToken } from '../../utilsAndAPIEndpoints/cookieOperations';
import { User } from '../../utilsAndAPIEndpoints/interfaces';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  users = signal<User[]>([])

  getUsers(): Observable<User[]> {
    const accessToken = getToken("accessToken")

    const headers = {
      'Authorization': `Bearer ${accessToken}`
    }

    return this.http.get<User[]>(
      `${apiEndpoint}users`,
      { headers: headers }
    )
  }

  createUser(body: any): Observable<User> {
    const accessToken = getToken("accessToken")
    const headers = {
      'Authorization': `Bearer ${accessToken}`
    }
    return this.http.post<User>(
      `${apiEndpoint}users`,
      body,
      { headers: headers }
    )
  }

  updateUser(body: any): Observable<User> {
    const accessToken = getToken("accessToken")
    const headers = {
      'Authorization': `Bearer ${accessToken}`
    }

    return this.http.put<User>(
      `${apiEndpoint}users`,
      body,
      { headers: headers },
    )
  }

  deleteUser(id: string): Observable<any> {
    let params = new HttpParams().set('id', id)
    const accessToken = getToken("accessToken")
    const headers = {
      'Authorization': `Bearer ${accessToken}`
    }

    return this.http.delete(
      `${apiEndpoint}users`,
      {
        headers: headers,
        params: params
      }
    )
  }

  // update states
  setUsers(users: User[]) {
    this.users.set(users)
  }

  createUserState(newUser: User) {
    this.users.update(users => [...users, newUser])
  }

  updateUserState(updatedUser: User) {
    this.users.update(users => users.map(user => {
      if (user._id === updatedUser._id) {
        return updatedUser
      } else {
        return user
      }
    }))
  }

  deleteUserState(deletedUser: any) {
    this.users.update(users => users.filter(user => user._id != deletedUser._id))
  }
}
