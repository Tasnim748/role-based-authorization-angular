import { Component, ViewChild, TemplateRef, Signal } from '@angular/core';
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
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { EditModalComponent } from '../edit-modal/edit-modal.component';

import { Role } from '../../utilsAndAPIEndpoints/interfaces';

import {
  setCookie,
  delete_cookie,
} from '../../utilsAndAPIEndpoints/cookieOperations';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss',
})
export class RolesComponent {
  roles: Signal<Role[]> = this.rolesService.roles
  allPermissions = ['Create', 'Read', 'Update', 'Delete'];
  displayedColumns: string[] = ['name', 'permissions', 'delete', 'edit'];

  get currentUserRole(): string {
    return this.authService.currentUser
      ? this.authService.currentUser.role.name
      : '';
  }

  constructor(
    // private usersService: UsersService,
    private authService: AuthService,
    private rolesService: RolesService,
    private dialog: MatDialog
  ) {}

  roleNameUpdate!: string;
  rolePermissionsUpdate = new FormControl<string[]>([]);
  idUpdate!: string;

  @ViewChild('editTemplate') editTemplate!: TemplateRef<any>;
  @ViewChild('deleteTemplate') deleteTemplate!: TemplateRef<any>;

  openAdd() {
    const diaRef = this.dialog.open(EditModalComponent, {
      data: { template: this.editTemplate, title: 'Create Role' },
      width: '800px',
    });

    diaRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result === 'confirm') {
        this.submitAdd();
      }
      this.roleNameUpdate = '';
      this.rolePermissionsUpdate = new FormControl([]);
    });
  }

  submitAdd() {
    if (!(this.roleNameUpdate && this.rolePermissionsUpdate)) {
      alert('Please fill all the fields');
      return;
    }
    this.rolesService
      .createRole({
        name: this.roleNameUpdate,
        permissions: this.rolePermissionsUpdate.value,
      })
      .subscribe({
        next: (resp) => {
          console.log(resp);
          this.rolesService.createRoleState(resp)
        },
        error: (err) => {
          console.log(err);
          if (err.status === 404 || err.status === 401) {
            alert("session expired, please refresh the browser")
          } else {
            alert('You are not allowed to create role');
          }
        },
      });
  }

  onEditOpen(id: string, rolename: string, permissions: string[]) {
    this.idUpdate = id;
    this.roleNameUpdate = rolename;
    this.rolePermissionsUpdate = new FormControl(permissions);

    const diaRef = this.dialog.open(EditModalComponent, {
      data: { template: this.editTemplate, title: 'Edit Role' },
      width: '800px',
    });

    diaRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result === 'confirm') {
        this.submitEdit();
      }
      this.roleNameUpdate = '';
      this.rolePermissionsUpdate = new FormControl([]);
      this.idUpdate = '';
    });
  }

  submitEdit() {
    if (!(this.roleNameUpdate && this.rolePermissionsUpdate)) {
      alert('Please fill the role name field');
      return;
    }
    let body = {
      _id: this.idUpdate,
      name: this.roleNameUpdate,
      permissions: this.rolePermissionsUpdate.value,
    };
    this.rolesService.updateRole(body).subscribe({
      next: (resp) => {
        console.log(resp);
        this.rolesService.updateRoleState(resp)
      },
      error: (err) => {
        console.log(err);
        if (err.status === 404 || err.status === 401) {
          alert("session expired, please refresh the browser")
        } else {
          alert('You are not allowed to edit role');
        }
      },
    });
  }

  openDelete(id: string) {
    this.idUpdate = id;

    const diaRef = this.dialog.open(EditModalComponent, {
      data: { template: this.deleteTemplate, title: 'Delete Role', confirmBtn: 'Yes' },
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
    this.rolesService.deleteRole(this.idUpdate).subscribe({
      next: (resp) => {
        console.log(resp);
        this.rolesService.deleteRoleState(resp)
      },
      error: (err) => {
        console.log(err);
        if (err.status === 404 || err.status === 401) {
          alert("session expired, please refresh the browser")
        } else {
          alert('You are not allowed to delete role');
        }
      },
    });
  }
}
