import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';

@Injectable({
  providedIn: 'root',
})
export class GlobalMethodsService {
  constructor(private appComponent: AppComponent, private router: Router) {} //end constructor

  getUsuario() {
    this.appComponent.getGlobalUsu();
  } //end getUsuario
} //end class
