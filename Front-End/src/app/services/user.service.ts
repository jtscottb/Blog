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
export class UserService {
  app: FirebaseApp = initializeApp(environment.firebase);
  db: Firestore = getFirestore(this.app);
  user: User =  {
    id: 'ID',
    email: 'email@email.com',
    fname: 'FirstName',
    lname: 'LastName',
    uname: 'Username',
    password: 'Password',
    subscribe: false
  };

  constructor() { }

  addUser(entry: User) {
    return addDoc(collection(this.db, 'users'), entry);
  }

  updateUser(entry: User) {
    return setDoc(doc(this.db, '/users/'+entry.id), entry);
  }

  deleteUser(entry: User) {
    return deleteDoc(doc(this.db, '/users/'+entry.id));
  }
  
}
