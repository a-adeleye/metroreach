import { Injectable, inject, signal } from '@angular/core';
import { Auth, authState, signInWithEmailAndPassword, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink, signOut, User, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc, updateDoc, serverTimestamp } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable, of, from } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

export interface UserProfile {
    uid: string;
    email: string | null;
    permissions: string[];
    fullName?: string;
    phone?: string;
    createdAt?: any;
    lastLogin?: any;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private auth = inject(Auth);
    private firestore = inject(Firestore);
    private router = inject(Router);

    user = signal<User | null>(null);
    userProfile = signal<UserProfile | null>(null);
    isResolvingAuth = signal<boolean>(true);

    constructor() {
        authState(this.auth).pipe(
            switchMap(user => {
                if (user) {
                    this.user.set(user);
                    return from(this.getOrCreateUserProfile(user));
                } else {
                    this.user.set(null);
                    this.userProfile.set(null);
                    return of(null);
                }
            }),
            tap(() => this.isResolvingAuth.set(false))
        ).subscribe(profile => {
            if (profile) this.userProfile.set(profile);
        });
    }

    private async getOrCreateUserProfile(user: User): Promise<UserProfile | null> {
        try {
            const userDocRef = doc(this.firestore, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const data = userDoc.data();
                // Update last login
                await setDoc(userDocRef, { lastLogin: serverTimestamp() }, { merge: true });
                return {
                    uid: user.uid,
                    email: data['email'],
                    permissions: data['permissions'] || [],
                    fullName: data['fullName'],
                    phone: data['phone']
                };
            } else {
                // Create new profile
                const newProfile: UserProfile = {
                    uid: user.uid,
                    email: user.email,
                    permissions: ['USER'], // Default permission
                    fullName: user.displayName || user.email?.split('@')[0] || 'New User',
                    phone: '',
                    createdAt: serverTimestamp(),
                    lastLogin: serverTimestamp()
                };
                await setDoc(userDocRef, newProfile);
                return newProfile;
            }
        } catch (e) {
            console.error('Error in getOrCreateUserProfile', e);
            return null;
        }
    }

    async updateProfile(data: Partial<UserProfile>) {
        const currentUser = this.user();
        if (!currentUser) throw new Error('No user logged in');

        const userDocRef = doc(this.firestore, 'users', currentUser.uid);
        await updateDoc(userDocRef, data);

        // Update local signal
        this.userProfile.update(prev => prev ? { ...prev, ...data } : null);
    }

    async changePassword(currentPass: string, newPass: string) {
        const currentUser = this.auth.currentUser;
        if (!currentUser || !currentUser.email) throw new Error('No user logged in');

        // Re-authenticate first
        const credential = EmailAuthProvider.credential(currentUser.email, currentPass);
        await reauthenticateWithCredential(currentUser, credential);

        // Update password
        await updatePassword(currentUser, newPass);
    }

    async login(email: string, pass: string) {
        return signInWithEmailAndPassword(this.auth, email, pass);
    }

    async sendPasswordlessLink(email: string) {
        const actionCodeSettings = {
            url: window.location.origin + '/login',
            handleCodeInApp: true
        };
        await sendSignInLinkToEmail(this.auth, email, actionCodeSettings);
        window.localStorage.setItem('emailForSignIn', email);
    }

    async completePasswordlessSignIn() {
        if (isSignInWithEmailLink(this.auth, window.location.href)) {
            let email = window.localStorage.getItem('emailForSignIn');
            if (!email) {
                email = window.prompt('Please provide your email for confirmation');
            }
            if (email) {
                await signInWithEmailLink(this.auth, email, window.location.href);
                window.localStorage.removeItem('emailForSignIn');
            }
        }
    }

    async logout() {
        await signOut(this.auth);
        this.router.navigate(['/login']);
    }

    hasPermission(permission: string): boolean {
        const profile = this.userProfile();
        return !!profile && profile.permissions.includes(permission.toUpperCase());
    }
}
