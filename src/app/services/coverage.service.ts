import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export type CoverageStatus = 'Live' | 'ongoing' | 'coming soon' | 'not available';

export interface CoverageBase {
    id: string;
    name: string;
    status: CoverageStatus;
}

export interface State extends CoverageBase { }
export interface City extends CoverageBase { }
export interface Zone extends CoverageBase { }
export interface Area extends CoverageBase { }

@Injectable({
    providedIn: 'root'
})
export class CoverageService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;

    getStates(): Observable<State[]> {
        return this.http.get<State[]>(`${this.apiUrl}/coverage/public/states`);
    }

    getCities(stateId: string): Observable<City[]> {
        return this.http.get<City[]>(`${this.apiUrl}/coverage/public/states/${stateId}/cities`);
    }

    getZones(cityId: string): Observable<Zone[]> {
        return this.http.get<Zone[]>(`${this.apiUrl}/coverage/public/cities/${cityId}/zones`);
    }

    getZonesPublic(): Observable<Zone[]> {
        return this.http.get<Zone[]>(`${this.apiUrl}/coverage/public/zones`);
    }

    getAreas(zoneId: string): Observable<Area[]> {
        return this.http.get<Area[]>(`${this.apiUrl}/coverage/public/zones/${zoneId}/areas`);
    }
}
