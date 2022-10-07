import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { Firestore } from '@angular/fire/firestore';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithEmailAndPassword } from 'firebase/auth';
import * as firebase from 'firebase/compat';
import { getFirestore } from 'firebase/firestore';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  app: FirebaseApp = initializeApp(environment.firebase);
  db: Firestore = getFirestore(this.app);
  
  private auth = getAuth(this.app);
  private user = {
    uid: '',
    email: '',
    isAnonymous: true
  }
  private token: string = '';

  constructor() {
    signInAnonymously(this.auth).then( userCredential => {
      this.user.uid = userCredential.user.uid;
      this.user.isAnonymous = userCredential.user.isAnonymous;
      userCredential.user.getIdToken().then( token => {
        this.token = token;
      });
      console.log(userCredential.user);
    });
  }

  setUser(user: User) {
    signInWithEmailAndPassword(this.auth, user.email, user.password).then( userCredential => {
      this.user.uid = userCredential.user.uid;
      this.user.email = userCredential.user.email ? userCredential.user.email : '';
      this.user.isAnonymous = userCredential.user.isAnonymous;
      console.log(userCredential.user);
    },
    (err) => {
      console.log(err);
    });
  }

  getUser(): Object {
    return this.user;
  }

  getToken(): string {
    return this.token;
  }

}
