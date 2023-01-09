import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable()
export class FirebaseAuthService {
  constructor(public angularFireAuth: AngularFireAuth) {
      
  }//end constructor

  registerUser(email: string, password: string): Promise<any> {
    return this.angularFireAuth.createUserWithEmailAndPassword(email, password);
  }//end registerUser

  loginUser(email: string, password: string): Promise<any> {
      
    return this.angularFireAuth.signInWithEmailAndPassword(email, password);
  }//end loginUser

  logoutUser(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.angularFireAuth.currentUser) {

        this.angularFireAuth
          .signOut()
          .then(() => {
            resolve(null);
          })
          .catch((error) => {
            reject();
          });
      }
    });
  }//end logoutUser

} //end_class
