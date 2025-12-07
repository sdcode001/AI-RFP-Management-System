import { JsonPipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'json-viewer',
  templateUrl: './json-viewer.html',
  styleUrl: './json-viewer.html',
  standalone: true,
  imports: [JsonPipe, MatDialogModule]
})
export class JsonViewerComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  buildProposalPreview(proposal: any): string {
    if (!proposal) return "";
    return `
          <h3>Vendor: ${proposal.vendorName || "Unknown Vendor"}</h3>
          <p><strong>Total Amount:</strong> ${proposal.currency || ""} ${proposal.totalAmount || "N/A"}</p>
          <h4>Line Items:</h4>
          <ul>
            ${
              (proposal.lineItems || [])
                .map(
                  (item: any) => `
              <li>
                <strong>${item.name}</strong> — Qty: ${item.qty}
                <br/>
                Unit Price: ${proposal.currency || ""} ${item.unitPrice}
                <br/>
                Total: ${proposal.currency || ""} ${item.totalPrice}
                <br/>
                Warranty: ${item.warrantyMonths || "N/A"} months
                <br/>
                Delivery: ${item.deliveryDays ?? "N/A"} days
              </li>`
                )
                .join("")
            }
          </ul>
          <h4>Commercial Details:</h4>
          <ul>
            <li><strong>Payment Terms:</strong> ${proposal.paymentTerms || "N/A"}</li>
            <li><strong>Lead Time:</strong> ${proposal.leadTimeDays || "N/A"} days</li>
            <li><strong>Taxes:</strong> ${proposal.taxesPercent || 0}%</li>
          </ul>
          <h4>Other Terms:</h4>
          <p>${proposal.otherTerms || "N/A"}</p>
          <h4>Completeness Check:</h4>
          <ul>
            <li><strong>Has Prices:</strong> ${proposal.completeness?.hasPrices ? "Yes" : "No"}</li>
            <li><strong>Has Delivery:</strong> ${proposal.completeness?.hasDelivery ? "Yes" : "No"}</li>
            <li><strong>Has Warranty:</strong> ${proposal.completeness?.hasWarranty ? "Yes" : "No"}</li>
          </ul>
          <h4>Summary:</h4>
          <p>${proposal.summary || "N/A"}</p>
        `;
    }

}
