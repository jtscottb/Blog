import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { Firestore } from '@angular/fire/firestore';
import { initializeApp } from 'firebase/app';
import { addDoc, collection, deleteDoc, doc, getFirestore, setDoc } from 'firebase/firestore';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  app: FirebaseApp = initializeApp(environment.firebase);
  db: Firestore = getFirestore(this.app);

  constructor(private session: SessionService) { }

  login(user: User) {
    this.session.setUser(user);
  }
  
}
