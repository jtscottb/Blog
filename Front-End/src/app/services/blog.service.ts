import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { Firestore } from '@angular/fire/firestore';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, QueryDocumentSnapshot, QuerySnapshot } from 'firebase/firestore';
import { environment } from 'src/environments/environment';
import { Entry } from '../models/entry';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  app: FirebaseApp = initializeApp(environment.firebase);
  db: Firestore = getFirestore(this.app);

  constructor() { }

  getEntries(blog: string) {
    const DOCS: Entry[] = [];
    getDocs(collection(this.db, blog)).then( (documents: QuerySnapshot) => {
      documents.forEach( (doc: QueryDocumentSnapshot) => {
        var post: Entry = {
          date: doc.get('date'),
          description: doc.get('description'),
          content: doc.get('content')
        }
        DOCS.push(post);
        console.log(doc.data());
      });
    });
    console.log(DOCS);
  }

  getEntry(blog: string, entry: Entry) {
    return getDoc(doc(this.db, '/'+blog+'/'+entry.docID));
  }

  createEntry(blog: string, entry: Entry) {
    return addDoc(collection(this.db, blog), entry);
  }

  updateEntry(blog: string, entry: Entry){
    return setDoc(doc(this.db, '/'+blog+'/'+entry.docID), entry);
  }

  deleteEntry(blog: string, entry: Entry){
    return deleteDoc(doc(this.db, '/'+blog+'/'+entry.docID));
  } 
  
}
