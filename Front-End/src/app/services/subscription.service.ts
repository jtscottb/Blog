import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { Firestore } from '@angular/fire/firestore';
import { initializeApp } from 'firebase/app';
import { addDoc, collection, deleteDoc, doc, getFirestore, setDoc } from 'firebase/firestore';
import { environment } from 'src/environments/environment';
import { Subscription } from '../models/subscription';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  app: FirebaseApp = initializeApp(environment.firebase);
  db: Firestore = getFirestore(this.app);

  constructor() { }

  subscribe(entry: Subscription) {
    return addDoc(collection(this.db, 'subscriptions'), entry);
  }

  updateSubscription(entry: Subscription) {
    return setDoc(doc(this.db, '/subscriptions/'+entry.id), entry);
  }

  deleteSubscription(entry: Subscription) {
    return deleteDoc(doc(this.db, '/subscriptions/'+entry.id));
  }
  
}
