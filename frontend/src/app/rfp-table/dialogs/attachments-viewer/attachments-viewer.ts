import { NgFor, NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Config } from '../../../../config';

@Component({
  selector: 'attachments-viewer',
  templateUrl: './attachments-viewer.html',
  styleUrl: './attachments-viewer.css',
  standalone: true,
  imports: [MatDialogModule,NgFor, NgIf]
})
export class AttachmentsViewerComponent {
  serverBaseUrl = Config.API_BASE_URL
  constructor(@Inject(MAT_DIALOG_DATA) public data: any[]) {}
}
