import { Component } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth/auth.service';

import { setCookie, getToken, delete_cookie } from '../../utilsAndAPIEndpoints/cookieOperations';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {
  constructor(
    private authService: AuthService, 
    private router: Router,
  ) {
  }

  username!: string
  password!: string


  onSubmitHandle() {
    this.authService.signIn(this.username, this.password).subscribe(
      {
        next: response => {
            console.log(response)
            setCookie('accessToken', response.accessToken)
            setCookie('refreshToken', response.refreshToken)
            location.href = '/'
        },
        error: err => {
            if (err.status === 404) {
              alert('user not found')
            } else if (err.status === 401) {
              alert('This user does not have a valid role')
            } else {
              alert('wrong password')
            }
        }
      }
    )
  }
}
