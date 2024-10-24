import { Component, inject, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { RouterOutlet, RouterLink, Router } from '@angular/router';

import { AuthService } from '../services/auth/auth.service';
import { RolesService } from '../services/roles/roles.service';

import {
  setCookie,
  delete_cookie,
} from '../utilsAndAPIEndpoints/cookieOperations';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrl: './main-nav.component.scss',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    RouterOutlet,
    RouterLink,
  ],
})
export class MainNavComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private rolesService: RolesService,
    private router: Router,
    private _snackbar: MatSnackBar
  ) {}
  ngOnInit(): void {
    this.authService.refreshToken().subscribe({
      next: (val) => {
        this.authService.setCurrentUser({
          username: val.username,
          role: val.role,
          tokenExpiry: JSON.parse(window.atob(val.refreshToken.split('.')[1])).exp * 1000
        })
        console.log(this.authService.currentUser)
        setCookie('accessToken', val.accessToken)
        setCookie('refreshToken', val.refreshToken)

        this.rolesService.getRoles().subscribe({
          next: (value) => {
            console.log(value);
            this.rolesService.setRoles(value);
          },
        });

        if (this.authService.currentUser) {
          setInterval(() => {
            console.log(new Date(new Date().getTime()))
            if (this.authService.isTokenExpired()) {
              console.log('token expired');
              console.log('routed to signin')
              this._snackbar.open(
                'Token expired, please login again!', 
                undefined, 
                {
                  duration: 5000,
                  verticalPosition: 'top'
                }
              )
              setInterval(() => {
                this.router.navigateByUrl('signin')
                this.logOut();
                console.log('')
              }, 5500)
            } else {
              console.log('checking')
            }
          }, 6000)
        }
      },
      error: (err) => {
        console.log(err.status)
        delete_cookie('accessToken');
        delete_cookie('refreshToken');
      },
    });
  }

  private breakpointObserver = inject(BreakpointObserver);

  get currentUserName(): string {
    return this.authService.currentUser
      ? this.authService.currentUser.username
      : '';
  }

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  get title(): string {
    return this.authService.currentUser
      ? `Welcome ${this.authService.currentUser.username}, Your role is ${this.authService.currentUser.role.name}`
      : 'Welcome';
  }

  logOut() {
    this.authService.logout().subscribe({
      next: (val) => {
        delete_cookie('accessToken');
        delete_cookie('refreshToken');
        alert(val.status);
        location.reload();
      },
      error: (err) => {
        delete_cookie('accessToken');
        delete_cookie('refreshToken');
        location.reload();
      },
    });
  }
}
