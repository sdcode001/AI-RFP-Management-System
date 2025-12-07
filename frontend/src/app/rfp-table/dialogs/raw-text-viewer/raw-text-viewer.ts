import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'raw-text-viewer',
  templateUrl: './raw-text-viewer.html',
  styleUrl: './raw-text-viewer.css',
  standalone: true,
  imports: [MatDialogModule]
})
export class RawTextViewerComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
