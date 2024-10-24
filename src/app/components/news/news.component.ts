import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NewsService } from '../../services/news/news.service';
import { AuthService } from '../../services/auth/auth.service';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { EditModalComponent } from '../edit-modal/edit-modal.component';

import { News } from '../../utilsAndAPIEndpoints/interfaces';
import { Signal } from '@angular/core';
import {
  setCookie,
  delete_cookie,
} from '../../utilsAndAPIEndpoints/cookieOperations';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
  ],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss',
})
export class NewsComponent implements OnInit {
  loading: boolean = true;

  news: Signal<News[]> = this.newsService.news;
  displayedColumns: string[] = ['title', 'body', 'delete', 'edit'];

  message: string = '';

  get currentUserPermissions(): string[] {
    return this.authService.currentUser ? this.authService.currentUser.role.permissions : []
  }
  get currentUserName(): string {
    return this.authService.currentUser ? this.authService.currentUser.username : ""
  }

  constructor(
    private newsService: NewsService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.newsService.getNews().subscribe({
      next: (resp) => {
        console.log(resp)
        this.newsService.setNews(resp)
        this.loading = false
      },
      error: (err) => {
        console.log(err.status, err.statusText);
        if (err.status === 404) {
          this.authService.refreshToken().subscribe({
            next: (value) => {
              setCookie('accessToken', value.accessToken);
              setCookie('refreshToken', value.refreshToken);
              location.reload();
            },
            error: (err) => {
              delete_cookie('accessToken');
              delete_cookie('refreshToken');
              this.message = "You're not logged in";
            },
          });
        } else if (err.status === 403) {
          this.message = "You're not allowed here";
        } else if (err.status === 401) {
          this.message = 'User has not any role';
        } else {
          this.message = 'Network Problem or internal server problem';
        }
        this.loading = false;
      },
    });
  }

  titleUpdate!: string;
  bodyUpdate!: string;
  idUpdate!: string;

  @ViewChild('editTemplate') editTemplate!: TemplateRef<any>;
  @ViewChild('deleteTemplate') deleteTemplate!: TemplateRef<any>;

  openAdd() {
    const diaRef = this.dialog.open(EditModalComponent, {
      data: { template: this.editTemplate, title: 'Create News' },
      width: '800px',
    });

    diaRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result === 'confirm') {
        this.submitAdd();
      }
      this.titleUpdate = '';
      this.bodyUpdate = '';
    });
  }

  submitAdd() {
    if (!(this.titleUpdate && this.bodyUpdate)) {
      alert('Please fill all the fields');
      return;
    }
    this.newsService
      .createNews({
        title: this.titleUpdate,
        body: this.bodyUpdate,
      })
      .subscribe({
        next: (resp) => {
          console.log(resp);
          this.newsService.createNewsState(resp)
        },
        error: (err) => {
          console.log(err);
          if (err.status === 404 || err.status === 401) {
            alert("session expired, please refresh the browser")
          } else {
            alert('You are not allowed to create news');
          }
        },
      });
  }

  onEditOpen(id: string, title: string, body: string) {
    this.titleUpdate = title;
    this.bodyUpdate = body;
    this.idUpdate = id;

    const diaRef = this.dialog.open(EditModalComponent, {
      data: { template: this.editTemplate, title: 'Edit News' },
      width: '800px',
    });

    diaRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result === 'confirm') {
        this.submitEdit();
      }
      this.titleUpdate = '';
      this.bodyUpdate = '';
      this.idUpdate = '';
    });
  }

  submitEdit() {
    console.log(this.idUpdate);
    if (!(this.titleUpdate && this.bodyUpdate)) {
      alert('Please fill all the fields');
      return;
    }
    this.newsService
      .updateNews({
        title: this.titleUpdate,
        body: this.bodyUpdate,
        _id: this.idUpdate,
      })
      .subscribe({
        next: (resp) => {
          console.log(resp);
          this.newsService.updateNewsState(resp)
        },
        error: (err) => {
          console.log(err);
          if (err.status === 404 || err.status === 401) {
            alert("session expired, please refresh the browser")
          } else {
            alert('You are not allowed to edit news');
          }
        },
      });
  }

  openDelete(id: string) {
    this.idUpdate = id;

    const diaRef = this.dialog.open(EditModalComponent, {
      data: { template: this.deleteTemplate, title: 'Delete News', confirmBtn: 'Yes' },
      width: '800px',
    });

    diaRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result === 'confirm') {
        this.submitDelete();
      }
      this.idUpdate = '';
    });
  }

  submitDelete() {
    console.log(this.idUpdate);
    this.newsService.deleteNews(this.idUpdate).subscribe({
      next: (resp) => {
        console.log(resp);
        this.newsService.deleteNewsState(resp);
      },
      error: (err) => {
        console.log(err);
        if (err.status === 404 || err.status === 401) {
          alert("session expired, please refresh the browser")
        } else {
          alert('You are not allowed to delete news');
        }
      },
    });
  }
}
