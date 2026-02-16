import { Injectable, inject } from '@angular/core';
import {
    Firestore,
    collection,
    addDoc,
    serverTimestamp,
    collectionData,
    query,
    orderBy
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

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

    // Using a simple method to get the collection, ensuring the injected firestore is used
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

    getLeads(): Observable<any[]> {
        console.log('LeadService: getLeads called. Firestore instance:', this.firestore);
        const q = query(this.getLeadsCollection(), orderBy('createdAt', 'desc'));
        return collectionData(q, { idField: 'id' }) as Observable<any[]>;
    }
}
