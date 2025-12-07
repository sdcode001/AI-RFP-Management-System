import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Vendor } from '../../models/vendor.model';
import { Rfp } from '../../models/rfp.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule, JsonPipe, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { RfpService } from '../../services/rfp.service';

@Component({
  selector: 'app-rfp-dialog',
  standalone: true,
  imports: [CommonModule, NgIf, MatProgressSpinnerModule, MatDialogModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatSelectModule, JsonPipe, MatCardModule],
  templateUrl: './rfp-dialog.html',
  styleUrl: './rfp-dialog.css',
})
export class RfpDialogComponent {
   vendors: Vendor[] = [];
   nlForm: FormGroup
   vendorSelectionForm: FormGroup

  creatingRfp = false;
  sendingRfp = false;

  rfpCreated: Rfp | null = null;


  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RfpDialogComponent>,
    private snackBar: MatSnackBar,
    private rfpService: RfpService,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.nlForm = this.fb.group({
      title: [''],
      text: ['', [Validators.required]],
    });

    this.vendorSelectionForm = this.fb.group({
      vendorIds: [[] as string[]],
    });
  }

  ngOnInit(): void {
    this.vendors = this.data.vendors || [];

  }

  generateWithAI() {
    if (this.nlForm.invalid) return;

    this.creatingRfp = true;
    this.rfpCreated = null;

    const payload = {
      query: this.nlForm.value.text || ""
    };

    this.rfpService.structureRfp(payload).subscribe({
      next: (res) => {
        this.creatingRfp = false;
        this.rfpCreated = res.data;
        this.snackBar.open(res.message, 'OK', { duration: 2000, verticalPosition: 'top', horizontalPosition: 'center'});
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.creatingRfp = false;
        const msg = err?.error?.message || 'Failed to create RFP';
        this.snackBar.open(msg, 'Close', { duration: 2000, verticalPosition: 'top', horizontalPosition: 'center'});
        this.cdr.detectChanges();
      },
    });
  }

  sendToVendors() {
    if (!this.rfpCreated) return;

    const vendorIds = this.vendorSelectionForm.value.vendorIds || [];
    if (!vendorIds.length) {
      this.snackBar.open('Select at least one vendor', 'Close', { duration: 2000 });
      return;
    }

    this.sendingRfp = true;

    this.rfpService.sendRfp(this.rfpCreated.id, vendorIds).subscribe({
      next: (res) => {
        this.sendingRfp = false;
        this.snackBar.open(res.message, 'OK', {duration: 2000, verticalPosition: 'top', horizontalPosition: 'center'});
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.sendingRfp = false;
        const msg = err?.error?.message || 'Failed to send RFP';
        this.snackBar.open(msg, 'Close',  {duration: 2000, verticalPosition: 'top', horizontalPosition: 'center'});
      },
    });
  }

  close() {
    this.dialogRef.close(false);
  }

  get hasStructuredResult() {
    return !!this.rfpCreated;
  }

  buildEmailBody(rfp:any):string{
    if(!rfp){return ''}
    return `<p>Hello,</p>
          <p>You are invited to submit a proposal for the following Request for Proposal (RFP):</p>
          <h3>${rfp.structuredSpec.title || "RFP Details"}</h3>
          <p><strong>Description:</strong> ${rfp.structuredSpec.description || "N/A"}</p>
          <h4>Items Required:</h4>
          <ul>
              ${rfp.structuredSpec.items
              .map((item:any) => `
                  <li>
                  <strong>${item.name}</strong> — Qty: ${item.qty}
                  <br/>
                  Specs: ${
                      Object.keys(item.specs || {}).length > 0
                      ? Object.entries(item.specs)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(", ")
                      : "None"
                  }
                  </li>
              `)
              .join("")}
          </ul>
          <h4>Commercial Requirements:</h4>
          <ul>
              <li><strong>Total Budget:</strong> ${rfp.structuredSpec.currency || ""} ${rfp.structuredSpec.totalBudget || "N/A"}</li>
              <li><strong>Delivery Timeline:</strong> ${rfp.structuredSpec.deliveryDays} days</li>
              <li><strong>Payment Terms:</strong> ${rfp.structuredSpec.paymentTerms || "N/A"}</li>
              <li><strong>Warranty:</strong> ${rfp.structuredSpec.warrantyMonths || "N/A"} months</li>
          </ul>
          <p>Please reply to this email with your detailed proposal, including pricing, delivery schedule, terms, and any relevant attachments.</p>
          <p><strong>Important:</strong> Replay to this mail and make sure subject remails exactly same.<br/>
          <p>Thank you,<br/>Procurement Team</p>`;
  }

}
