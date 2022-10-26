import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { Firestore } from '@angular/fire/firestore';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { addDoc, collection, deleteDoc, doc, getFirestore, setDoc } from 'firebase/firestore';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  app: FirebaseApp = initializeApp(environment.firebase);
  db: Firestore = getFirestore(this.app);
  
  private auth = getAuth(this.app);
  public error = {
    code: '',
    message: ''
  }
  private subs: Subscription[] = [];

  constructor(private session: SessionService) {
    let u = this.session.getUser().subscribe( user => {
      if(!user) {
        this.signInAsGuest();
      } else if(user.uid) {
        this.session.setIsAdmin(!user.isAnonymous);
      }
    });
    this.subs = [u];
  }

  ngOnDestroy() {
    this.subs.forEach( s => {s.unsubscribe()});
  }

  signInAsGuest() {
    signInAnonymously(this.auth).then( userCredential => {
      userCredential.user.getIdToken().then( token => {
        this.session.setToken(token);
      });
      this.session.setUser(userCredential.user);
    });
  }

  async login(email: string, password: string): Promise<boolean> {
    let isAdmin: boolean = false;
    await signInWithEmailAndPassword(this.auth, email, password).then( userCredential => {
      userCredential.user.getIdToken().then( token => {
        this.session.setToken(token);
      });
      isAdmin = !userCredential.user.isAnonymous;
      this.session.setUser(userCredential.user);
    },
    (err) => {
      console.log(err);
      this.error.code = err.code;
      this.error.message = err.message;
    });
    return isAdmin;
  }

  logout() {
    signOut(this.auth).then( () => {
      this.signInAsGuest();
    });
  }
  
}
