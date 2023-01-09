import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FireServiceProvider } from 'src/providers/api-service/fire-service';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { FirebaseAuthService } from 'src/providers/api-service/firebase-auth-service';
import { ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'ion2-calendar';
import { NgCalendarModule } from 'ionic2-calendar';

import { PipesModule } from './pipes/pipes.module';
import { GlobalVariablesService } from 'src/services/global-variables.service';
import { DatePipe } from '@angular/common';




@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), 
    AppRoutingModule,HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,ReactiveFormsModule,CalendarModule,NgCalendarModule, PipesModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
   FireServiceProvider,FirebaseAuthService,GlobalVariablesService, AppComponent, DatePipe],
  bootstrap: [AppComponent],
})


export class AppModule {}