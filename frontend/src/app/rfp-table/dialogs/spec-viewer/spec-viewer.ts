import { JsonPipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'spec-viewer',
  templateUrl:'./spec-viewer.html',
  styleUrl: './spec-viewer.css',
  standalone: true,
  imports: [JsonPipe, MatDialogModule]
})
export class SpecViewerComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  buildSpecFromJson(structuredSpec:any):string{
    if(!structuredSpec){return ''}
    return `
          <h3>${structuredSpec.title || "RFP Details"}</h3>
          <p><strong>Description:</strong> ${structuredSpec.description || "N/A"}</p>
          <h4>Items Required:</h4>
          <ul>
              ${structuredSpec.items
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
              <li><strong>Total Budget:</strong> ${structuredSpec.currency || ""} ${structuredSpec.totalBudget || "N/A"}</li>
              <li><strong>Delivery Timeline:</strong> ${structuredSpec.deliveryDays} days</li>
              <li><strong>Payment Terms:</strong> ${structuredSpec.paymentTerms || "N/A"}</li>
              <li><strong>Warranty:</strong> ${structuredSpec.warrantyMonths || "N/A"} months</li>
          </ul>`;
  }
  
}
