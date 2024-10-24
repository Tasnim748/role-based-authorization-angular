import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { apiEndpoint } from '../../utilsAndAPIEndpoints/apiEndpoints';
import { getToken } from '../../utilsAndAPIEndpoints/cookieOperations';
import { Role } from '../../utilsAndAPIEndpoints/interfaces';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(private http: HttpClient) { }

  roles = signal<Role[]>([])

  getRoles(): Observable<Role[]> {
    const accessToken = getToken("accessToken")

    const headers = {
      'Authorization': `Bearer ${accessToken}`
    }

    return this.http.get<Role[]>(
      `${apiEndpoint}roles`,
      { headers: headers }
    )
  }

  createRole(body: any): Observable<Role> {
    const accessToken = getToken("accessToken")
    const headers = {
      'Authorization': `Bearer ${accessToken}`
    }
    return this.http.post<Role>(
      `${apiEndpoint}roles`,
      body,
      { headers: headers }
    )
  }

  updateRole(body: any): Observable<Role> {
    const accessToken = getToken("accessToken")
    const headers = {
      'Authorization': `Bearer ${accessToken}`
    }

    return this.http.put<Role>(
      `${apiEndpoint}roles`,
      body,
      { headers: headers },
    )
  }

  deleteRole(id: string): Observable<any> {
    let params = new HttpParams().set('id', id)
    const accessToken = getToken("accessToken")
    const headers = {
      'Authorization': `Bearer ${accessToken}`
    }

    return this.http.delete(
      `${apiEndpoint}roles`,
      {
        headers: headers,
        params: params
      }
    )
  }

  setRoles(roles: Role[]): void {
    this.roles.set(roles)
  }

  createRoleState(newRole: Role) {
    this.roles.update(roles => [...roles, newRole])
  }

  updateRoleState(updatedRole: Role) {
    this.roles.update(roles => roles.map(role => {
      if (role._id === updatedRole._id) {
        return updatedRole
      } else {
        return role
      }
    }))
  }

  deleteRoleState(deletedRole: Role) {
    this.roles.update(roles => roles.filter(role => role._id != deletedRole._id))
  }
}
