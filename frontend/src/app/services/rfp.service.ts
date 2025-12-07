import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vendor } from '../models/vendor.model';
import { Config } from '../../config';
import { Rfp } from '../models/rfp.model';



@Injectable({ providedIn: 'root' })
export class RfpService {
  private url1 = Config.API_BASE_URL + '/api/structure-rfp';
  private url2 = Config.API_BASE_URL + '/api/send/';
  private url3 = Config.API_BASE_URL + '/api/rfp-proposals';
  private url4 = Config.API_BASE_URL + '/api/compare/';

  constructor(private http: HttpClient) {}


  structureRfp(payload: { query:string }): Observable<{message: string, data: Rfp}> {
    return this.http.post<{message: string, data: Rfp}>(this.url1, payload);
  }

  sendRfp(rfpId:string, vendorIds:string[]): Observable<{message: string, data: any}> {
    return this.http.post<{message: string, data: any}>(this.url2+rfpId, {vendorIds: vendorIds});
  }

   getRfpProposals(): Observable<{message: string, data: any[]}> {
     return this.http.get<{message: string, data: any[]}>(this.url3);
   }
  
  getRfpComparison(rfpId:string): Observable<{message: string, data: any}> {
     return this.http.get<{message: string, data: any}>(this.url4+rfpId);
  }
  
}