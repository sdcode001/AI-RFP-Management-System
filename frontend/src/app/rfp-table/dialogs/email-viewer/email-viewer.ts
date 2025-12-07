import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'email-viewer',
  templateUrl: './email-viewer.html', 
  styleUrl: './email-viewer.css',
  standalone: true,
  imports: [MatDialogModule]
})
export class EmailViewerComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
