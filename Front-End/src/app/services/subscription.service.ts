import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { Firestore } from '@angular/fire/firestore';
import { initializeApp } from 'firebase/app';
import { addDoc, collection, deleteDoc, doc, getFirestore, setDoc } from 'firebase/firestore';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  app: FirebaseApp = initializeApp(environment.firebase);
  db: Firestore = getFirestore(this.app);

  constructor() { }

  subscribe(entry: User) {
    return addDoc(collection(this.db, 'subscriptions'), entry);
  }

  updateSubscription(entry: User) {
    return setDoc(doc(this.db, '/subscriptions/'+entry.id), entry);
  }

  deleteSubscription(entry: User) {
    return deleteDoc(doc(this.db, '/subscriptions/'+entry.id));
  }
  
}
