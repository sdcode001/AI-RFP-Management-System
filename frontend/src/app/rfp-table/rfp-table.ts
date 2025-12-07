import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RawTextViewerComponent } from './dialogs/raw-text-viewer/raw-text-viewer';
import { SpecViewerComponent } from './dialogs/spec-viewer/spec-viewer';
import { EmailViewerComponent } from './dialogs/email-viewer/email-viewer';
import { JsonViewerComponent } from './dialogs/json-viewer/json-viewer';
import { AttachmentsViewerComponent } from './dialogs/attachments-viewer/attachments-viewer';
import { MatTableModule } from '@angular/material/table';
import { NgFor, NgIf } from '@angular/common';
import { ComparisonViewerComponent } from './dialogs/comparison-viewer/comparison-viewer';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-rfp-table',
  templateUrl: './rfp-table.html',
  styleUrls: ['./rfp-table.css'],
  standalone: true,
  imports: [
    MatTableModule,
    NgFor,
    NgIf,
  ]
})
export class RfpTableComponent implements OnChanges, OnInit {
  @Input() rfps: any[] = [];

   constructor(private dialog: MatDialog, private snackBar: MatSnackBar) {}

   ngOnInit(){
    
   }

  ngOnChanges(){
     
  }

  openRawText(raw: string) {
    this.dialog.open(RawTextViewerComponent, { width: '700px', data: raw });
  }

  openSpec(spec: any) {
    this.dialog.open(SpecViewerComponent, { width: '800px', data: spec });
  }

  openEmail(email: any) {
    this.dialog.open(EmailViewerComponent, { width: '700px', data: email });
  }

  openExtracted(json: any) {
    this.dialog.open(JsonViewerComponent, { width: '800px', data: json });
  }

  openAttachments(files: any[]) {
    this.dialog.open(AttachmentsViewerComponent, { width: '700px', data: files });
  }

  openComparison(rfpId:string, proposals:any[]){
    let replyCount = 0;
    for(const prop of proposals){
      if(prop.extracted!=null){replyCount++;}
    }
    //check for at least 1 reply from vendors, then only compare
    if(replyCount==0){
      this.snackBar.open("Can't compare! Required atleast one vendor reply.", 'Close', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'center'});
      return;
    }
    this.dialog.open(ComparisonViewerComponent, { width: '800px', data: rfpId });
  }


}
