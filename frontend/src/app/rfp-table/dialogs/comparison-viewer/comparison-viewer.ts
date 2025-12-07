import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RfpService } from '../../../services/rfp.service';
import { NgxEchartsModule } from 'ngx-echarts';
import { DecimalPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-comparison-viewer',
  standalone: true,
  imports: [NgxEchartsModule, DecimalPipe, NgIf],
  templateUrl: './comparison-viewer.html',
  styleUrl: './comparison-viewer.css',
})
export class ComparisonViewerComponent implements OnInit{
  comparisonData: any;
  winner: any;
  recommendationSummary = "";
  //Chart Options
  overallBar: any;
  priceBar: any;
  radarChart: any;
  loading = false;

   constructor(@Inject(MAT_DIALOG_DATA) public rfpId: any, private rfpService: RfpService, private cdr: ChangeDetectorRef) {}

   ngOnInit(){
     this.refresh();

   }

   refresh(){
     this.loading = true;
     this.rfpService.getRfpComparison(this.rfpId).subscribe({
      next: (res) => {
      this.comparisonData = res.data;
      const vendors = res.data.vendors;
      const ai = res.data.aiAnalysis;
      this.winner = ai?.winner || null;
      this.recommendationSummary = ai?.recommendationSummary || "";
      // Build charts
      this.buildOverallBar(vendors);
      this.buildPriceBar(vendors);
      this.buildRadarChart(vendors);
      this.loading=false;
      this.cdr.detectChanges();
      },
      error: (err) => {this.loading=false; console.error(err)},
    });
   }

   buildOverallBar(vendors: any[]) {
    this.overallBar = {
      title: { text: "Overall Vendor Score", left: "center" },
      tooltip: {},
      xAxis: {
        type: 'category',
        data: vendors.map(v => v.vendorName)
      },
      yAxis: { type: 'value', max: 1 },
      series: [
        {
          data: vendors.map(v => v.scores.overallScore),
          type: 'bar',
          label: { show: true, position: 'top' }
        }
      ]
    };
  }

  buildPriceBar(vendors: any[]) {
    this.priceBar = {
      title: { text: "Total Price Comparison", left: "center" },
      tooltip: {},
      xAxis: {
        type: 'category',
        data: vendors.map(v => v.vendorName)
      },
      yAxis: { type: 'value' },
      series: [
        {
          data: vendors.map(v => v.totalAmount),
          type: 'bar',
          label: { show: true, position: 'top' }
        }
      ]
    };
  }

  buildRadarChart(vendors: any[]) {
    const radarIndicators = [
      { name: 'Price Score', max: 1 },
      { name: 'Delivery Score', max: 1 },
      { name: 'Warranty Score', max: 1 },
      { name: 'Completeness Score', max: 1 },
      { name: 'Payment Score', max: 1 },
    ];

    this.radarChart = {
      title: { text: "Vendor Criteria Radar Comparison", left: "center" },
      tooltip: {},
      legend: {
        data: vendors.map(v => v.vendorName),
        bottom: 0
      },
      radar: { indicator: radarIndicators },
      series: [
        {
          type: 'radar',
          data: vendors.map(v => ({
            value: [
              v.scores.priceScore,
              v.scores.deliveryScore,
              v.scores.warrantyScore,
              v.scores.completenessScore,
              v.scores.paymentScore
            ],
            name: v.vendorName
          }))
        }
      ]
    };
  }

}
