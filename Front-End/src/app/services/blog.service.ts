import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { Firestore } from '@angular/fire/firestore';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, QueryDocumentSnapshot, QuerySnapshot, DocumentSnapshot, Timestamp, query, collectionGroup, where, orderBy, limit } from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';
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
  
  public categories = [
    {type: 'journal', title: 'Daily Dose'},
    {type: 'finance', title: 'Common Cents'},
    {type: 'hair', title: 'Hair, There, Everywhere'},
    {type: 'cleaning', title: 'Tidy Talk'},
    {type: 'travel', title: 'Pack Your Bags'},
    {type: 'fashion', title: 'Classy Threads'},
    {type: 'cooking', title: 'Herbs and Lemons'},
    {type: 'home', title: 'A Beautiful Mess'},
    {type: 'beauty', title: 'Almost Bare'}
  ]

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

  transformPost(post: Post): Post {
    let title: string = '';
    this.categories.forEach( cat => {
      if(post.group == cat.type) {
        title = cat.title;
      }
    });
    let fixedPost = {
      docID: post.docID,
      title: title,
      date: post.date,
      group: post.group,
      description: post.description,
      content: post.content
    }
    return fixedPost;
  }
  
}
