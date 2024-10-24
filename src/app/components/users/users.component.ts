import { Component, OnInit, ViewChild, TemplateRef, Signal } from '@angular/core';
import { UsersService } from '../../services/users/users.service';
import { AuthService } from '../../services/auth/auth.service';
import { RolesService } from '../../services/roles/roles.service';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';


import { MatDialog } from '@angular/material/dialog';
import { EditModalComponent } from '../edit-modal/edit-modal.component';

import { setCookie, delete_cookie } from '../../utilsAndAPIEndpoints/cookieOperations';
import { Role, User } from '../../utilsAndAPIEndpoints/interfaces';


@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  loading: boolean = true
  itemsPermission: boolean = false

  allRoles: Signal<Role[]> = this.rolesService.roles 

  get currentUserName(): string {
    return this.authService.currentUser ? this.authService.currentUser.username : ""
  }
  
  get currentUserRole(): string {
    return this.authService.currentUser ? this.authService.currentUser.role.name : ""
  }

  users: Signal<User[]> = this.usersService.users
  displayedColumns: string[] = ['username', 'role', 'delete', 'edit']

  message: string = ''

  constructor(
    private usersService: UsersService, 
    private authService: AuthService,
    private rolesService: RolesService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.usersService.getUsers().subscribe({
      next: resp => {
        console.log(resp)
        this.usersService.setUsers(resp)
        this.loading = false
        this.itemsPermission = true
      },
      error: err => {
        console.log(err.status, err.statusText)
        if (err.status === 404) {
          this.authService.refreshToken().subscribe({
            next: value => {
                setCookie("accessToken", value.accessToken)
                setCookie("refreshToken", value.refreshToken)
                location.reload()
            },
            error: err => {
              delete_cookie('accessToken')
              delete_cookie('refreshToken')
              this.message = "You're not logged in"
            }
          })
        } else if (err.status === 403) {
          this.message = "Only Admin is allowed here"
        } else if (err.status === 401) {
          this.message = "User has not any role"
        } else {
          this.message = "Network Problem or internal server problem"
        }
        this.loading = false
        this.itemsPermission = false
      }
    })
  }

  usernameUpdate!: string
  passwordUpdate!: string
  roleUpdate!: string
  idUpdate!: string

  @ViewChild('editTemplate') editTemplate!: TemplateRef<any>
  @ViewChild('deleteTemplate') deleteTemplate!: TemplateRef<any>

  openAdd() {
    const diaRef = this.dialog.open(
      EditModalComponent, 
      {
        data: {template: this.editTemplate, title: "Create User"},
        width: '800px'
      }
    )

    diaRef.afterClosed().subscribe(result => {
      console.log(result)
      if (result === 'confirm') {
        this.submitAdd();
      }
      this.usernameUpdate = ''
      this.passwordUpdate = ''
      this.roleUpdate = ''
    });
  }

  submitAdd() {
    if (!(this.usernameUpdate && this.passwordUpdate && this.roleUpdate)) {
      alert('Please fill all the fields')
      return
    }
    this.usersService.createUser({
      username: this.usernameUpdate,
      password: this.passwordUpdate,
      role: this.roleUpdate
    }).subscribe({
      next: resp => {
        console.log(resp)
        this.usersService.createUserState(resp)
      },
      error: err => {
        console.log(err)
        if (err.status === 404 || err.status === 401) {
          alert("session expired, please refresh the browser")
        } else {
          alert('You are not allowed to create user')
        }
      }
    })
  }

  onEditOpen(id: string, username: string, role: string) {
    this.usernameUpdate = username
    this.idUpdate = id
    this.roleUpdate = role

    const diaRef = this.dialog.open(
      EditModalComponent, 
      {
        data: {template: this.editTemplate, title: "Edit User"},
        width: '800px'
      }
    )

    diaRef.afterClosed().subscribe(result => {
      console.log(result)
      if (result === 'confirm') {
        this.submitEdit();
      }
      this.usernameUpdate = ''
      this.passwordUpdate = ''
      this.roleUpdate = ''
      this.idUpdate = ''
    });
  }

  submitEdit() {
    if (!this.usernameUpdate) {
      alert('Please fill the username field')
      return
    }
    let body
    if (this.passwordUpdate) {
      body = {
        username: this.usernameUpdate,
        password: this.passwordUpdate,
        roleId: this.roleUpdate,
        _id: this.idUpdate
      }
    } else {
      body = {
        username: this.usernameUpdate,
        roleId: this.roleUpdate,
        _id: this.idUpdate
      }
    }
    this.usersService.updateUser(body).subscribe({
      next: resp => {
        console.log(resp)
        this.usersService.updateUserState(resp)
      },
      error: err => {
        console.log(err)
        if (err.status === 404 || err.status === 401) {
          alert("session expired, please refresh the browser")
        } else {
          alert('You are not allowed to edit user')
        }
      }
    })
  }

  openDelete(id: string) {
    this.idUpdate = id

    const diaRef = this.dialog.open(
      EditModalComponent, 
      {
        data: {template: this.deleteTemplate, title: "Delete User", confirmBtn: "Yes"},
        width: '800px'
      }
    )

    diaRef.afterClosed().subscribe(result => {
      console.log(result)
      if (result === 'confirm') {
        this.submitDelete();
      }
      this.idUpdate = ''
    });
  }

  submitDelete() {
    this.usersService.deleteUser(this.idUpdate).subscribe({
      next: resp => {
        console.log(resp);
        this.usersService.deleteUserState(resp)
      },
      error: err => {
        console.log(err)
        if (err.status === 404 || err.status === 401) {
          alert("session expired, please refresh the browser")
        } else {
          alert('You are not allowed to delete user')
        }
      }
    })
  }

}
