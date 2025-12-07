import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { VendorService } from '../services/vendor.service';
import { VendorDialogComponent } from './vendor-dialog/vendor-dialog';
import { RfpDialogComponent } from './rfp-dialog/rfp-dialog';
import { Vendor } from '../models/vendor.model';
import { Rfp } from '../models/rfp.model';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RfpService } from '../services/rfp.service';
import { RfpTableComponent } from '../rfp-table/rfp-table';
import { SocketServerService } from '../services/socket.server';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DatePipe, MatTableModule, MatProgressSpinnerModule, MatCardModule, MatIconModule, MatToolbarModule, RfpTableComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit, OnDestroy {
  vendors: Vendor[] = [];
  rfps: Rfp[] = [];

  displayedVendorColumns = ['name', 'email'];
  displayedRfpColumns = ['title', 'createdAt'];

  loadingVendors = false;
  loadingRfps = false;

  constructor(
    private dialog: MatDialog,
    private vendorService: VendorService,
    private rfpService: RfpService,
    private cdr: ChangeDetectorRef,
    private socketServerService: SocketServerService
  ) {}

  ngOnInit(): void {
    this.refresh();
    this.socketServerService.connect();
    //subscribe to vendor-reply event and refresh
    this.socketServerService.on('vendor-reply').subscribe({
      next: async (data) => {
        console.log(data.message);
        this.refresh();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  ngOnDestroy(){
    this.socketServerService.disconnect();
  }

  refresh(){
    this.loadVendors();
    this.loadRfps();
  }


  loadVendors() {
    this.loadingVendors = true;
    this.vendorService.getVendors().subscribe({
      next: (res) => {
        this.vendors = res || [];
        this.loadingVendors = false;
      },
      error: () => (this.loadingVendors = false),
    });
  }

  // optional if you implement list RFPs
  loadRfps() {
    this.loadingRfps = true;
    this.rfpService.getRfpProposals().subscribe({
      next: (res) => {
        this.rfps = res?.data || [];
        this.loadingRfps = false;
        this.cdr.detectChanges();
      },
      error: () => (this.loadingRfps = false),
    });
  }

  openAddVendor() {
    const dialogRef = this.dialog.open(VendorDialogComponent, {
      width: '700px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((changed) => {
      if (changed) this.loadVendors();
    });
  }

  openAddRfp() {
    const dialogRef = this.dialog.open(RfpDialogComponent, {
      width: '700px',
      maxHeight: '90vh',
      disableClose: true,
      data: { vendors: this.vendors }, // pass vendors to dialog
    });

    dialogRef.afterClosed().subscribe((sent) => {
      if (sent) {
        // if you have list RFPs, reload
        this.loadRfps();
      }
    });
  }
}
