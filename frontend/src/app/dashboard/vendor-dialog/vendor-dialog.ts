import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { VendorService } from '../../services/vendor.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-vendor-dialog',
  standalone: true,
  imports: [MatProgressSpinnerModule, MatDialogModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './vendor-dialog.html',
  styleUrl: './vendor-dialog.css',
})
export class VendorDialogComponent {
    loading = false;
    form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<VendorDialogComponent>,
    private vendorService: VendorService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
  });
  }

  save() {
    if (this.form.invalid) return;
    this.loading = true;

    this.vendorService.addVendor(this.form.value as any).subscribe({
      next: (data) => {
        this.loading = false;
        this.snackBar.open(data.message, 'OK', { duration: 2000, verticalPosition: 'top', horizontalPosition: 'center'});
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.loading = false;
        const msg = err?.error?.message || 'Failed to create vendor';
        this.snackBar.open(msg, 'Close', { duration: 2000, verticalPosition: 'top', horizontalPosition: 'center'});
      },
    });
  }

  close() {
    this.dialogRef.close(false);
  }
}
