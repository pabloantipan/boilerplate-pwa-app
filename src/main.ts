import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { isDevMode } from '@angular/core';
import { provideServiceWorker } from '@angular/service-worker';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getRemoteConfig, provideRemoteConfig } from '@angular/fire/remote-config';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          }), provideFirebaseApp(() => initializeApp({ projectId: "food-app-a3878", appId: "1:612697412854:web:adc4db24a75afdea3b88d7", storageBucket: "food-app-a3878.firebasestorage.app", apiKey: "AIzaSyDxQPCvqDyenFVNPRi56P5pzvET09ryVMc", authDomain: "food-app-a3878.firebaseapp.com", messagingSenderId: "612697412854", measurementId: "G-HZ2PL5YZBK" })), provideAuth(() => getAuth()), provideRemoteConfig(() => getRemoteConfig()),
  ],
});
