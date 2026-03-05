import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LeadMetadata {
  locality: string;
  localGovernment: string;
  lat: number;
  lng: number;
}

export interface LeadData {
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  type?: 'home' | 'business';
  serviceType?: 'home' | 'business';
  stateId?: string;
  cityId?: string;
  zoneId?: string;
  areaId?: string;
  lat?: number;
  lng?: number;
  source?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LeadService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  createLead(data: LeadData, _metadata?: any) {
    return this.publicLead(data).toPromise();
  }

  publicLead(data: LeadData): Observable<any> {
    const payload = {
      ...data,
      type: data.type || data.serviceType,
      source: 'web_app'
    };
    return this.http.post(`${this.apiUrl}/public/leads`, payload);
  }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/leads`);
  }

  getLeads(): Observable<any[]> {
    return this.getAll();
  }
}
