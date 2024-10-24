import { Routes } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { NewsComponent } from './components/news/news.component';
import { UsersComponent } from './components/users/users.component';
import { RolesComponent } from './components/roles/roles.component';


export const routes: Routes = [
    { path: 'signin', component: SignInComponent },
    { path: 'news', component: NewsComponent },
    { path: 'users', component: UsersComponent },
    { path: 'roles', component: RolesComponent }
]
