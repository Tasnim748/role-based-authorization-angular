import { Component, Inject } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { 
  MatDialogTitle, 
  MatDialogContent, 
  MatDialogRef, 
  MatDialogClose, 
  MatDialogActions,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-edit-modal',
  standalone: true,
  imports: [
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatButtonModule,
    NgTemplateOutlet
  ],
  templateUrl: './edit-modal.component.html',
  styleUrl: './edit-modal.component.scss'
})
export class EditModalComponent {
  constructor(
    public dialogRef: MatDialogRef<EditModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  onConfirm(event: string) {
    this.dialogRef.close(event)
  }
}
