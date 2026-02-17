import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { take, map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const auth = inject(Auth);

    return authState(auth).pipe(
        take(1),
        map(user => {
            if (user) {
                return true;
            }
            router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
            return false;
        })
    );
};
