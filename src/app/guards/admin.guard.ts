import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { authState } from '@angular/fire/auth';
import { Auth } from '@angular/fire/auth';
import { take, map, switchMap } from 'rxjs';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

export const adminGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const auth = inject(Auth);
    const firestore = inject(Firestore);

    return authState(auth).pipe(
        take(1),
        switchMap(user => {
            if (!user) {
                router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
                return [false];
            }

            // Check Firestore for ADMIN permission
            return getDoc(doc(firestore, 'users', user.uid)).then(userDoc => {
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    const permissions = data?.['permissions'] || [];
                    if (permissions.includes('ADMIN')) {
                        return true;
                    }
                }
                router.navigate(['/']); // Redirect to home if not admin
                return false;
            });
        })
    );
};
