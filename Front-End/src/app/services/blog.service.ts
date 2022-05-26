import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { Firestore } from '@angular/fire/firestore';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, QueryDocumentSnapshot, QuerySnapshot, DocumentSnapshot, Timestamp } from 'firebase/firestore';
import { environment } from 'src/environments/environment';
import { Post } from '../models/post';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  app: FirebaseApp = initializeApp(environment.firebase);
  db: Firestore = getFirestore(this.app);

  constructor() { }

  getPosts(blog: string): Post[] {
    const DOCS: Post[] = [];
    getDocs(collection(this.db, blog)).then( (documents: QuerySnapshot) => {
      documents.forEach( (doc: QueryDocumentSnapshot) => {
        var post: Post = {
          date: doc.get('date'),
          description: doc.get('description'),
          content: doc.get('content')
        }
        DOCS.push(post);
      });
    });
    
    return DOCS;
  }

  getPost(blog: string, Post: Post): Post {
    var post: Post = {
      date: new Timestamp(new Date().getTime()/1000, new Date().getMilliseconds()),
      description: '',
      content: ''
    };

    getDoc(doc(this.db, '/'+blog+'/'+Post.docID)).then( (doc: DocumentSnapshot) => {
      post.date = doc.get('date');
      post.description = doc.get('description');
      post.content = doc.get('content');
    });

    return post;
  }

  createPost(blog: string, Post: Post) {
    return addDoc(collection(this.db, blog), Post);
  }

  updatePost(blog: string, Post: Post) {
    return setDoc(doc(this.db, '/'+blog+'/'+Post.docID), Post);
  }

  deletePost(blog: string, Post: Post) {
    return deleteDoc(doc(this.db, '/'+blog+'/'+Post.docID));
  } 
  
}
