import {inject, Injectable} from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  Firestore,
  orderBy,
  query,
  serverTimestamp,
  where
} from '@angular/fire/firestore';

import {map, Observable, shareReplay} from 'rxjs';

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
  serviceType: 'home' | 'business';

  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class LeadService {
  private firestore: Firestore = inject(Firestore);
  protected readonly collectionName = 'leads';

  protected colRef() {
    return collection(this.firestore, this.collectionName);
  }

  private getLeadsCollection() {
    return collection(this.firestore, 'leads');
  }

  async createLead(data: LeadData, metadata: LeadMetadata) {
    const submissionData = {
      ...data,
      ...metadata,
      source: 'web app',
      createdBy: data.email,
      createdAt: serverTimestamp()
    };

    return addDoc(this.getLeadsCollection(), submissionData);
  }

  getAll(filters: Record<string, string> = {}, includeDeleted = false) {
    return this.queryLive$((q: any) => {
      q = includeDeleted ? q : query(q, where('deleted', '!=', true));
      for (const [k, v] of Object.entries(filters)) q = query(q, where(k, '==', v));
      return q;
    });
  }

  protected queryLive$(build: any): Observable<any[]> {
    const q = build(query(this.colRef()));
    return collectionData(q, {idField: 'id'}).pipe(
      map(arr => arr),
      shareReplay({bufferSize: 1, refCount: true})
    );
  }


  getLeads(): Observable<any[]> {
    console.log('LeadService: [getLeads] Called');
    try {
      const col = this.getLeadsCollection();
      console.log('LeadService: [getLeads] Collection reference obtained');
      const q = query(col, orderBy('createdAt', 'desc'));
      console.log('LeadService: [getLeads] Query created');
      return collectionData(q, {idField: 'id'}) as Observable<any[]>;
    } catch (error) {
      console.error('LeadService: [getLeads] Exception caught:', error);
      throw error;
    }
  }
}
