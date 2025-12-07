import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vendor } from '../models/vendor.model';
import { Config } from '../../config';


@Injectable({ providedIn: 'root' })
export class VendorService {
  private baseUrl = Config.API_BASE_URL + '/api/vendor';

  constructor(private http: HttpClient) {}

  getVendors(): Observable<Vendor[]> {
    return this.http.get<Vendor[]>(this.baseUrl);
  }

  addVendor(payload: { name: string; email: string }): Observable<{message: string, data: Vendor}> {
    return this.http.post<{message: string, data: Vendor}>(this.baseUrl, payload);
  }
  
}
