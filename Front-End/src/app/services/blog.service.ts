import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { Firestore } from '@angular/fire/firestore';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, QueryDocumentSnapshot, QuerySnapshot, DocumentSnapshot, Timestamp, query, collectionGroup, where, orderBy, limit } from 'firebase/firestore';
import { environment } from 'src/environments/environment';
import { Post } from '../models/post';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  app: FirebaseApp = initializeApp(environment.firebase);
  db: Firestore = getFirestore(this.app);
  url: string = 'https://firestore.googleapis.com/v1/projects/adventuring-with-the-banks/databases/(default)/documents/';
  types: string[] = ['journal', 'finance', 'hair', 'cleaning', 'travel', 'fashion', 'cooking', 'home', 'beauty'];
  ex: string[] = ['journal', 'finance']

  constructor() { }

  getPosts(blog: string): Post[] {
    const DOCS: Post[] = [];
    getDocs(collection(this.db, blog)).then( (documents: QuerySnapshot) => {
      documents.forEach( (doc: QueryDocumentSnapshot) => {
        var post: Post = {
          docID: doc.id,
          date: doc.get('date'),
          description: doc.get('description'),
          content: doc.get('content')
        }
        DOCS.push(post);
      });
    });
    // this.http.get<Post[]>(this.url + blog);
    return DOCS;
  }

  getPost(blog: string, docID: string) {
    var post: Post = {
      docID: '',
      date: new Timestamp(new Date().getTime()/1000, new Date().getMilliseconds()),
      description: '',
      content: ''
    };
    getDoc(doc(this.db, '/'+blog+'/'+docID)).then( (doc: DocumentSnapshot) => {
      post.docID = doc.id;
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

  randomPost(): Post {
    const type: string = this.ex[Math.floor(Math.random()*this.ex.length)];
    const DOCS: Post[] = [];
    var randPost: Post = {
      docID: 'id',
      date: new Timestamp(new Date().getTime()/1000, new Date().getMilliseconds()),
      description: 'description',
      content: 'content'
    };
    getDocs(collection(this.db, type)).then( (documents: QuerySnapshot) => {
      documents.forEach( (doc: QueryDocumentSnapshot) => {
        var post: Post = {
          docID: doc.id,
          date: doc.get('date'),
          description: doc.get('description'),
          content: doc.get('content')
        }
        DOCS.push(post);
      });
      randPost = DOCS[Math.floor(Math.random()*DOCS.length)];
      console.log(randPost);
      return randPost;
    });
    console.log(randPost);

    var i = query(collectionGroup(this.db, type), orderBy("date", "desc"), limit(1));
    console.log(i);
    return randPost;
  }
  
}
