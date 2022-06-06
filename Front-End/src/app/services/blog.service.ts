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

  async getPosts(blog: string): Promise<Post[]> {
    const DOCS: Post[] = [];
    await getDocs(collection(this.db, blog)).then( (documents: QuerySnapshot) => {
      documents.forEach( (doc: QueryDocumentSnapshot) => {
        var post: Post = {
          docID: doc.id,
          date: doc.get('date'),
          group: doc.get('group'),
          description: doc.get('description'),
          content: doc.get('content')
        }
        DOCS.push(post);
      });
    });
    return DOCS;
  }

  getPost(blog: string, docID: string): Post {
    var post: Post = {
      docID: '',
      date: new Timestamp(new Date().getTime()/1000, new Date().getMilliseconds()),
      group: 'group',
      description: '',
      content: ''
    };
    getDoc(doc(this.db, '/'+blog+'/'+docID)).then( (doc: DocumentSnapshot) => {
      post.docID = doc.id;
      post.date = doc.get('date');
      post.group = doc.get('group');
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

  async randomPost(blog: string): Promise<Post> {
    const type: string = this.types[Math.floor(Math.random()*this.types.length)];
    const DOCS: Post[] = await this.getPosts(blog);
    let randPost: Post = DOCS[Math.floor(Math.random()*DOCS.length)];

    /* if(DOCS.length > 0) {
      randPost = DOCS[Math.floor(Math.random()*DOCS.length)];
    } else {
      randPost = await this.randomPost(blog);
    } */

    return randPost;
  }

  async latestPost(): Promise<Post> {
    var latestPost: Post = {
      docID: 'id',
      date: new Timestamp(new Date('May 7, 2022 10:45:00').getTime()/1000, new Date().getMilliseconds()),
      group: 'group',
      description: 'description',
      content: 'content'
    };
    for(var t of this.types) {
      var DOCS: Post[] = await this.getPosts(t);
      if(DOCS.length > 0) {
        for(var d of DOCS) {
          latestPost = latestPost.date < d.date ? d : latestPost;
        }
      }
    }
    return latestPost;
  }
  
}
