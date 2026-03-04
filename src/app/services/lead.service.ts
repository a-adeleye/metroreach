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
  type: 'home' | 'business';
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
    // Keeping backward compatibility for now if needed, but preferring publicLead
    return this.publicLead(data).toPromise();
  }

  publicLead(data: LeadData): Observable<any> {
    const payload = {
      ...data,
      source: 'web_app'
    };
    return this.http.post(`${this.apiUrl}/public/leads`, payload);
  }
}
