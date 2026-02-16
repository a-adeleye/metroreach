import {ApplicationConfig, provideBrowserGlobalErrorListeners} from '@angular/core';
import {provideRouter} from '@angular/router';
import {getApp, initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {getAuth, provideAuth} from '@angular/fire/auth';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  provideFirestore,
} from '@angular/fire/firestore';
import {environment} from '../environments/environment';

import {routes} from './app.routes';
import {FIREBASE_OPTIONS} from '@angular/fire/compat';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    {provide: FIREBASE_OPTIONS, useValue: environment.firebase},
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() =>
      initializeFirestore(getApp(), {
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager(),
        }),
      })
    ),
  ]
};
